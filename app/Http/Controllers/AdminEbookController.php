<?php

namespace App\Http\Controllers;

use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\BunnyVideosList;
use App\Models\VideoCategories;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Models\Models;
use App\Models\Ebook;
use App\Models\User;
use App\Models\Tag;

class AdminEbookController extends Controller
{
    // ebook
    public function ebook(Request $r)
    {
        if ($r->filled('remove')) {
            if (env('IS_LIVE_DEMO', false) === true) {
                return back()->with('msg', 'No changes will be applied on this live demo.');
            }

            $ebook = Ebook::findOrFail($r->remove);
            $ebook->sales()->delete();
            $ebook->delete();

            return back()->with('msg', __('Ebook successfully removed!'));
        }

        $active = 'ebooks';
        // $ebooks = Ebook::orderByDesc('id');
        $ebooks = Ebook::orderByDesc('id')->with('streamer');

        if ($r->filled('search')) {
            $ebooks->where('title', 'LIKE', '%' . $r->search . '%');
        }

        if ($r->filled('category')) {
            $ebooks->where(function ($query) use ($r) {
                foreach ($r->category as $key => $categoryId) {
                    if ($key == 0) {
                        $query->where('category_id', 'LIKE', "%{$categoryId}%");
                    } else {
                        $query->orWhere('category_id', 'LIKE', "%{$categoryId}%");
                    }
                }
            });
        }

        if ($r->filled('tag')) {
            foreach ($r->tag as $key => $tag) {
                if ($key == 0) {
                    $ebooks->where('tags', 'LIKE', "%{$tag}%");
                } else {
                    $ebooks->orWhere('tags', 'LIKE', "%{$tag}%");
                }
            }
        }

        if ($r->filled('model')) {
            foreach ($r->model as $key => $model) {
                if ($key == 0) {
                    $ebooks->where('model_id', 'LIKE', "%{$model}%");
                } else {
                    $ebooks->orWhere('model_id', 'LIKE', "%{$model}%");
                }
            }
        }

        if ($r->filled('channels')) {
            $ebooks->whereIn('user_id', $r->channels);
        }

        $tag = Tag::all();
        $category = VideoCategories::all();
        $model = Models::all();

        $channles = User::select('username', 'id')->where('is_streamer', 'yes')->get();

        $ebooks = $ebooks->paginate(9);

        return view('admin.ebook.index', compact('active', 'ebooks', 'tag', 'category', 'model', 'channles'));
    }

    // edit ebook
    public function editEbook(Ebook $ebook)
    {
        $active = 'ebook';
        $categories = VideoCategories::orderBy('category')->get();

        $ogValue = DB::table('ebooks')->find($ebook->id);

        $models = Models::orderBy('id', 'desc')->get();

        $tags = Tag::orderBy('id', 'desc')->get();

        $isJson = Str::isJson($ogValue->title);

        if (!$isJson) {
            $ogValue->title = $ogValue->title;
            $ogValue->description = $ogValue->description;
        } else {
            $ogValue->title = json_decode($ogValue->title);
            $ogValue->description = json_decode($ogValue->description);
        }

        // dd($ogValue);

        $imageDirectory = public_path('ebook');
        $availableaudio = \Illuminate\Support\Facades\File::files($imageDirectory);
        $fileNames = [];
        foreach ($availableaudio as $videoDeatils) {
            $array = [];
            $array['label'] = $videoDeatils->getFilename();
            $array['value'] = 'ebook/' . $videoDeatils->getFilename();
            $fileNames[] = $array;
        }

        $bunnyList = BunnyVideosList::selectRaw('label as value, name as label')->get()->toArray();

        $fileNames = array_merge($fileNames, $bunnyList);

        if ($ebook->ebook) {
            $ebook->ebook = explode('/', $ebook->ebook)[1];
        }

        $supportedLocales = getSupportedLocales();

        $decodedTitle = json_decode($ebook->title, true) ?? [];
        // dd($ebook->tags, $ebook);

        if ($ogValue->title_lang === null || trim($ogValue->title_lang) === "") {
            $ebook->title_lang = "de";
            $ogValue->title_lang = "de";
        }

        if ($ogValue->description_lang === null || trim($ogValue->description_lang) === "") {
            $ogValue->description_lang = "de";
            $ebook->description_lang = "de";
        }

        $streamers = User::where('is_streamer', 'yes')->orderBy('name','asc')->get();

        // dd($ogValue->title_lang, $ogValue->description_lang, $ogValue);
        return view('admin.ebook.edit-ebook', compact('active','streamers', 'ebook', 'categories', 'ogValue', 'models', 'tags', 'fileNames', 'supportedLocales'));
    }

    // update ebook
    public function saveEbook(Ebook $ebook, Request $request)
    {
        // dd($request->all());
        // if (env('IS_LIVE_DEMO', false) === true) {
        //     return back()->with('msg', 'No changes will be applied on this live demo.');
        // }

        $request->validate([
            'title' => 'required',
            'price' => 'required|numeric|min:0',
            'free_for_subs' => 'required|in:yes,no',
            'category_id.*' => 'required',
            'streamer' => 'required'
        ]);

        if ($request->filled('ebook_file')) {
            $ebook->ebook = $request->ebook_file;
            $ebook->save();
        }

        // resize & upload thumbnail
        if ($request->hasFile('thumbnail')) {
            $thumbnail = Image::make($request->file('thumbnail'))->fit(640, 320)->stream();
            $thumbFile = 'thumbnails/' . uniqid() . '-' . auth()->id() . '.' . $request->file('thumbnail')->getClientOriginalExtension();

            Storage::disk(env('FILESYSTEM_DISK'))->put($thumbFile, $thumbnail);
            Storage::disk(env('FILESYSTEM_DISK'))->setVisibility($thumbFile, 'public');

            $ebook->thumbnail = $thumbFile;
            $ebook->save();
        }

        $titleFromDb = is_string($ebook->title) ? json_decode($ebook->title, true) : $ebook->title;
        $titleArray = $titleFromDb ?? ['en' => ''];
        $titleArray['en'] = $request->title;
        if (!empty($request->title_lang) && !empty($request->title_de)) {
            $titleArray[$request->title_lang] = $request->title_de;
        }

        $descriptionFromDb = is_string($ebook->description) ? json_decode($ebook->description, true) : $ebook->description;
        $descriptionArray = $descriptionFromDb ?? ['en' => ''];
        $descriptionArray['en'] = $request->description;
        if (!empty($request->description_lang) && !empty($request->description_de)) {
            $descriptionArray[$request->description_lang] = $request->description_de;
        }

        $ebook->update([
            'user_id' => $request->streamer,
            'title_en' => $request->title_de,
            'title_de' => $request->description_de,
            'title' => $titleArray,
            'title_lang' => $request->title_lang,
            'slug' => Str::slug($request->title),
            'price' => $request->price,
            'free_for_subs' => $request->free_for_subs,
            'disk' => env('FILESYSTEM_DISK'),
            'category_id' => is_array($request->category_id) ? implode(',', $request->category_id) : $ebook->category_id,
            'model_id' => is_array($request->model_id) ? implode(',', $request->model_id) : $ebook->model_id,
            'is_from_ftp' => $request->is_from_ftp == '1' ? true : false,
            'tags' => $request->tags ? implode(',', $request->tags) : $ebook->tags,
            'description' => $descriptionArray,
            'description_lang' => $request->description_lang,
        ]);

        return redirect('admin/ebooks')->with('msg', __('Successfully updated ebook #' . $ebook->id));
    }

    /**
     * Naya ebook upload karne ka form dikhata hai. (ADD Form)
    */
    public function createEbook(Request $request)
    {
        // Gate::authorize('channel-settings');

        $ebook = new Ebook();
        $ebook->id = null;
        $ebook->price = 0;
        $ebook->free_for_subs = 'no';
        $ebook->is_from_ftp = 0;
        $ebook->thumbnail = null;
        $ebook->ebook_file = null;
        $ebook->category_id = null;
        $ebook->model_id = null;
        $ebook->tags = null;
        $ebook->title = ['en' => ''];
        $ebook->description = ['en' => ''];
        $ebook->title_lang = null;
        $ebook->description_lang = null;
        $ebook->seo = null;

        $ogValue = (object)[
            'title' => (object)['en' => ''],
            'description' => (object)['en' => ''],
            'description_lang' => null,
            'title_lang' => null,
            'seoDetails' => (object)[]
        ];

        $categories = VideoCategories::orderBy('category')->get()->map(fn($c) => ['label' => $c->category, 'value' => $c->id])->all();
        $models = Models::orderBy('id', 'desc')->get()->map(fn($m) => ['label' => $m->name, 'value' => $m->id])->all();
        $tags = Tag::orderBy('id', 'desc')->get()->map(fn($t) => ['label' => $t->name, 'value' => $t->name])->all();

        $fileNames = collect(File::files(public_path('ebooks')))
            ->map(fn($file) => ['label' => $file->getFilename(), 'value' => 'ebooks/' . $file->getFilename()])->all();

        $supportedLocales = getSupportedLocales();

        $selectedCategoryIds = [];
        $selectedModelIds = [];
        $selectedTagNames = [];

        $streamers = User::where('is_streamer', 'yes')->orderBy('name','asc')->get();
        return view('admin.ebook.add-ebook', compact(
            'ebook',
            'ogValue',
            'categories',
            'models',
            'tags',
            'fileNames',
            'supportedLocales',
            'selectedCategoryIds',
            'selectedModelIds',
            'selectedTagNames',
            'streamers'
        ));
    }

    /**
     * Naye ebook ko database mein store karta hai. (STORE Method)
    */
    public function storeEbook(Request $request)
    {
        // Gate::authorize('channel-settings'); // Authorization check

        $request->validate([
            'title_en' => 'required|string|min:2',
            'title_lang_val' => 'nullable|string|min:2',
            'description_en' => 'required|string|min:2',
            'description_lang_val' => 'nullable|string|min:2',
            'price' => 'required|numeric|min:0',
            'free_for_subs' => 'required|in:yes,no',
            'category_id' => 'required',
            'model_id' => 'nullable',
            'model_id.*' => 'exists:models,id',
            'tags' => 'required',
            'thumbnail' => 'required|image|mimes:png,jpg,jpeg,webp|max:2048',
            'ebook_file_input' => 'nullable|file|mimes:pdf,epub,mobi,azw3|max:102400',
            'ebook_file' => 'nullable|string',
            'streamer' => 'required',
        ]);

        DB::beginTransaction();
        try {
            $disk = env('FILESYSTEM_DISK', 'public');
            $thumbFile = null;
            $ebookFilePath = null;

            // Thumbnail upload
            if ($request->hasFile('thumbnail')) {
                $thumbnail = Image::make($request->file('thumbnail'))->fit(640, 320)->stream();
                $thumbFileName = 'thumbnails/' . uniqid() . '-' . Auth::user()->id . '.' . $request->file('thumbnail')->getClientOriginalExtension();
                Storage::disk($disk)->put($thumbFileName, $thumbnail);
                Storage::disk($disk)->setVisibility($thumbFileName, 'public');
                $thumbFile = $thumbFileName;
            }

            // Ebook file upload (local or FTP)
            if ($request->hasFile('ebook_file_input')) {
                $uploadedEbookFile = $request->file('ebook_file_input');
                $ebookFileName = 'ebooks/' . uniqid() . '-' . Auth::user()->id . '.' . $uploadedEbookFile->getClientOriginalExtension();
                Storage::disk($disk)->put($ebookFileName, file_get_contents($uploadedEbookFile->getRealPath()));
                Storage::disk($disk)->setVisibility($ebookFileName, 'public');
                $ebookFilePath = $ebookFileName;
            } elseif ($request->filled('ebook_file')) {
                $ebookFilePath = 'ebooks/' . $request->input('ebook_file');
            } else {
                throw new \Exception('Ebook file is required either via upload or FTP selection.');
            }

            // title_en and description_en data prep
            $titleData = ['en' => $request->title_en];
            if ($request->filled('title_lang') && $request->filled('title_de')) {
                $titleData[$request->title_lang] = $request->title_de;
            }

            $descriptionData = ['en' => $request->description_en];
            if ($request->filled('description_lang') && $request->filled('description_de')) {
                $descriptionData[$request->description_lang] = $request->description_de;
            }

            $category_ids_string = implode(',', $request->category_id);
            $model_ids_string = $request->model_id ? implode(',', $request->model_id) : null;
            $tags_string = $request->tags ? implode(',', $request->tags) : null;

            Ebook::create([
                'user_id' => $request->streamer,
                'title' => $titleData,
                'title_lang' => $request->title_lang,
                'title_en' => $request->title_en,
                'title_de' => $request->title_de,
                'description' => $descriptionData,
                'description_lang' => $request->description_lang,
                'slug' => Str::slug($request->title_en),
                'price' => $request->price,
                'free_for_subs' => $request->free_for_subs,
                'thumbnail' => $thumbFile,
                'ebook_file' => $ebookFilePath,
                'ebook' => $ebookFilePath,
                'disk' => $disk,
                'category_id' => $category_ids_string,
                'model_id' => $model_ids_string,
                'tags' => $tags_string,
                'seo' => $request->has('seo') ? json_encode($request->seo) : null,
                'views' => Ebook::RandomViews(),
            ]);

            DB::commit();

            return redirect('admin/ebooks')->with('msg', __('Ebook successfully uploaded'));
        } catch (ValidationException $e) {
            DB::rollBack();
            if ($thumbFile && Storage::disk($disk)->exists($thumbFile)) {
                Storage::disk($disk)->delete($thumbFile);
            }
            if (isset($uploadedEbookFile) && Storage::disk($disk)->exists($ebookFilePath)) {
                Storage::disk($disk)->delete($ebookFilePath);
            }
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            DB::rollBack();
            if ($thumbFile && Storage::disk($disk)->exists($thumbFile)) {
                Storage::disk($disk)->delete($thumbFile);
            }
            if (isset($uploadedEbookFile) && Storage::disk($disk)->exists($ebookFilePath)) {
                Storage::disk($disk)->delete($ebookFilePath);
            }
            Log::error("Ebook Save Failed: " . $e->getMessage() . " for user " . Auth::user()->id);
            return back()->with('error', 'An error occurred while saving the ebook. Please try again.')->withInput();
        }
    }
}
