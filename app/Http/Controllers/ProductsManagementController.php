<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Video;
use App\Models\ShortVideo;
use App\Models\Audio;
use App\Models\Ebook;
use App\Models\Gallery;
use App\Models\VideoCategories;
use App\Models\Tag;
use App\Models\Models;
use App\Models\RecommendedVideo;
use App\Models\User;
use App\Models\AdBlock;
use App\Models\Faq;
use App\Models\ContentWatchHistory;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Inertia\Inertia;

class ProductsManagementController extends Controller
{
    public function index(VideoCategories $videocategory = null, string $slug = null)
    {
        $request = request();
        $sort = $request->get('sort', 'Recently');
        $perPage = 30; // Ek page par kitne items dikhane hain
        $preFetchLimit = 5000; // Har category se itne records uthayenge shuffle karne ke liye

        // Watch History ka logic
        $watchVideos = collect();
        if (auth()->check()) {
            $slugs = session('unauth_viewed_videos', []);
            if (!empty($slugs)) {
                $videos = Video::whereIn('slug', $slugs)->get();
                $shortVideos = ShortVideo::whereIn('slug', $slugs)->get();
                $audios = Audio::whereIn('slug', $slugs)->get();
                $ebooks = Ebook::whereIn('slug', $slugs)->get();
                $galleries = Gallery::whereIn('slug', $slugs)->get();

                $watchVideos = collect()
                    ->merge($videos)
                    ->merge($shortVideos)
                    ->merge($audios)
                    ->merge($ebooks)
                    ->merge($galleries);

                foreach ($watchVideos as $item) {
                    $type = match (true) {
                        $item instanceof ShortVideo => 'short-video',
                        $item instanceof Audio => 'audio',
                        $item instanceof Ebook => 'ebook',
                        $item instanceof Gallery => 'gallery',
                        default => 'video',
                    };

                    $exists = ContentWatchHistory::where('user_id', auth()->id())
                        ->where('video_id', $item->id)
                        ->where('type', $type)
                        ->first();

                    if (!$exists) {
                        ContentWatchHistory::create([
                            'user_id' => auth()->id(),
                            'IP' => request()->ip() ?? '',
                            'type' => $type,
                            'video_id' => $item->id,
                            'date' => now()->format('Y-m-d'),
                        ]);
                    }
                }

                session()->forget('unauth_viewed_videos');
            }
        }

        // Naya filter: Product Type ke liye
        $selectedTypes = $request->input('selectedTypes', []);

        // Define karein ki kaun se models available hain
        $availableTypes = [
            'video' => Video::class,
            'short-video' => ShortVideo::class,
            'audio' => Audio::class,
            'ebook' => Ebook::class,
            'gallery' => Gallery::class,
        ];

        // Decide karein ki kaun se types fetch karne hain. Agar kuch select nahi hai, to sabhi fetch honge.
        $typesToFetch = empty($selectedTypes) ? array_keys($availableTypes) : $selectedTypes;

        // --- FILTER AUR SORT FUNCTIONS ---
        $applyFilters = function ($query) use ($request) {
            if ($request->filled('search')) {
                $query->where('title', 'LIKE', '%' . $request->search . '%');
            }

            if ($request->filled('selectedCategories')) {
                $query->where(function ($q) use ($request) {
                    foreach ($request->selectedCategories as $key => $catId) {
                        $q->orWhere('category_id', 'LIKE', "%{$catId}%");
                    }
                });
            }

            if ($request->filled('selectedTags')) {
                // Tags string hai, isliye LIKE use kar rahe hain
                $query->where(function ($q) use ($request) {
                    foreach ($request->selectedTags as $tag) {
                        $q->orWhere('tags', 'LIKE', "%{$tag}%");
                    }
                });
            }

            if ($request->filled('selectedModels')) {
                $query->where(function ($q) use ($request) {
                    foreach ($request->selectedModels as $model) {
                        $q->orWhere('model_id', 'LIKE', "%{$model}%");
                    }
                });
            }

            return $query;
        };

        $applySort = function ($query, $sort) {
            return match ($sort) {
                'Most' => $query->orderByDesc('views'),
                'Recently' => $query->orderByDesc('id'),
                'Older' => $query->orderBy('created_at'),
                'Highest' => $query->orderByDesc('price'),
                'Lowest' => $query->orderBy('price'),
                'Only Free' => $query->where('price', 0)->orderByDesc('views'),
                default => $query->orderByDesc('id'),
            };
        };

        $allProducts = collect([]);

        // foreach ($typesToFetch as $type) {
        //     if (isset($availableTypes[$type])) {
        //         $modelClass = $availableTypes[$type];
        //         $query = $modelClass::with('streamer');

        //         if ($type === 'short-video') {
        //             $query->where('type', 'short-video');
        //         }

        //         $queryWithFilters = $applyFilters($query);
        //         $queryWithSort = $applySort($queryWithFilters, $sort);

        //         $items = $queryWithSort->limit($preFetchLimit)->get();

        //         $allProducts = $allProducts->merge(
        //             $items->each(fn($item) => $item->setAttribute('type', $type))
        //         );
        //     }
        // }
        foreach ($typesToFetch as $type) {
            if (isset($availableTypes[$type])) {
                $modelClass = $availableTypes[$type];
                $query = $modelClass::with('streamer');

                if ($type === 'short-video') {
                    $query->where('type', 'short-video');
                }

                $queryWithFilters = $applyFilters($query);
                $queryWithSort = $applySort($queryWithFilters, $sort);

                $items = $queryWithSort->limit($preFetchLimit)->get();

                // --- YAHAN PAR NAYA LOGIC ADD KIYA GAYA HAI ---
                // Data fetch karne ke baad, har item me manually properties add karein
                $items->each(function ($item) use ($type) {

                    // 1. 'type' attribute set karein (yeh pehle se tha)
                    $item->setAttribute('type', $type);

                    // 2. Thumbnail ka poora URL banayein
                    if ($item->thumbnail && !str_starts_with($item->thumbnail, 'http')) {
                        $item->thumbnail = asset($item->thumbnail);
                    } elseif (!$item->thumbnail) {
                        $item->thumbnail = asset('images/default-thumbnail.jpg');
                    }

                    // 3. videoGIF ka poora URL banayein (sirf video aur short-video ke liye)
                    if ($type === 'video' || $type === 'short-video') {
                        // Maan lete hain ki GIF ka path 'StrGIF' column me hai
                        if ($item->StrGIF && !str_starts_with($item->StrGIF, 'http')) {
                            $item->videoGIF = asset($item->StrGIF);
                        } else {
                            $item->videoGIF = null; // Agar GIF nahi hai to null set karein
                        }
                    } else {
                        // Audio, Ebook, Gallery ke liye videoGIF null rahega
                        $item->videoGIF = null;
                    }

                    // 4. Streamer ki profile picture ka poora URL banayein
                    if ($item->streamer && $item->streamer->profile_picture && !str_starts_with($item->streamer->profile_picture, 'http')) {
                        $item->streamer->profile_picture = asset($item->streamer->profile_picture);
                    }
                });

                $allProducts = $allProducts->merge($items);
            }
        }

        $shuffledProducts = $allProducts->shuffle();

        $currentPage = LengthAwarePaginator::resolveCurrentPage();
        $currentPageItems = $shuffledProducts->slice(($currentPage - 1) * $perPage, $perPage)->values();

        $paginatedProducts = new LengthAwarePaginator(
            $currentPageItems,
            $shuffledProducts->count(),
            $perPage,
            $currentPage,
            ['path' => $request->url(), 'query' => $request->query()]
        );

        // --- STATIC DATA FOR PAGE ---
        $hasFilter = $request->filled('search') || $request->filled('selectedCategories') || $request->filled('selectedTags') || $request->filled('selectedModels');
        $recommendedVideo = $hasFilter ? collect() : RecommendedVideo::pluck('video_id')->toArray();
        $featuredChannels = $hasFilter ? collect() : User::where('is_featured_verified', 1)->with('videos')->get();

        $exploreImage = asset('images/browse-videos-icon.png');
        $categories = VideoCategories::orderBy('category')->get();
        $tags = Tag::orderBy('name')->get();
        $models = Models::orderBy('name')->get();
        $blocks = AdBlock::where('number', 0)->get();
        $headTitle = $request->route()->getName() == 'home' ? 'FetishMegaStore' : 'Browse';
        $userLoginID = auth()->id();
        $faqs = Faq::where('status', 1)->orderBy('order_by', 'asc')->get();

        // dd($paginatedProducts);

        return Inertia::render('Product/index', [
            'userLoginID' => $userLoginID,
            'headTitle' => $headTitle,
            'exploreImage' => $exploreImage,
            'featuredChannels' => $featuredChannels,
            'recommendedVideo' => $recommendedVideo,
            'categories' => $categories,
            'category' => $videocategory,
            'tags' => $tags,
            'models' => $models,
            'blocks' => $blocks,
            'faqs' => $faqs,
            'watchVideos' => $watchVideos,
            'products' => $paginatedProducts,
            'filters' => [
                'search' => $request->get('search'),
                'sort' => $sort,
                'selectedCategories' => $request->get('selectedCategories', []),
                'selectedTags' => $request->get('selectedTags', []),
                'selectedModels' => $request->get('selectedModels', []),
                'selectedTypes' => $selectedTypes,
            ],
        ]);
    }
}
