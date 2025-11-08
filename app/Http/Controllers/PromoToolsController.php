<?php

namespace App\Http\Controllers;

use App\Models\PromoBanner;
use App\Models\PromoPreviewVideo;
use Illuminate\Support\Facades\Mail;
use App\Models\ShortVideo;
use App\Models\Tag;
use App\Models\User;
use App\Models\Video;
use App\Models\VideoCategories;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Intervention\Image\Facades\Image;
use App\Jobs\SendNewsletterJob;

class PromoToolsController extends Controller
{
    public function promoBannerIndex(Request $request)
    {
        $query = PromoBanner::query();

        if ($request->filled('search')) {
            $query->where('name', 'LIKE', '%' . $request->search . '%');
        }

        $currentPage = $request->input('page', 1);
        $perPage = 8;

        $promo_banners = $query->select('id', 'name', 'thumbnail', 'banner_image')
                            ->orderBy('id', 'desc')
                            ->paginate($perPage, ['*'], 'page', $currentPage);

        return Inertia::render('Videos/PromoTools/PromoBanner', [
            'promo_banners' => $promo_banners
        ]);
    }


    public function promoVideo(Request $request)
    {
        $currentPage = $request->input('page', 1);
        $perPage = 8;
        $promoQuery = PromoPreviewVideo::query();

        if ($request->filled('search')) {
            $promoQuery->where('name', 'LIKE', '%' . $request->search . '%');
        }
        $promoVideos = $promoQuery
            ->select('id', 'name as title', 'slug', 'thumbnail', 'preview_videos', 'category_ids')
            ->orderBy('id', 'desc')
            ->get()
            ->map(function ($video) {
                return [
                    'id' => $video->id,
                    'slug' => $video->slug,
                    'name' => $video->title,
                    'thumbnail' => asset($video->thumbnail),
                    'preview_videos' => asset($video->preview_videos),
                    'category' => $video->category_names ?? '',
                ];
            });

        $shortVideos = ShortVideo::where('is_promo_video', 1)
            ->select('id', 'slug', 'thumbnail', 'video as preview_videos', 'category_id', 'title')
            ->orderBy('id', 'desc')
            ->get()
            ->map(function ($video) {
                return [
                    'id' => $video->id,
                    'slug' => $video->slug,
                    'name' => $video->title_en, 
                    'thumbnail' => asset($video->thumbnail),
                    'preview_videos' => asset($video->preview_videos),
                    'category' => $video->category_names ?? '',
                ];
            });

        $combined = $promoVideos->merge($shortVideos)->sortByDesc('id')->values();
        $paginated = new \Illuminate\Pagination\LengthAwarePaginator(
            $combined->forPage($currentPage, $perPage),
            $combined->count(),
            $perPage,
            $currentPage,
            ['path' => url()->current()]
        );
        return Inertia::render('Videos/PromoTools/PromoVideos', [
            'promo_videos' => $paginated,
        ]);
    }


   public function newPromoSinglePage(Request $request, $id)
    {
        // Try PromoPreviewVideo first
        $video = PromoPreviewVideo::where('slug', $id)->first();
        
        if ($video) {
            return Inertia::render('Videos/PromoTools/PromoSingleVideo', [
                'video' => [
                    'name' => $video->name,
                    'slug' => $video->slug,
                    'preview_video' => asset($video->preview_videos), // accessor for full URL
                    'thumbnail' => asset($video->thumbnail),
                    'category' => $video->category_names ?? __('No Category'),
                ],
                'url' => $request->url(),
            ]);
        }

        // Fallback to ShortVideo where is_promo_video = 1
        $shortVideo = ShortVideo::where('slug', $id)
            ->where('is_promo_video', 1)
            ->first();

        if ($shortVideo) {
            return Inertia::render('Videos/PromoTools/PromoSingleVideo', [
                'video' => [
                    'name' => $shortVideo->title_en, // accessor
                    'slug' => $shortVideo->slug,
                    'preview_video' => asset($shortVideo->preview_videos), // accessor
                    'thumbnail' => asset($shortVideo->thumbnail),
                    'category' => $shortVideo->category_names ?? __('No Category'),
                ],
                'url' => $request->url(),
            ]);

            
        }

        // Not found in either model
        return redirect()->route('short.videos.browse')->with('message', 'Video not found or not available.');
    }



}
