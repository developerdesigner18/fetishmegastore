<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\ShortVideo;
use App\Models\Video;
use App\Models\VideoCategories;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;
use Inertia\Inertia;

class BrowseCategoriesController extends Controller
{
    public function liveChannel()
    {
        $channel = User::isStreamer()
            ->where('live_status', 'online')
            ->with('categories')
            ->withCount(['followers', 'subscribers', 'videos'])
            ->inRandomOrder()
            ->first();

        if ($channel) {
            return $channel->only([
                'id',
                'username',
                'name',
                'profile_picture',
                'headline',
                'followers_count',
                'subscribers_count',
                'videos_count',
                'firstCategory',
                'categories'
            ]);
        } else {
            return false;
        }
    }

    public function liveNow()
    {
        $channels = User::isStreamer()
            ->where('live_status', 'online')
            ->with('categories')
            ->withCount(['followers', 'subscribers', 'videos'])
            ->paginate(40);

        return Inertia::render('LiveNow', compact('channels'));
    }

    public function browse(Request $request)
    {

        $channels = new VideoCategories();

        // case search string
        if ($request->has('search')) {
            $search = $request->search;
            $channels = VideoCategories::where('category', 'LIKE', "%{$search}%");
        }

        if ($request->filled('selectedCategories')) {
            $channels = $channels->whereIn('id', $request->selectedCategories);
        }

        $channels = $channels->orderBy('category', 'ASC');

        $channels = $channels->paginate(6)->appends($request->query());

        $exploreImage = asset('images/explore.png');

        $categories =  VideoCategories::orderBy('category')->get();

        $userrequest = [];
        $userrequest['selectedCategories'] =  $request->selectedCategories ?? [];

        return Inertia::render('Categories', compact('channels',  'exploreImage', 'categories', 'userrequest'));


        // Initialize the query builder
        /*$channelsQuery = VideoCategories::query();

        // Case search string
        if ($request->has('search')) {
            $search = $request->search;
            $channelsQuery->where('category', 'LIKE', "%{$search}%");
        }

        // Fetch the data without sorting
        $channels = $channelsQuery->get();

        // Decode JSON where applicable and prepare a collection
        $channels = $channels->map(function ($item) {
            // Check if the category is JSON encoded
            $category = json_decode($item->category, true);

            // If it's not JSON, use the string itself
            if (json_last_error() === JSON_ERROR_NONE) {
                // Assuming you want to sort by the 'en' key if JSON
                $item->sort_category = $category['en'] ?? '';
            } else {
                $item->sort_category = $item->category;
            }

            return $item;
        });

        // Sort the collection by 'sort_category' key
        $sortedChannels = $channels->sortBy('sort_category')->values();

        // Paginate the sorted collection manually
        $perPage = 20;
        $page = $request->page ?? 1;
        $paginatedChannels = new LengthAwarePaginator(
            $sortedChannels->forPage($page, $perPage),
            $sortedChannels->count(),
            $perPage,
            $page,
            ['path' => $request->url(), 'query' => $request->query()]
        );

        // Prepare additional data
        $exploreImage = asset('images/explore.png');

        // Return the view with paginated data
        return Inertia::render('Categories', [
            'channels' => $paginatedChannels,
            'exploreImage' => $exploreImage
        ]);*/
    }

    public function categoryProfile($id)
    {

     
        $category = VideoCategories::whereSlug($id)->first();

        $ogTags = [
            'title' => __(":channelName's channel (:handle)", ['channelName' => $category->category, 'handle' => '@' . $category->category]),
            'url' => route('category', ['id' => $category->id]),
            'image' => $category->imageUrl
        ];

        $userLoginID = auth()->id();

        $currentLocale = app()->getLocale();
        $seo = json_decode($category->seo);
        
        $imgUrl = '';
        if (!empty($seo->og_image_url)) {
            $imgUrl =  $seo->og_image_url;
        } else if (!empty($blog->thumbnail)) {
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
       
        //        return Inertia::render('Channel/User', compact('category',  'ogTags'));
        return Inertia::render('Category/Profile', compact('category', 'ogTags', 'userLoginID','seo'));
    }

    //    public function categoryVideos($id){
    //
    //        $video = Video::with('streamer')->where('category_id',$id)->where('price', '>=', 0)->paginate(30);
    //        //dd($video);
    //        return $video;
    //
    //
    //    }
    public function categoryVideos($id)
    {

        $shortVideo = ShortVideo::whereRaw('FIND_IN_SET(?, category_id)', [$id])
            ->where('type', 'short-video')
            ->where(function ($q) {
                $q->where('price', 0)->orWhereNull('price');
            })
            ->inRandomOrder()
            ->paginate(12);

        $freeVideos = Video::whereRaw('FIND_IN_SET(?, category_id)', [$id])->where(function ($q) {
            $q->where('price', 0)
                ->orWhereNull('price');
        })
            ->with(['streamer'])
            ->inRandomOrder()
            ->take(6)
            ->get();


        $paidVideos = Video::whereRaw('FIND_IN_SET(?, category_id)', [$id])->where('price', '>', 0)
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
    }
}
