<?php

namespace App\Http\Controllers;

use App\Models\ShortVideo;
use App\Models\Tag;
use App\Models\Video;
use App\Models\VideoCategories;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BrowseTagsController extends Controller
{
    public function browse(Request $request)
    {

        $channels = new Tag();

        // case search string
        if ($request->has('search')) {
            $search = $request->search;
            $channels = Tag::where('name', 'LIKE', "%{$search}%");
        }

        if ($request->filled('selectedTags')) {
            $channels = $channels->whereIn('id',$request->selectedTags);
        }

        $channels = $channels->orderBy('name', 'ASC');

        $channels = $channels->paginate(40)->appends($request->query());

        $exploreImage = asset('images/explore.png');


        $tags =  Tag::orderBy('name')->get();

        $userrequest = [];
        $userrequest['selectedTags'] =  $request->selectedTags ?? [];

        return Inertia::render('Tags', compact('channels', 'exploreImage','tags','userrequest'));
    }

    public function tagProfile($id)
    {
        if (is_numeric($id)) {
            $tagDetails = Tag::find($id);
            $id = $tagDetails->slug;
            return redirect()->route('tag',['id' => $id]);
        }
        $tags = Tag::whereSlug($id)->first();
        $video = $tags->videos();
//        dd($category,$category->videos());
        // build opengraph tags
        $ogTags = [
            'title' => __(":channelName's channel (:handle)", ['channelName' => $tags->name, 'handle' => '@' . $tags->name]),
            'url' => route('category', ['id' => $tags->id]),
            'image' => $tags->imageUrl
        ];

        $userLoginID = auth()->id();
//        return Inertia::render('Channel/User', compact('category',  'ogTags'));
        return Inertia::render('Tag/Profile', compact('tags', 'video', 'ogTags','userLoginID'));
    }

//    public function tagVideos(Request $request, $id)
//    {
//        $tag = Tag::where('id', $id)->first();
//        $videos = Video::with('streamer')->where('tags', 'LIKE', "%{$tag->name}%")->where('price', '>=', 0)->paginate(30)->appends($request->query());
//
//        return $videos;
//    }
    public function tagVideos(Request $request, $id)
    {
        $tag = Tag::where('id', $id)->first();

        $shortVideo = ShortVideo::whereRaw('FIND_IN_SET(?, tags)', [$id])
            ->where('type', 'short-video')
            ->where(function ($q) {
                $q->where('price', 0)->orWhereNull('price');
            })
            ->inRandomOrder()
            ->paginate(12);

        $freeVideos = Video::whereRaw('FIND_IN_SET(?, tags)', [$tag->name])->where(function ($q) {
            $q->where('price', 0)
                ->orWhereNull('price');
        })
            ->with(['streamer'])
            ->inRandomOrder()
            ->take(6)
            ->get();


        $paidVideos = Video::whereRaw('FIND_IN_SET(?, tags)', [$tag->name])->where('price', '>', 0)
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