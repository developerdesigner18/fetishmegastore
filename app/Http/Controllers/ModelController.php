<?php

namespace App\Http\Controllers;

use App\Models\ShortVideo;
use App\Models\User;

use App\Models\Video;
use Illuminate\Http\Request;
use App\Models\Models;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Intervention\Image\Facades\Image;

class ModelController extends Controller
{

    public $bunnyClient;

    public $accessKey = 'adc3e470-1c44-487b-8f938c786a3b-0348-4764';

    public $zone = 'fetishmegastore';

    public function __construct()
    {
        $this->bunnyClient = new \Bunny\Storage\Client($this->accessKey, $this->zone, 'de');
    }

    public function browse(Request $request)
    {
       

        $channels = new Models();

        // case search string
        if ($request->has('search')) {
            $search = $request->search;
            $channels = Models::where('name', 'LIKE', "%{$search}%");
        }


        $channels = $channels->orderBy('name', 'asc')->paginate(40)->appends($request->query());


        $exploreImage = asset('images/explore.png');


        return Inertia::render('Models', compact('channels', 'exploreImage'));
    }

//modelProfile
    public function modelProfile($id)   // here show model profile data
    { 
        
        // dd($id);
        // $user = User::find($id);   
        
        $category = Models::whereSlug($id)->first();

        if(!$category){
            return to_route('model.browse');
        }
        //prd($category);
        // Check if the user is logged in
        $isLoggedIn = auth()->check();  // true if logged in, false otherwise

        // OpenGraph tags
        $ogTags = [
            'title' => __(":channelName's channel (:handle)", ['channelName' => @$category->name ?? '', 'handle' => '@' . @$category->name ?? '']),
            'url' => route('category', ['id' => $category->id ?? '']),
            'image' => @$category->imageUrl ?? ''
        ];

        $userLoginID = auth()->check() ? auth()->id() : null;
        $currentLocale = app()->getLocale();
        $seo = json_decode($category->seo);
        
        $imgUrl = '';
        if (!empty($seo->og_image_url)) {
            $imgUrl =  $seo->og_image_url;
        } else if (!empty($category->thumbnail)) {
            $imgUrl =  $category->thumbnail;
        }

        $videoUrl = '';
        if (!empty($seo->cust_url)) {
            $videoUrl =  $seo->cust_url;
        } else if (!empty($video->slug)) {
            $videoUrl =  url('category', $category->slug);
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
        //dd($seo);
        // Send isLoggedIn flag to front-end


        $model = Models::whereSlug($id)->first();


       $preview = $model->shortVideos()->paginate(20);
//    $preview = $model->shortVideos()
//     ->select(['id', 'title', 'thumbnail', 'model_id']) // only needed columns
//     ->paginate(12);
      
    // dd( $preview);

       $galleries = $model->galleries()->paginate(20);
    //   dd($galleries );






        return Inertia::render('Model/Profile', compact('category', 'ogTags', 'isLoggedIn', 'userLoginID','seo','galleries','preview'));
    }


//    public function modelVideo($id)
//    {
//
////        $video = Video::with('streamer')
////            ->where('model_id', 'LIKE', "%{$id}%")
////            ->orderBy(DB::raw("JSON_UNQUOTE(JSON_EXTRACT(title, '$.$locale'))"), 'asc')
////            ->paginate(40);
//
////        return $video;
//
//        // Fetch all videos with the necessary conditions
//        $videos = Video::with('streamer')
//            ->whereRaw("FIND_IN_SET(?, model_id)", [$id])
//            ->get();
//
//
//// Sort the collection by the title accessor
//        $sortedVideos = $videos->sortBy(function ($video) {
//            return $video->title;
//        })->values(); // Use values() to reindex the collection
//
//// Paginate the sorted collection
//        $perPage = 15; // Set the items per page as per your requirement
//        $page = request()->get('page', 1); // Get the current page or default to 1
//        $paginatedVideos = new LengthAwarePaginator(
//            $sortedVideos->forPage($page, $perPage)->values(), // Ensure the subset is reindexed
//            $sortedVideos->count(),
//            $perPage,
//            $page,
//            ['path' => request()->url(), 'query' => request()->query()]
//        );
//
//        return response()->json($paginatedVideos);
//
//
////        return $user->videos()->with('streamer')->paginate(9);
//    }
    public function modelVideo($id)
    {
//        $sortedVideos = $videos->sortBy(function ($video) {
//            return $video->title;
//        })->values();
       
        $shortVideo = ShortVideo::whereRaw('FIND_IN_SET(?, model_id)', [$id])
            ->where('type', 'short-video')
            ->where(function ($q) {
                $q->where('price', 0)->orWhereNull('price');
            })
            ->inRandomOrder()
            ->paginate(12);

        $freeVideos = Video::whereRaw('FIND_IN_SET(?, model_id)', [$id])->where(function ($q) {
            $q->where('price', 0)
                ->orWhereNull('price');
        })
            ->with(['streamer'])
            ->inRandomOrder()
            ->take(6)
            ->get();


        $paidVideos = Video::whereRaw('FIND_IN_SET(?, model_id)', [$id])->where('price', '>', 0)
            ->with(['streamer'])
            ->inRandomOrder()
            ->paginate(12);

        // Merge paginated items properly
        $mergedResults = $freeVideos->merge($paidVideos->items())->merge($shortVideo->items())->shuffle();

        // Create custom pagination
        $paginatedResults = new \Illuminate\Pagination\LengthAwarePaginator(
            $mergedResults->forPage(1, 30), // Get first 30 items for the page
            count($mergedResults), // Total merged count
            30, // Items per page
            request()->get('page', 1), // Get current page from request
            ['path' => \Illuminate\Pagination\Paginator::resolveCurrentPath()]
        );

        $videos = $paginatedResults->toArray();

        $data = $videos;

        return $data;


//        return $user->videos()->with('streamer')->paginate(9);
    }

    public function modelManager(Request $request)
    {

        Gate::authorize('channel-settings');

        $videos = Models::where('added_by', Auth::user()->id)->paginate(9);

        return Inertia::render('Videos/ModelManager', compact('videos'));
    }

    public function uploadModel(Request $request)
    {
        Gate::authorize('channel-settings');

        return Inertia::render('Videos/Partials/UploadModel');
    }

    public function modelSave(Request $request)
    {


        Gate::authorize('channel-settings');

        $request->validate([
            'name' => 'required',
            'age' => 'required|integer',
            'size' => 'required|integer',
            'shoe_size' => 'required|integer',
            'country' => 'required',
            'weight' => 'required|integer',
            'thumbnail' => 'required|image|mimes:jpeg,png,jpg,gif,svg,webp',
            'images' => 'required|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,svg,webp'
        ]);


        $photos = [];
        if ($request->has('images') && !empty($request->images)) {
            if (count($request->images) > 10 && count($request->images) < 8) {
                return redirect()->back()->with('message', __('For Gallery You Must Select 8 to 10 photos'));
            }
            foreach ($request->images as $key => $galleryPhotos) {

                $thumbnail = Image::make($galleryPhotos)->fit(1080, 1350)->stream();
                $gallaryFile = 'models/gallery/' . time() . $key . '-' . $galleryPhotos->getClientOriginalExtension();
                $photos[] = 'models/gallery/' . time() . $key . '-' . $galleryPhotos->getClientOriginalExtension();
                Storage::disk(env('FILESYSTEM_DISK'))->put($gallaryFile, $thumbnail);
                Storage::disk(env('FILESYSTEM_DISK'))->setVisibility($gallaryFile, 'public');
                $this->bunnyClient->upload(public_path($gallaryFile), $gallaryFile);
                Storage::disk(env('FILESYSTEM_DISK'))->delete($gallaryFile);

            }
        }

        if ($request->hasFile('thumbnail')) {
            $thumbnail = Image::make($request->file('thumbnail'))->fit(1080, 1350)->stream();
            $thumbFile = 'models/' . uniqid() . '-' . $request->file('thumbnail')->getClientOriginalExtension();

            Storage::disk(env('FILESYSTEM_DISK'))->put($thumbFile, $thumbnail);
            Storage::disk(env('FILESYSTEM_DISK'))->setVisibility($thumbFile, 'public');
            $this->bunnyClient->upload(public_path($thumbFile), $thumbFile);
            Storage::disk(env('FILESYSTEM_DISK'))->delete($thumbFile);
        }

//        dd('GG');
        try {
            $model = new Models();
            $model->name = $request->name;
            $model->slug = Str::slug($request->name);
            $model->photo = $thumbFile;
            $model->country = $request->country;
            $model->age = $request->age;
            $model->size = $request->size;
            $model->shoe_size = $request->shoe_size;
            $model->weight = $request->weight;
            $model->description = $request->description ?? null;
            $model->added_by = Auth::user()->id;
            $model->photos = !empty($photos) ? implode(',', $photos) : null;
            $model->seo = $request->has('seo') ? json_encode($request->seo) : null;
            $model->save();

            return to_route('model.list')->with('message', __('Model Added Successfully!'));

        } catch (\Exception $exception) {
            return to_route('model.list')->with('message', $exception->getMessage());

        }
    }
}
