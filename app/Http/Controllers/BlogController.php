<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use App\Models\Category;
use App\Models\Tag;
use App\Models\Video;
use App\Models\VideoCategories;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Intervention\Image\Facades\Image;

class BlogController extends Controller
{
    public function index(Request $request)
    {
        $exploreImage = asset('images/explore.png');
        $blog = new Blog();

        if ($request->filled('search')) {
            $userrequest['search'] = $request->search;
            $blog = $blog->where('title', 'LIKE', '%' . $request->search . '%');
        }

        // case categories
        $userrequest['selectedCategories'] = [];
        if ($request->filled('selectedCategories')) {
            $userrequest['selectedCategories'] = $request->selectedCategories;
            $blog = $blog->whereRaw('FIND_IN_SET(?, category_id)', [$request->selectedCategories]);
        }

        // case tags
        $userrequest['selectedTags'] = [];
        if ($request->filled('selectedTags')) {
            $userrequest['selectedTags'] = $request->selectedTags;
            $blog = $blog->whereRaw('FIND_IN_SET(?, tag_id)', [$request->selectedTags]);
        }

        $categories = VideoCategories::orderBy('category')->get();
        $tags = Tag::orderBy('name')->get();

        // Get current page from request, default to 1
        $currentPage = $request->input('page', 1);
        $perPage = 10; // You can adjust this number

        // Paginate the results
        $blog = $blog->inRandomOrder()->paginate($perPage, ['*'], 'page', $currentPage);

        return Inertia::render('Blogs', compact('blog', 'exploreImage', 'userrequest', 'tags', 'categories'));
    }

    public function indexInfo($slug)
    {
        $exploreImage = asset('images/explore.png');
        $blog = Blog::where('slug', $slug)->first();
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
        }

        $currentLocale = app()->getLocale();
        $seo = json_decode($blog->seo);
        
        $imgUrl = '';
        if (!empty($seo->og_image_url)) {
            $imgUrl =  $seo->og_image_url;
        } else if (!empty($blog->thumbnail)) {
            $imgUrl =  $blog->thumbnail;
        }

        $videoUrl = '';
        if (!empty($seo->cust_url)) {
            $videoUrl =  $seo->cust_url;
        } else if (!empty($video->slug)) {
            $videoUrl =  url('blog', $blog->slug);
        }
        $seoDetail['title'] = $seo->h2 ?? '';
        $seoDetail['keyword'] = $seo->keyword ?? '';
        $seoDetail['meta_keyword'] = $seo->meta_keyword ?? '';
        $seoDetail['desc'] = $seo->desc ?? '';
        if ($currentLocale == 'de') {
            $seoDetail['title'] = $seo->de->h2 ?? '';
            $seoDetail['keyword'] = $seo->de->keyword ?? '';
            $seoDetail['meta_keyword'] = $seo->de->meta_keyword ?? '';
            $seoDetail['desc'] = $seo->de->desc ?? '';
        }
        $seoDetail['meta_robot'] = $seo->meta_robot ?? '';
        $seoDetail['og_title'] = $seo->og_title ?? '';
        $seoDetail['og_desc'] = $seo->og_desc ?? '';
        $seoDetail['cust_url'] = $videoUrl;
        $seoDetail['og_image_url'] = $imgUrl;
        $seoDetail['json_id'] = $seo->json_id ?? '';
        $seo = $seoDetail;
       
        return Inertia::render('StorySingle', compact('blog', 'exploreImage', 'videos','seo'));
    }


    public function adminIndex()
    {  
        
        $blogs = Blog::orderBy('id', 'desc')->get();
        return view('admin.blogs', compact('blogs'));
    }

    public function createBlog()
    {

        $categories = VideoCategories::orderBy('id', 'desc')->get();

        $tags = Tag::orderBy('id', 'desc')->get();


        return view('admin.add-blog', compact('categories', 'tags'));
    }

    public function editBlog($id)
    {
        $blog = Blog::find($id);
        $categories = VideoCategories::orderBy('id', 'desc')->get();

        $tags = Tag::orderBy('id', 'desc')->get();

        return view('admin.edit-blog', compact('blog', 'categories', 'tags'));
    }

    public function addBlog(Request $request)
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

            $blog = new Blog();
            $blog->title = json_encode($request->title);
            $blog->description = json_encode($request->description);
            $blog->slug = Str::slug($request->title['en']);
            $blog->category_id = !empty($request->category_id) ? implode(',', $request->category_id) : null;
            $blog->tag_id = !empty($request->tags) ? implode(',', $request->tags) : null;
            $blog->user_id = auth()->id();

            if ($request->hasFile('image')) {
                $thumbnail = Image::make($request->file('image'))->stream();
                $thumbFile = 'blogs/' . uniqid() . '-' . $request->file('image')->getClientOriginalExtension();
                Storage::disk(env('FILESYSTEM_DISK'))->put($thumbFile, $thumbnail);
                Storage::disk(env('FILESYSTEM_DISK'))->setVisibility($thumbFile, 'public');
                $blog->image = $thumbFile;
            }
            $blog->seo = $request->has('seo') ? json_encode($request->seo) : null;
            $blog->save();

            return redirect()->route('blog.index')->with('msg', __('Blog Added Successfully!'));

        } catch (\Exception $exception) {
            return back()->with('msg', $exception->getMessage());
        }

    }

    public function updateBlog(Request $request, $id)
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

            $blog = Blog::where('id', $id)->first();
            $blog->title = json_encode($request->title);
            $blog->description = json_encode($request->description);
            $blog->slug = Str::slug($request->title['en']);
            $blog->category_id = !empty($request->category_id) ? implode(',', $request->category_id) : null;
            $blog->tag_id = !empty($request->tags) ? implode(',', $request->tags) : null;
            $blog->user_id = auth()->id();

            if ($request->hasFile('image')) {
                $thumbnail = Image::make($request->file('image'))->stream();
                $thumbFile = 'blogs/' . uniqid() . '-' . $request->file('image')->getClientOriginalExtension();
                Storage::disk(env('FILESYSTEM_DISK'))->put($thumbFile, $thumbnail);
                Storage::disk(env('FILESYSTEM_DISK'))->setVisibility($thumbFile, 'public');
                $blog->image = $thumbFile;
            }
            $blog->seo = $request->has('seo') ? json_encode($request->seo) : null;
            $blog->save();

            return redirect()->route('blog.index')->with('msg', __('Blog Updated Successfully!'));

        } catch (\Exception $exception) {
            return back()->with('msg', $exception->getMessage());
        }

    }

    public function deleteBlog($id)
    {
        $blog = Blog::find($id)->delete();
        return redirect()->route('blog.index')->with('msg', __('Blog Deleted Successfully!'));
    }
}
