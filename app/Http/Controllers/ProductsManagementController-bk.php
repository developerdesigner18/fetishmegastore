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
//    public function index(VideoCategories $videocategory = null, string $slug = null)
//    {
//        $request = request();
//        $sort = $request->get('sort', 'Recently');
//        $perPage = 24; // Ek page par kitne items dikhane hain
//        $preFetchLimit = 100; // Har category se itne records uthayenge shuffle karne ke liye
//
//        // Watch History ka logic
//        $watchVideos = collect();
//        if (auth()->check()) {
//            $slugs = session('unauth_viewed_videos', []);
//            if (!empty($slugs)) {
//                $videos = Video::whereIn('slug', $slugs)->get();
//                $shortVideos = ShortVideo::whereIn('slug', $slugs)->get();
//                $audios = Audio::whereIn('slug', $slugs)->get();
//                $ebooks = Ebook::whereIn('slug', $slugs)->get();
//                $galleries = Gallery::whereIn('slug', $slugs)->get();
//
//                $watchVideos = collect()
//                    ->merge($videos)
//                    ->merge($shortVideos)
//                    ->merge($audios)
//                    ->merge($ebooks)
//                    ->merge($galleries);
//
//                foreach ($watchVideos as $item) {
//                    $type = match (true) {
//                        $item instanceof ShortVideo => 'short-video',
//                        $item instanceof Audio => 'audio',
//                        $item instanceof Ebook => 'ebook',
//                        $item instanceof Gallery => 'gallery',
//                        default => 'video',
//                    };
//
//                    $exists = ContentWatchHistory::where('user_id', auth()->id())
//                        ->where('video_id', $item->id)
//                        ->where('type', $type)
//                        ->first();
//
//                    if (!$exists) {
//                        ContentWatchHistory::create([
//                            'user_id' => auth()->id(),
//                            'IP' => request()->ip() ?? '',
//                            'type' => $type,
//                            'video_id' => $item->id,
//                            'date' => now()->format('Y-m-d'),
//                        ]);
//                    }
//                }
//
//                session()->forget('unauth_viewed_videos');
//            }
//        }
//
//        // Naya filter: Product Type ke liye
//        $selectedTypes = $request->input('selectedTypes', []);
//
//        // Define karein ki kaun se models available hain
//        $availableTypes = [
//            'video' => Video::class,
//            'short-video' => ShortVideo::class,
//            'audio' => Audio::class,
//            'ebook' => Ebook::class,
//            'gallery' => Gallery::class,
//        ];
//
//        // Decide karein ki kaun se types fetch karne hain. Agar kuch select nahi hai, to sabhi fetch honge.
//        $typesToFetch = empty($selectedTypes) ? array_keys($availableTypes) : $selectedTypes;
//
//        // --- FILTER AUR SORT FUNCTIONS ---
//        $applyFilters = function ($query) use ($request) {
//            if ($request->filled('search')) {
//                $query->where('title', 'LIKE', '%' . $request->search . '%');
//            }
//
//            if ($request->filled('selectedCategories')) {
//                $query->where(function ($q) use ($request) {
//                    foreach ($request->selectedCategories as $key => $catId) {
//                        $q->orWhere('category_id', 'LIKE', "%{$catId}%");
//                    }
//                });
//            }
//
//            if ($request->filled('selectedTags')) {
//                // Tags string hai, isliye LIKE use kar rahe hain
//                $query->where(function ($q) use ($request) {
//                    foreach ($request->selectedTags as $tag) {
//                        $q->orWhere('tags', 'LIKE', "%{$tag}%");
//                    }
//                });
//            }
//
//            if ($request->filled('selectedModels')) {
//                $query->where(function ($q) use ($request) {
//                    foreach ($request->selectedModels as $model) {
//                        $q->orWhere('model_id', 'LIKE', "%{$model}%");
//                    }
//                });
//            }
//
//            return $query;
//        };
//
//        $applySort = function ($query, $sort) {
//            return match ($sort) {
//                'Most' => $query->orderByDesc('views'),
//                'Recently' => $query->orderByDesc('id'),
//                'Older' => $query->orderBy('created_at'),
//                'Highest' => $query->orderByDesc('price'),
//                'Lowest' => $query->orderBy('price'),
//                'Only Free' => $query->where('price', 0)->orderByDesc('views'),
//                default => $query->orderByDesc('id'),
//            };
//        };
//
//        $allProducts = collect([]);
//
//        foreach ($typesToFetch as $type) {
//            if (isset($availableTypes[$type])) {
//                $modelClass = $availableTypes[$type];
//                $query = $modelClass::with('streamer');
//
//                if ($type === 'short-video') {
//                    $query->where('type', 'short-video');
//                }
//
//                $queryWithFilters = $applyFilters($query);
//                $queryWithSort = $applySort($queryWithFilters, $sort);
//
//                $items = $queryWithSort->limit($preFetchLimit)->get();
//
//                $allProducts = $allProducts->merge(
//                    $items->each(fn($item) => $item->setAttribute('type', $type))
//                );
//            }
//        }
//
//        $shuffledProducts = $allProducts->shuffle();
//
//        $currentPage = LengthAwarePaginator::resolveCurrentPage();
//        $currentPageItems = $shuffledProducts->slice(($currentPage - 1) * $perPage, $perPage)->values();
//
//        $paginatedProducts = new LengthAwarePaginator(
//            $currentPageItems,
//            $shuffledProducts->count(),
//            $perPage,
//            $currentPage,
//            ['path' => $request->url(), 'query' => $request->query()]
//        );
//
//        // --- STATIC DATA FOR PAGE ---
//        $hasFilter = $request->filled('search') || $request->filled('selectedCategories') || $request->filled('selectedTags') || $request->filled('selectedModels');
//        $recommendedVideo = $hasFilter ? collect() : RecommendedVideo::pluck('video_id')->toArray();
//        $featuredChannels = $hasFilter ? collect() : User::where('is_featured_verified', 1)->with('videos')->get();
//
//        $exploreImage = asset('images/browse-videos-icon.png');
//        $categories = VideoCategories::orderBy('category')->get();
//        $tags = Tag::orderBy('name')->get();
//        $models = Models::orderBy('name')->get();
//        $blocks = AdBlock::where('number', 0)->get();
//        $headTitle = $request->route()->getName() == 'home' ? 'FetishMegaStore' : 'Browse';
//        $userLoginID = auth()->id();
//        $faqs = Faq::where('status', 1)->orderBy('order_by', 'asc')->get();
//
//        return Inertia::render('Product/index', [
//            'userLoginID' => $userLoginID,
//            'headTitle' => $headTitle,
//            'exploreImage' => $exploreImage,
//            'featuredChannels' => $featuredChannels,
//            'recommendedVideo' => $recommendedVideo,
//            'categories' => $categories,
//            'category' => $videocategory,
//            'tags' => $tags,
//            'models' => $models,
//            'blocks' => $blocks,
//            'faqs' => $faqs,
//            'watchVideos' => $watchVideos,
//            'products' => $paginatedProducts,
//            'filters' => [
//                'search' => $request->get('search'),
//                'sort' => $sort,
//                'selectedCategories' => $request->get('selectedCategories', []),
//                'selectedTags' => $request->get('selectedTags', []),
//                'selectedModels' => $request->get('selectedModels', []),
//                'selectedTypes' => $selectedTypes,
//            ],
//        ]);
//    }


    public function index(VideoCategories $videocategory = null, string $slug = null)
    {
        $request = request();
        $sort = $request->get('sort', 'Recently');
        $perPage = 24; // Items per page
        $preFetchLimit = 100; // Records per type for shuffle
        $storageDomain = 'https://fetishmegastore.com/';

        // --- Watch History ---
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

        // --- Product Type Filter ---
        $selectedTypes = $request->input('selectedTypes', []);
        $availableTypes = [
            'video' => Video::class,
            'short-video' => ShortVideo::class,
            'audio' => Audio::class,
            'ebook' => Ebook::class,
            'gallery' => Gallery::class,
        ];
        $typesToFetch = empty($selectedTypes) ? array_keys($availableTypes) : $selectedTypes;

        // --- Filters ---
        $applyFilters = function ($query) use ($request) {
            if ($request->filled('search')) {
                $query->where('title', 'LIKE', '%' . $request->search . '%');
            }

            if ($request->filled('selectedCategories')) {
                $query->where(function ($q) use ($request) {
                    foreach ($request->selectedCategories as $catId) {
                        $q->orWhere('category_id', 'LIKE', "%{$catId}%");
                    }
                });
            }

            if ($request->filled('selectedTags')) {
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

        // --- Sort ---
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

        foreach ($typesToFetch as $type) {
            if (!isset($availableTypes[$type])) continue;

            $modelClass = $availableTypes[$type];
            $query = $modelClass::with('streamer');

            if ($type === 'short-video') {
                $query->where('type', 'short-video');
            }

            $query = $applyFilters($query);
            $query = $applySort($query, $sort);

            $items = $query->limit($preFetchLimit)->get();

            $items->each(function ($item) use ($type, $storageDomain) {
                $item->setAttribute('type', $type);

                // --- Title & Description Fix ---
                if (is_array($item->title)) {
                    $item->title = $item->title['en'] ?? array_values($item->title)[0] ?? '';
                }
                if (is_array($item->description)) {
                    $item->description = $item->description['en'] ?? array_values($item->description)[0] ?? '';
                }

                // --- Thumbnail & Video URL Fix ---
                if (!empty($item->thumbnail) && !str_starts_with($item->thumbnail, 'http')) {
                    $item->thumbnail = $storageDomain . ltrim($item->thumbnail, '/');
                }

                if (!empty($item->video) && !str_starts_with($item->video, 'http')) {
                    $item->videoUrl = $storageDomain . ltrim($item->video, '/');
                }

                if ($type === 'short-video' && !empty($item->video)) {
                    $item->videoUrl360p = $storageDomain . '360/' . basename($item->video);
                    $item->videoGIF = $storageDomain . 'GIF/' . basename($item->video);
                }
            });

            $allProducts = $allProducts->merge($items);
        }

        // --- Shuffle & Paginate ---
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

        // --- Static Page Data ---
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
