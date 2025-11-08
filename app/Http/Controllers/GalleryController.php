<?php

namespace App\Http\Controllers;

use App\Models\Models;
use App\Models\PreviewSales;
use App\Models\GallerySales;
use App\Models\PurchaseHistory;
use App\Models\Tag;
use App\Models\ContentWatchHistory;
use Illuminate\Support\Facades\App;
use App\Models\Gallery;
use App\Models\TokenPack;
use App\Models\TokenSale;
use Carbon\Carbon;
use App\Models\Video;
use App\Models\VideoCategories;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Intervention\Image\Facades\Image;

class GalleryController extends Controller
{
    public function adminGallery()
    {
        $active = 'gallery';
        $gallery = Gallery::orderByDesc('id');
        $gallery = $gallery->paginate(9);
        return view('admin.gallery', compact('gallery', 'active'));
    }

    public function addView()
    {
        $active = 'gallery';
        $video_categories = VideoCategories::orderBy('category')->get();

        $tags = Tag::orderBy('id', 'desc')->get();

        $model = Models::orderBy('id', 'desc')->get();

        $shortVideo = Video::select('id', 'title')->get();
        $systemVideo = [];

        foreach ($shortVideo as $details) {
            // $systemVideo[] = ['label' => $details->title, 'value' => $details->id];
            $title = json_decode($details->getRawOriginal('title'));
            $val = App::currentLocale();
            $systemVideo[] = ['label' => $title, 'value' => $details->id];
        }
        $streamer = User::select('id', 'username')->where('is_streamer', 'yes')->get();
        $supportedLocales = getSupportedLocales();

        return view('admin.add-gallery', compact('active', 'video_categories', 'tags', 'model', 'systemVideo', 'streamer','supportedLocales'));
    }

    public function saveGallery(Request $request)
    {  
        $request->merge([
                'is_promo_video' => $request->has('is_promo_video') ? $request->is_promo_video : 0
            ]);

        $validator = Validator::make($request->all(), [
            'title' => 'required',
            'thumbnail' => 'required|image|mimes:jpeg,png,jpg,gif,svg,webp',
            'description' => 'required',
            'images' => 'required|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,svg,webp'
        ]);

        if ($validator->fails()) {
            return back()->with('msg', $validator->errors()->first());
        }

        try {

            
            $titleData = ['en' => $request->title];
            if ($request->filled('title_lang') && $request->filled('title_de')) {
                $titleData[$request->title_lang] = $request->title_de;
            }

            // Step 2: Description ke liye dynamic array banayein
            $descriptionData = ['en' => $request->description];
            if ($request->filled('description_lang') && $request->filled('description')) {
                $descriptionData[$request->description_lang] = $request->description_de;
            }
            // dd($request->all(), $titleData, $descriptionData);

            $blog = new Gallery();
            $blog->is_promo_video = $request->is_promo_video;
            $blog->title = $titleData;
            $blog->title_lang = $request->title_lang;
            $blog->user_id = $request->user_id;
            $blog->description_lang = $request->description_lang;
            $blog->description = $descriptionData;
            $blog->slug = Str::slug($request->title);
            $blog->category_id = !empty($request->category_id) ? implode(',', $request->category_id) : null;
            $blog->model_id = !empty($request->model_id) ? implode(',', $request->model_id) : null;
            $blog->tags = !empty($request->tags) ? implode(',', $request->tags) : null;
            $blog->video_id = $request->video_id;

            if ($request->hasFile('thumbnail')) {
                $thumbnail = Image::make($request->file('thumbnail'))->stream();
                $thumbFile = 'gallery/thumbnail/' . uniqid() . '.' . $request->file('thumbnail')->getClientOriginalExtension();
                Storage::disk(env('FILESYSTEM_DISK'))->put($thumbFile, $thumbnail);
                Storage::disk(env('FILESYSTEM_DISK'))->setVisibility($thumbFile, 'public');
                $blog->thumbnail = $thumbFile;
            }

            if ($request->has('images')) {
                $addedImage = [];
                foreach ($request->images as $key => $image) {
                    $thumbnail = Image::make($image)->stream();
                    $thumbFile = 'gallery/' . uniqid() . '-' . $key . '.' . $image->getClientOriginalExtension();
                    Storage::disk(env('FILESYSTEM_DISK'))->put($thumbFile, $thumbnail);
                    Storage::disk(env('FILESYSTEM_DISK'))->setVisibility($thumbFile, 'public');
                    $addedImage[] = $thumbFile;
                }
                $blog->images = implode(',', $addedImage);
            }


            $blog->views = Gallery::RandomViews();
            $blog->seo = $request->has('seo') ? json_encode($request->seo) : null;
            $blog->save();

            return redirect()->route('admin.gallery.index')->with('msg', __('Gallery Pictures Added Successfully!'));
        } catch (\Exception $exception) {
            return back()->with('msg', $exception->getMessage());
        }
    }

    public function updateGallery(Request $request)
    {  
        $request->merge([
            'is_promo_video' => $request->has('is_promo_video') ? $request->is_promo_video : 0
        ]);

        $validator = Validator::make($request->all(), [
            'title' => 'required',
            'description' => 'required',
            'id' => 'required',
            'thumbnail' => 'sometimes|image|mimes:jpeg,png,jpg,gif,svg,webp',
            // 'images' => 'required|array',
            // 'images.*' => 'image|mimes:jpeg,png,jpg,gif,svg,webp'
        ]);

        if ($validator->fails()) {
            return back()->with('msg', $validator->errors()->first());
        }

        try {

            $titleData = ['en' => $request->title];
            if ($request->filled('title_lang') && $request->filled('title_de')) {
                $titleData[$request->title_lang] = $request->title_de;
            }

            // Step 2: Description ke liye dynamic array banayein
            $descriptionData = ['en' => $request->description];
            if ($request->filled('description_lang') && $request->filled('description')) {
                $descriptionData[$request->description_lang] = $request->description_de;
            }
            // dd($request->all(), $titleData, $descriptionData);

            $blog = Gallery::find($request->id);
            $blog->is_promo_video = $request->is_promo_video;
            $blog->title = $titleData;
            $blog->title_lang = $request->title_lang;
            $blog->description_lang = $request->description_lang;
            $blog->description = $descriptionData;
            $blog->user_id = $request->user_id;
            $blog->slug = Str::slug($request->title);
            $blog->category_id = !empty($request->category_id) ? implode(',', $request->category_id) : null;
            $blog->model_id = !empty($request->model_id) ? implode(',', $request->model_id) : null;
            $blog->tags = !empty($request->tags) ? implode(',', $request->tags) : null;
            $blog->video_id = $request->video_id;
            $hasNewthumbnail = false;

            if ($request->hasFile('thumbnail')) {
                $originalThumbnail = DB::table('gallery')->find($request->id)->thumbnail;
                $thumbnail = Image::make($request->file('thumbnail'))->stream();
                $thumbFile = 'gallery/thumbnail/' . uniqid() . '.' . $request->file('thumbnail')->getClientOriginalExtension();
                Storage::disk(env('FILESYSTEM_DISK'))->put($thumbFile, $thumbnail);
                Storage::disk(env('FILESYSTEM_DISK'))->setVisibility($thumbFile, 'public');
                $blog->thumbnail = $thumbFile;
                $hasNewthumbnail = true;
            }

            $photos = [];
            $filteredArray = [];

            $photos = explode(',', $blog->images);

            $filteredArray = array_filter($photos, function ($value) {
                return $value !== "";
            });

            //            if ($request->has('images')) {
            //                $addedImage = [];
            //                foreach ($request->images as $image) {
            //                    $thumbnail = Image::make($image)->stream();
            //                    $thumbFile = 'gallery/' . uniqid() . '.' . $image->getClientOriginalExtension();
            //                    Storage::disk(env('FILESYSTEM_DISK'))->put($thumbFile, $thumbnail);
            //                    Storage::disk(env('FILESYSTEM_DISK'))->setVisibility($thumbFile, 'public');
            //                    $addedImage[] = $thumbFile;
            //                }
            //                $blog->images = implode(',',$addedImage);
            //            }

            if ($request->has('images') && !empty($request->images)) {

                foreach ($request->images as $key => $image) {
                    $thumbnail = Image::make($image)->stream();
                    $thumbFile = 'gallery/' . uniqid() . '-' . $key . '.' . $image->getClientOriginalExtension();
                    Storage::disk(env('FILESYSTEM_DISK'))->put($thumbFile, $thumbnail);
                    Storage::disk(env('FILESYSTEM_DISK'))->setVisibility($thumbFile, 'public');
                    $filteredArray[] = $thumbFile;
                }
            }

            $blog->images = implode(',', $filteredArray);
            $blog->seo = $request->has('seo') ? json_encode($request->seo) : null;
            $blog->save();

            if ($hasNewthumbnail && $blog) {
                unlink(public_path($originalThumbnail));
            }

            return redirect()->route('admin.gallery.index')->with('msg', __('Gallery Pictures Updated Successfully!'));
        } catch (\Exception $exception) {
            return back()->with('msg', $exception->getMessage());
        }
    }

    public function editView(Request $request, $id)
    {
        $video = Gallery::find($id);

        if (!$video) {
            return redirect()->route('short.videos.index')->with('msg', __('Short video not exist!'));
        }
        $active = 'gallery';
        $video_categories = VideoCategories::orderBy('category')->get();

        $tags = Tag::orderBy('id', 'desc')->get();
        $ogValue = DB::table('gallery')->find($video->id);

        $isJson = Str::isJson($ogValue->title);

        if (!$isJson) {
            $ogValue->title = $ogValue->title;
            $ogValue->description = $ogValue->description;
        } else {
            $ogValue->title = json_decode($ogValue->title);
            $ogValue->description = json_decode($ogValue->description);
        }

        $model = Models::orderBy('id', 'desc')->get();

        $shortVideo = Video::select('id', 'title')->get();
        $systemVideo = [];

        foreach ($shortVideo as $details) {
            // $systemVideo[] = ['label' => $details->title, 'value' => $details->id];
            $title = json_decode($details->getRawOriginal('title'));
            $val = App::currentLocale();
            $systemVideo[] = ['label' => $title, 'value' => $details->id];
        }
        $streamer = User::select('id', 'username')->where('is_streamer', 'yes')->get();

        // dd($systemVideo);
        $supportedLocales = getSupportedLocales();

        if ($ogValue->title_lang === null || trim($ogValue->title_lang) === "") {
            $video->title_lang = "de";
            $ogValue->title_lang = "de";
        }

        if ($ogValue->description_lang === null || trim($ogValue->description_lang) === "") {
            $ogValue->description_lang = "de";
            $video->description_lang = "de";
        }
        // dd($ogValue->title_lang, $ogValue->description_lang, $ogValue);
        return view('admin.edit-gallery', compact('active', 'video_categories', 'tags', 'model', 'video', 'ogValue', 'systemVideo', 'streamer','supportedLocales'));
    }

    public function deleteGallery($id)
    {

        $originalThumbnail = DB::table('gallery')->find($id)->thumbnail;

        unlink(public_path($originalThumbnail));

        Gallery::find($id)->delete();

        return redirect()->route('admin.gallery.index')->with('msg', __('Gallery Deleted Successfully!'));
    }

    public function browse(Request $request)
    {
        $userrequest['page'] = $request->get("page", 1);

        $userrequest['sort'] = $request->get('sort', 'Recently');

        $whereUser = User::where('is_streamer_verified', 'yes')->where('is_streamer', 'yes')->pluck('id')->toArray();

        $videos = Gallery::where(function ($q) use ($whereUser) {
            $q->whereIn('user_id', $whereUser)->orWhere('user_id', null);
        });

        $randomvideos = (array)Gallery::where(function ($q) use ($whereUser) {
            $q->whereIn('user_id', $whereUser)->orWhere('user_id', null);
        })->inRandomOrder()->paginate(12)->toArray();

        switch ($request->sort) {
            case 'Most':
                $videos = $videos->orderByDesc('views');
                break;

            case 'Recently':
                $videos = $videos->orderByDesc('id');
                break;

            case 'Older':
                $videos = $videos->orderBy('created_at');
                break;

            case 'Highest':
                $videos = $videos->orderByDesc('price');
                break;

            case 'Lowest':
                $videos = $videos->orderBy('price');
                break;

            case 'Only Free':
                $videos = $videos->where('price', 0)->orderByDesc('views');
                break;
            case 'Latest':
            default:
                $videos = $videos->orderByDesc('id');
                break;
        }

        // if keyword
        if ($request->filled('search')) {
            $randomvideos = [];
            $userrequest['search'] = $request->search;

            $videos->where('title', 'LIKE', '%' . $request->search . '%');
        }

        // case categories
        $userrequest['selectedCategories'] = [];
        if ($request->filled('selectedCategories')) {
            $randomvideos = [];
            $userrequest['selectedCategories'] = $request->selectedCategories;
            //            dd($request->selectedCategories);
            $videos->where(function ($query) use ($request) {
                foreach ($request->selectedCategories as $key => $categoryId) {
                    if ($key == 0) {
                        $query->where('category_id', 'LIKE', "%{$categoryId}%");
                    } else {
                        $query->orWhere('category_id', 'LIKE', "%{$categoryId}%");
                    }
                }
            });
        }

        // case tags
        $userrequest['selectedTags'] = [];
        if ($request->filled('selectedTags')) {
            $randomvideos = [];
            $userrequest['selectedTags'] = $request->selectedTags;
            foreach ($request->selectedTags as $key => $tag) {
                if ($key == 0) {
                    $videos->where('tags', 'LIKE', "%{$tag}%");
                } else {
                    $videos->orWhere('tags', 'LIKE', "%{$tag}%");
                }
            }
        }
        $userrequest['selectedModels'] = [];
        if ($request->filled('selectedModels')) {
            $randomvideos = [];
            $userrequest['selectedModels'] = $request->selectedModels;
            foreach ($request->selectedModels as $key => $model) {
                if ($key == 0) {
                    $videos->where('model_id', 'LIKE', "%{$model}%");
                } else {
                    $videos->orWhere('model_id', 'LIKE', "%{$model}%");
                }
            }
            // $videos->whereIn('model_id', $request->selectedModels);
        }

        // fetch videos
        $videos = $videos->paginate(3)->appends($request->query())->toArray();

        // the image
        $exploreImage = asset('images/browse-videos-icon.png');

        // all video categories
        $categories = VideoCategories::orderBy('category')->get();

        // assing to simple category
        $category = $categories;

        $tags = Tag::orderBy('name')->get();

        $models = Models::orderBy('name')->get();

        // render the view

        $headTitle = $request->route()->getName() == 'home' ? 'FetishMegaStore' : 'Browse Gallery';

        return Inertia::render('Videos/BrowseGallery', compact('userrequest', 'videos', 'category', 'exploreImage', 'categories', 'tags', 'models', 'headTitle', 'randomvideos'));
    }

    public function deleteGalleryImage(Request $request)
    {

        $sepratePath = explode('/', $request->path);

        $getModel = Gallery::find($request->galleryId);

        $newtring = Str::replace($request->path, '', $getModel->images);

        $getModel->update(['images' => $newtring]);

        @unlink(public_path($request->path));

        return response()->json(['status' => 1, 'message' => 'Image Removed!']);
    }

    public function singleGallery(Request $request, $slug)
    {
        $video = Gallery::where('slug', $slug)->firstOrFail();

        $canBePlayed = true;
        $popupMessage = null;
        $popupMessage1 = null;

        $check = ContentWatchHistory::where(function ($q) use ($request) {
            $q->where('IP', $request->ip());
        })->where('date', Carbon::today()->format('Y-m-d'))
            ->where('user_id', auth()->id());

        $checkTheTodayWatchTime = $check->where('video_id', $video->id)->count();

        $squery = ContentWatchHistory::where(function ($q) use ($request) {
            $q->where('IP', $request->ip());
        })->where('date', Carbon::today()->format('Y-m-d'))
            ->where('user_id', auth()->id());


        $checkTodayPreviewWatched = $squery->count();

        if (auth()->check()) {
            $user = auth()->user();
            $today = Carbon::today()->format('Y-m-d');
            $minTokenPackTokens = TokenPack::min('tokens');
            $userTotalTokens = $user->tokens ?? 0;
           
            $hasPurchasedMinTokenOrMore = $userTotalTokens >= $minTokenPackTokens;
            if ($hasPurchasedMinTokenOrMore) {
                $canBePlayed = true;
                $popupMessage1 = null; 
            } else {
                $watchCount = ContentWatchHistory::where('date', $today)
                    ->where('IP', $request->ip())
                    ->where('user_id', $user->id)
                    ->where('type', 'gallery')
                    ->where('is_pre_login', 1)
                    ->count();

                if ($watchCount >= 3) {
                    $canBePlayed = false;
                    $popupMessage1 = __("You've reached your daily watch limit. Buy a token pack to continue watching.");
                } else {
                    ContentWatchHistory::create([
                        'user_id' => $user->id,
                        'IP' => $request->ip(),
                        'video_id' => $video->id,
                        'type' => 'gallery',
                        'date' => $today,
                        'is_pre_login' => 1,
                    ]);

                    $canBePlayed = true;
                    $popupMessage1 = null;
                }
            }
        }



        $video->increment('views');

        $url = $request->url();
        $slug = null;

        if ($video->video_id) {
            $fullVideo = DB::table('videos')->select('slug')->where('id', $video->video_id)->first();
            $slug = $fullVideo->slug ?? null;
        }

        // Token popup if user hasn't purchased and balance is low
        $showTokenPopup = false;
        if (auth()->check()) {
            $minTokenPackTokens = TokenPack::min('tokens');
            $hasPurchasedTokenPack = TokenSale::where('user_id', $user->id)->exists();

            if (!$hasPurchasedTokenPack && $user->tokens < $minTokenPackTokens && !session()->has('token_popup_shown')) {
                $showTokenPopup = true;
                $popupMessage = __("Your token balance is low. Buy a token pack to continue watching premium videos.");
                session(['token_popup_shown' => true]);
            }
        }

        ///SEO
        $currentLocale = app()->getLocale();
        $seo = json_decode($video->seo);
        $imgUrl = '';
        if (!empty($seo->og_image_url)) {
            $imgUrl =  $seo->og_image_url;
        } else if (!empty($video->thumbnail)) {
            $imgUrl =  $video->thumbnail;
        }

        $videoUrl = '';
        if (!empty($seo->cust_url)) {
            $videoUrl =  $seo->cust_url;
        } else if (!empty($video->slug)) {
            $videoUrl =  url('single-video', $video->slug);
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



        return Inertia::render('Videos/SingleGallery', [
            'video' => array_merge($video->toArray(), [
                'canBePlayed' => $canBePlayed,
                'popupMessage' => $popupMessage,
            ]),
            'popupMessage1' => !$canBePlayed ? $popupMessage1 : null,
            'userLoginID' => auth()->id() ?? null,
            'url' => url()->current(),
            'slug' => $slug,
            'auth' => [
                'user' => auth()->user(),
            ],
            'seo' => $seoDetail,
        ]);
    }

    public function unlockGallery(Gallery $video, Request $request)
    {

        if ($video->canBePlayed) {
            return back()->with('message', __('You already have access to this video'));
        }

        return Inertia::render('Videos/GalleryUnlock', compact('video'));
    }

    public function purchaseGallery(Gallery $video, Request $request)
    {


        // check if user already bought
        if ($video->canBePlayed) {
            return redirect(route('single.gallery', ['slug' => $video->slug]))->with('message', __('You already have access to this video'));
        }

        // record order
        $videoSale = new GallerySales();
        $videoSale->video_id = $video->id;
        $videoSale->user_id = $request->user()->id;
        $videoSale->price = $video->price;
        $videoSale->save();

        if ($videoSale) {
            $addpurchasehistory = new PurchaseHistory();
            $addpurchasehistory->type = 'gallery';
            $addpurchasehistory->video_id = $video->id;
            $addpurchasehistory->user_id = auth()->user()->id;
            $addpurchasehistory->ip = $request->ip();
            $addpurchasehistory->save();
        }

        // subtract from user balance
        $request->user()->decrement('tokens', $video->price);


        // redirect to my videos
        return redirect(route('single.gallery', ['slug' => $video->slug]))->with('message', __("Thank you, you can now see the gallery!"));
    }

    public function myGallery(Request $request)
    {
        $videos = $request->user()
            ->purchasedGallery();

        if ($request->has('search_term')) {
            $videos->where('title', 'LIKE', '%' . $request->search_term . '%');
        }

        $videos = $videos->paginate(4);

        return Inertia::render('Videos/OrderedGallery', compact('videos'));
    }

    public function increaseViews(Gallery $shortVideo, Request $request)
    {
        $sessionName = ip2long($request->ip()) . '_' . $shortVideo->id . '_short_video_viewed';
        $shortVideo->increment('views');
        $request->session()->put($sessionName, date('Y-m-d H:i:s'));
        return response()->json(['result' => 'INCREASED', 'session' => $sessionName]);
    }
}
