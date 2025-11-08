<?php

namespace App\Http\Controllers;


use App\Models\Glossar;
use App\Models\Category;
use App\Models\Tag;
use App\Models\Video;
use App\Models\VideoCategories;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Intervention\Image\Facades\Image;

class GlossarController extends Controller
{
    public function index(Request $request)
    {
        $exploreImage = asset('images/explore.png');
        $glossar = new Glossar();

        if ($request->filled('search')) {
            $userrequest['search'] = $request->search;
            $glossar = $glossar->where('title', 'LIKE', '%' . $request->search . '%');
        }

        // case categories
        $userrequest['selectedCategories'] = [];
        if ($request->filled('selectedCategories')) {
            $randomvideos = [];
            $userrequest['selectedCategories'] = $request->selectedCategories;
            $glossar = $glossar->whereRaw('FIND_IN_SET(?, category_id)', [$request->selectedCategories]);
        }

        // case tags
        $userrequest['selectedTags'] = [];
        if ($request->filled('selectedTags')) {
            $randomvideos = [];
            $userrequest['selectedTags'] = $request->selectedTags;
            $glossar = $glossar->whereRaw('FIND_IN_SET(?, tag_id)', [$request->selectedTags]);
        }

        $categories = VideoCategories::orderBy('category')->get();
        $tags = Tag::orderBy('name')->get();

        // Get current page from request, default to 1
        $currentPage = $request->input('page', 1);
        $perPage = 10; // You can adjust this number

        if($request->sort_by_alphabet) {
            $lang = App::currentLocale() == 'de' ? 'de' : 'en';
            $glossar = $glossar->whereRaw('JSON_UNQUOTE(JSON_EXTRACT(title, "$.' . $lang . '")) LIKE ?', [$request->sort_by_alphabet . '%'])
                ->orderByRaw('JSON_UNQUOTE(JSON_EXTRACT(title, "$.' . $lang . '")) ASC');
        } else {
            $glossar = $glossar->inRandomOrder();
        }

        // Paginate the results
        $glossar = $glossar->paginate($perPage, ['*'], 'page', $currentPage);

        return Inertia::render('Glossar', compact('glossar', 'exploreImage', 'userrequest', 'tags', 'categories'));
    }

    public function indexInfo($slug)
    {
        $exploreImage = asset('images/explore.png');
        $blog = Glossar::where('slug', $slug)->first();



        if ($blog) {
            $categoryIds = explode(',', $blog->category_id);
            $tagIds = explode(',', $blog->tag_id);
            $tagNames = Tag::whereIn('id', $tagIds)->pluck('name')->toArray();
            $videos = Video::query();
            if (!empty($categoryIds)) {
                $videos->orWhereIn('category_id', $categoryIds);
            }
            if (!empty($tagNames)) {
                $videos->orWhere(function ($query) use ($tagNames) {
                    foreach ($tagNames as $tagName) {
                        $query->orWhereRaw("FIND_IN_SET(?, tags)", [$tagName]);
                    }
                });
            }
            $videos = $videos->inRandomOrder()->take(8)->get();

            //dd($videos);
        }else{
            return to_route('web.glossar.index');
        }




        return Inertia::render('StorySingle', compact('blog', 'exploreImage', 'videos'));
    }


    public function adminIndex()
    {
        $glossar = Glossar::orderBy('id', 'desc')->get();
        return view('admin.glossar', compact('glossar'));
    }

    public function createGlossar()
    {

        $categories = VideoCategories::orderBy('id', 'desc')->get();

        $tags = Tag::orderBy('id', 'desc')->get();


        return view('admin.add-glossar', compact('categories', 'tags'));
    }

    public function editGlossar($id)
    {
        $glossar = Glossar::find($id);
        $categories = VideoCategories::orderBy('id', 'desc')->get();

        $tags = Tag::orderBy('id', 'desc')->get();

        return view('admin.edit-glossar', compact('glossar', 'categories', 'tags'));
    }

    public function addGlossar(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'title' => 'required',
            'description' => 'required',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg',
        ]);

        if ($validator->fails()) {
            return back()->with('msg', $validator->errors()->first());
        }

        try {

            $glossar = new Glossar();
            $glossar->title = json_encode($request->title);
            $glossar->description = json_encode($request->description);
            $glossar->slug = Str::slug($request->title['en']);
            $glossar->category_id = !empty($request->category_id) ? implode(',', $request->category_id) : null;
            $glossar->tag_id = !empty($request->tags) ? implode(',', $request->tags) : null;

            if ($request->hasFile('image')) {
                $thumbnail = Image::make($request->file('image'))->stream();
                $thumbFile = 'blogs/' . uniqid() . '-' . $request->file('image')->getClientOriginalExtension();
                Storage::disk(env('FILESYSTEM_DISK'))->put($thumbFile, $thumbnail);
                Storage::disk(env('FILESYSTEM_DISK'))->setVisibility($thumbFile, 'public');
                $glossar->image = $thumbFile;
            }
            $glossar->seo = $request->has('seo') ? json_encode($request->seo) : null;
            $glossar->save();

            return redirect()->route('glossar.index')->with('msg', __('Glossar Added Successfully!'));

        } catch (\Exception $exception) {
            return back()->with('msg', $exception->getMessage());
        }

    }

    public function updateGlossar(Request $request, $id)
    {

        $validator = Validator::make($request->all(), [
            'title' => 'required',
            'description' => 'required',
            'image' => 'sometimes|image|mimes:jpeg,png,jpg,gif,svg',
        ]);

        if ($validator->fails()) {
            return back()->with('msg', $validator->errors()->first());
        }

        try {

            $glossar = Glossar::where('id', $id)->first();
            $glossar->title = json_encode($request->title);
            $glossar->description = json_encode($request->description);
            $glossar->slug = Str::slug($request->title['en']);
            $glossar->category_id = !empty($request->category_id) ? implode(',', $request->category_id) : null;
            $glossar->tag_id = !empty($request->tags) ? implode(',', $request->tags) : null;

            if ($request->hasFile('image')) {
                $thumbnail = Image::make($request->file('image'))->stream();
                $thumbFile = 'blogs/' . uniqid() . '-' . $request->file('image')->getClientOriginalExtension();
                Storage::disk(env('FILESYSTEM_DISK'))->put($thumbFile, $thumbnail);
                Storage::disk(env('FILESYSTEM_DISK'))->setVisibility($thumbFile, 'public');
                $glossar->image = $thumbFile;
            }
            $glossar->seo = $request->has('seo') ? json_encode($request->seo) : null;
            $glossar->save();

            return redirect()->route('glossar.index')->with('msg', __('Glossar Updated Successfully!'));

        } catch (\Exception $exception) {
            return back()->with('msg', $exception->getMessage());
        }

    }

    public function deleteGlossar($id)
    {
        $glossar = Glossar::find($id)->delete();
        return redirect()->route('glossar.index')->with('msg', __('Glossar Deleted Successfully!'));
    }
}
