<?php

namespace App\Http\Controllers;

use App\Events\ConversationEvent;
use App\Mail\VideoPurchasedMail;
use App\Mail\AudioPurchasedMail;
use App\Models\AdBlock;
use App\Models\ContentWatchHistory;
use App\Models\Audio;
use App\Models\Page;
use App\Models\Faq;
use Illuminate\Support\Facades\App;
use App\Models\Blog;
use App\Models\AffiliateCommission;
use App\Models\DownloadHistory;
use App\Models\AudioSales;
use App\Models\Gallery;
use App\Models\TokenPack;
use App\Models\TokenSale;
use App\Models\Models;
use Carbon\Carbon;
use App\Models\TextFile;
use App\Models\PurchaseHistory;
use App\Models\RecommendedVideo;
use App\Models\RequestedVideo;
use App\Models\ShortVideo;
use App\Models\Tag;
use App\Models\UserFavVideo;
use App\Models\Video;
use App\Models\User;
use App\Models\VideoCategories;
use App\Models\VideoSales;
use App\Notifications\NewVideoSale;
use App\Notifications\NewAudioSale;
use Illuminate\Http\File;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File as FileFacade;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Intervention\Image\Facades\Image;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;

class VideosController extends Controller
{
    //     public function __construct()
    //     {
    //         $this->middleware('auth')
    //             ->except(['browseAudio', 'browse', 'videoPage','increaseViews']);
    //     }

    public function myVideos(Request $request)
    {
        $videos = $request->user()
            ->purchasedVideos()
            ->with('streamer');

        if ($request->has('search_term')) {
            $videos->where('title', 'LIKE', '%' . $request->search_term . '%');
        }

        $videos = $videos->paginate(4);

        $userLoginID = auth()->user()->id;

        return Inertia::render('Videos/OrderedVideos', compact('videos', 'userLoginID'));
    }

    public function myWatchedVideos(Request $request)
    {
        $videos = $request->user()
            ->watchedVideos()
            ->whereIn('videos.type', ['video', 'short-video'])
            ->paginate(4);
        if ($request->has('search_term')) {
            $videos->where('title', 'LIKE', '%' . $request->search_term . '%');
        }
        //$videos = $videos->paginate(4);
        $userLoginID = auth()->user()->id;

        return Inertia::render('Videos/WatchedVideos', compact('videos', 'userLoginID'));
    }

    public function myFavorites(Request $request)
    {

        $favoriteList = UserFavVideo::where('user_id', auth()->user()->id)->pluck('video_id')->toArray();

        $videos = Video::with('streamer')->whereIn('id', $favoriteList);

        if ($request->has('search_term')) {
            $videos->where('title', 'LIKE', '%' . $request->search_term . '%');
        }

        $videos = $videos->paginate(4);

        return Inertia::render('Videos/FavoriteVideos', compact('videos'));
    }

    public function videoPage(Video $video, string $slug, Request $request)
    {

        $video->load('streamer');

        return Inertia::render('Videos/SingleVideo', compact('video'));
    }

    /*public function singleVideoPage($id)
    {
        $request = request();
        
          $refCode = $request->query('ref');
          
            if ($refCode && !session()->has('affiliate_ref')) {
                

                $refUser = User::where('affiliate_code', $refCode)
                    ->where('is_affiliate_vendor', 1)
                    ->where('affiliate_vendor_verifiy', 1)
                    ->first();
                 
                if ($refUser && (!auth()->check() || auth()->id() !== $refUser->id)) {
                   session(['affiliate_ref' => [
                        'code' => $refCode,
                        'user_id' => $refUser->id,
                        'timestamp' => now(),
                    ]]);
                    
                }
            }


        // Track unauthenticated views
        if (!auth()->check()) {
            $viewed = session()->get('unauth_viewed_videos', []);
            if (!in_array($id, $viewed)) {
                $viewed[] = $id;
                session()->put('unauth_viewed_videos', $viewed);
            }
        }

        if (session()->has('unauth_viewed_videos')) {
            $slugs = session('unauth_viewed_videos');
        }

        $shortVideo = ShortVideo::where('slug', $id)->first();
        $freeVideo = Video::where('slug', $id)->where(function ($query) {
            $query->where('price', 0)->orWhereNull('price');
        })->first();

        $paidVideo = Video::where('slug', $id)->where('price', '>', 0)->first();

        $video = collect([$shortVideo, $freeVideo, $paidVideo])->filter()->first();

        if (!$video) {
            return redirect()->route('short.videos.browse')->with('message', 'Video not found or not available.');
        }

        $canBePlayed = true;
        $popupMessage = null;


        // Limit logic
        $check = ContentWatchHistory::where(function ($q) use ($request) {
            $q->where('IP', $request->ip());
        })->where('date', Carbon::today()->format('Y-m-d'))
            ->where('user_id', auth()->id());

        $checkTheTodayWatchTime = $check->where('video_id', $video->id)->count();

        $squery = ContentWatchHistory::where(function ($q) use ($request) {
            $q->where('IP', $request->ip());
        })->where('date', Carbon::today()->format('Y-m-d'))
            ->where('user_id', auth()->id())
            ->distinct('video_id');


        $checkTodayPreviewWatched = $squery->count();


        if (auth()->check()) {
            $user = auth()->user();
            $minTokenPackTokens = TokenPack::min('tokens');
            $userTotalTokens = $user->tokens ?? 0;

            $hasPurchasedMinTokenOrMore = $userTotalTokens >= $minTokenPackTokens;
            if ($video->price == 0.00  || $hasPurchasedMinTokenOrMore) {
                $canBePlayed = true;
                $popupMessage = null;
            } else {
                if ($video->price == 0.00) {
                    $checkTodayPreviewWatched = ContentWatchHistory::where('date', Carbon::today()->format('Y-m-d'))
                        ->where('IP', $request->ip())
                        ->where('user_id', $user->id)
                        ->where('is_pre_login', 1)
                        ->count();

                    if ($checkTodayPreviewWatched >= 3) {
                        $canBePlayed = true;
                        $popupMessage = __("You've reached your daily watch limit. Buy a token pack to continue watching.");
                    } else {
                        ContentWatchHistory::create([
                            'user_id' => $user->id,
                            'IP' => $request->ip(),
                            'type' => $request->type,
                            'video_id' => $video->id,
                            'date' => Carbon::today()->format('Y-m-d'),
                            'is_pre_login' => 1,
                        ]);
                        $canBePlayed = true;
                        $popupMessage = null;
                    }
                }

                // Handle paid video
                if ($video->price > 0 && !$video->isPurchasedBy($user)) {
                    $canBePlayed = false;
                }
            }
        } else {
            // Guest logic
            $sessionKey = 'guest_video_watched_' . Carbon::today()->format('Y-m-d');
            session()->push($sessionKey, $video->id);
            $canBePlayed = false;
            $popupMessage = __("Please log in to continue watching.");
        }



        if (auth()->check()) {
            $user = auth()->user();
            $guestVideos = session()->get('guest_video_watched_' . Carbon::today()->format('Y-m-d'), []);

            foreach ($guestVideos as $videoId) {
                ContentWatchHistory::create([
                    'user_id' => $user->id,
                    'IP' => $request->ip(),
                    'video_id' => $videoId,
                    'date' => Carbon::today()->format('Y-m-d'),
                    'is_pre_login' => 0,
                ]);
            }
            session()->forget('guest_video_watched_' . Carbon::today()->format('Y-m-d'));
        }



        // Load full video record
        $video = Video::with('streamer')->where('slug', $id)->first();
        $video->duration = $video->getDurationAttribute();
        $video->canBePlayed = $canBePlayed;

        // Load tags
        $tags = is_array($video->tags) ? $video->tags : [];
        $videotags = [];
        foreach ($tags as $tag) {
            $item = Tag::where('name', 'LIKE', "%{$tag}%")->first();
            if ($item) {
                $videotags[] = [
                    "id" => $item->id,
                    "name" => $tag,
                ];
            }
        }
        $video->tags = $videotags;

        // Related videos
        $relatedvideos = Video::where(function ($query) use ($videotags) {
            foreach ($videotags as $tag) {
                $query->orWhere('tags', 'LIKE', "%{$tag["name"]}%");
            }
        })->paginate(8)->appends($request->query());

        // Token popup if user hasn't purchased and balance is low
        $showTokenPopup = false;
        if (auth()->check()) {
            $minTokenPackTokens = TokenPack::min('tokens');
            $hasPurchasedTokenPack = TokenSale::where('user_id', $user->id)->exists();
            if (!$hasPurchasedTokenPack && $user->tokens <= $minTokenPackTokens && !session()->has('token_popup_shown')) {
                $showTokenPopup = false;
                $popupMessage = __("Your token balance is low. Buy a token pack to continue watching premium videos.");
                session(['token_popup_shown' => true]);
            }
        }

        // SEO data
        $currentLocale = app()->getLocale();
        $seo = json_decode($video->seo);
        $imgUrl = !empty($seo->og_image_url) ? $seo->og_image_url : ($video->thumbnail ?? '');
        $videoUrl = !empty($seo->cust_url) ? $seo->cust_url : url('single-video', $video->slug);

        $seoDetail = [
            'title' => $seo->h2 ?? '',
            'keyword' => $seo->keyword ?? '',
            'meta_keyword' => $seo->meta_keyword ?? '',
            'desc' => $seo->desc ?? '',
            'meta_robot' => $seo->meta_robot ?? '',
            'og_title' => $seo->og_title ?? '',
            'og_desc' => $seo->og_desc ?? '',
            'cust_url' => $videoUrl,
            'og_image_url' => $imgUrl,
            'json_id' => $seo->json_id ?? '',
        ];

        if ($currentLocale == 'de') {
            $seoDetail['title'] = $seo->de->h2 ?? '';
            $seoDetail['keyword'] = $seo->de->keyword ?? '';
            $seoDetail['meta_keyword'] = $seo->de->meta_keyword ?? '';
            $seoDetail['desc'] = $seo->de->desc ?? '';
        }

        //dd($dataId);
        return Inertia::render('Videos/SingleVideoDetails', [
            'video' => $video,
            'relatedvideos' => $relatedvideos,
            'url' => $request->url(),
            'userLoginID' => auth()->id() ?? null,
            'authUser' => auth()->user()->only([
                'id',
                'name',
                'affiliate_code',
                'is_affiliate_vendor',
                'affiliate_vendor_verifiy'
            ]) ?? '',
            'canBePlayed' => $canBePlayed,
            'popupMessage' => ($showTokenPopup || !$canBePlayed) ? $popupMessage : null,
            'seo' => $seoDetail,
        ]);
    }*/

    public function singleVideoPage($id)
    {
        $request = request();
        $user = auth()->user();

        $refCode = $request->query('ref');

        if ($refCode && !session()->has('affiliate_ref')) {
            $refUser = User::where('affiliate_code', $refCode)
                ->where('is_affiliate_vendor', 1)
                ->where('affiliate_vendor_verifiy', 1)
                ->first();

            if ($refUser && (!$user || $user->id !== $refUser->id)) {
                session(['affiliate_ref' => [
                    'code' => $refCode,
                    'user_id' => $refUser->id,
                    'timestamp' => now(),
                ]]);
            }
        }

        if (!$user) {
            $viewed = session()->get('unauth_viewed_videos', []);
            if (!in_array($id, $viewed)) {
                $viewed[] = $id;
                session()->put('unauth_viewed_videos', $viewed);
            }
        }

        if (session()->has('unauth_viewed_videos')) {
            $slugs = session('unauth_viewed_videos');
        }

        $shortVideo = ShortVideo::where('slug', $id)->first();
        $freeVideo = Video::where('slug', $id)->where(function ($query) {
            $query->where('price', 0)->orWhereNull('price');
        })->first();
        $paidVideo = Video::where('slug', $id)->where('price', '>', 0)->first();

        $video = collect([$shortVideo, $freeVideo, $paidVideo])->filter()->first();
        //dd($video);
        if (!$video) {
            return redirect()->route('short.videos.browse')->with('message', 'Video not found or not available.');
        }

        $canBePlayed = true;
        $popupMessage = null;

        $check = ContentWatchHistory::where(function ($q) use ($request) {
            $q->where('IP', $request->ip());
        })->where('date', Carbon::today()->format('Y-m-d'))
            ->where('user_id', optional($user)->id);

        $checkTheTodayWatchTime = $check->where('video_id', $video->id)->count();

        $squery = ContentWatchHistory::where(function ($q) use ($request) {
            $q->where('IP', $request->ip());
        })->where('date', Carbon::today()->format('Y-m-d'))
            ->where('user_id', optional($user)->id)
            ->distinct('video_id');

        $checkTodayPreviewWatched = $squery->count();

        if ($user) {
            $minTokenPackTokens = TokenPack::min('tokens');
            $userTotalTokens = $user->tokens ?? 0;
            $hasPurchasedMinTokenOrMore = $userTotalTokens >= $minTokenPackTokens;

            if ($video->price == 0.00 || $hasPurchasedMinTokenOrMore) {
                $canBePlayed = true;
                $popupMessage = null;
            } else {
                if ($video->price == 0.00) {
                    $checkTodayPreviewWatched = ContentWatchHistory::where('date', Carbon::today()->format('Y-m-d'))
                        ->where('IP', $request->ip())
                        ->where('user_id', $user->id)
                        ->where('is_pre_login', 1)
                        ->count();

                    if ($checkTodayPreviewWatched >= 3) {
                        $canBePlayed = true;
                        $popupMessage = __("You've reached your daily watch limit. Buy a token pack to continue watching.");
                    } else {
                        ContentWatchHistory::create([
                            'user_id' => $user->id,
                            'IP' => $request->ip(),
                            'type' => $request->type,
                            'video_id' => $video->id,
                            'date' => Carbon::today()->format('Y-m-d'),
                            'is_pre_login' => 1,
                        ]);
                        $canBePlayed = true;
                        $popupMessage = null;
                    }
                }

                if ($video->price > 0 && !$video->isPurchasedBy($user)) {
                    $canBePlayed = false;
                }
            }
        } else {
            $sessionKey = 'guest_video_watched_' . Carbon::today()->format('Y-m-d');
            session()->push($sessionKey, $video->id);
            $canBePlayed = false;
            $popupMessage = __("Please log in to continue watching.");
        }

        if ($user) {
            $guestVideos = session()->get('guest_video_watched_' . Carbon::today()->format('Y-m-d'), []);
            foreach ($guestVideos as $videoId) {
                ContentWatchHistory::create([
                    'user_id' => $user->id,
                    'IP' => $request->ip(),
                    'video_id' => $videoId,
                    'date' => Carbon::today()->format('Y-m-d'),
                    'is_pre_login' => 0,
                ]);
            }
            session()->forget('guest_video_watched_' . Carbon::today()->format('Y-m-d'));
        }

        $video = Video::with('streamer')->where('slug', $id)->first();
        // if (!$video) { 
        //     return redirect()->route('short.videos.browse')->with('message', 'Video not found or not available.');
        // }
        $video->duration = $video->getDurationAttribute();
        $video->canBePlayed = $canBePlayed;


        $video->modelDetails = $video->model ? [[
            'id' => $video->model->id,
            'slug' => $video->model->slug,
            'name' => $video->model->name,
        ]] : [];

        $tags = is_array($video->tags) ? $video->tags : [];
        $videotags = [];
        foreach ($tags as $tag) {
            $item = Tag::where('name', 'LIKE', "%{$tag}%")->first();
            if ($item) {
                $videotags[] = [
                    "id" => $item->id,
                    "name" => $tag,
                ];
            }
        }
        $video->tags = $videotags;

        $relatedvideos = Video::where(function ($query) use ($videotags) {
            foreach ($videotags as $tag) {
                $query->orWhere('tags', 'LIKE', "%{$tag["name"]}%");
            }
        })->inRandomOrder()->paginate(8)->appends($request->query());
        

        $showTokenPopup = false;
        if ($user) {
            $minTokenPackTokens = TokenPack::min('tokens');
            $hasPurchasedTokenPack = TokenSale::where('user_id', $user->id)->exists();

            if (!$hasPurchasedTokenPack && $user->tokens <= $minTokenPackTokens && !session()->has('token_popup_shown')) {
                $showTokenPopup = false;
                $popupMessage = __("Your token balance is low. Buy a token pack to continue watching premium videos.");
                session(['token_popup_shown' => true]);
            }
        }

        $currentLocale = app()->getLocale();
        $seo = json_decode($video->seo);
        $imgUrl = !empty($seo->og_image_url) ? $seo->og_image_url : ($video->thumbnail ?? '');
        $videoUrl = !empty($seo->cust_url) ? $seo->cust_url : url('single-video', $video->slug);

        $seoDetail = [
            'title' => $seo->h2 ?? '',
            'keyword' => $seo->keyword ?? '',
            'meta_keyword' => $seo->meta_keyword ?? '',
            'desc' => $seo->desc ?? '',
            'meta_robot' => $seo->meta_robot ?? '',
            'og_title' => $seo->og_title ?? '',
            'og_desc' => $seo->og_desc ?? '',
            'cust_url' => $videoUrl,
            'og_image_url' => $imgUrl,
            'json_id' => $seo->json_id ?? '',
        ];

        if ($currentLocale == 'de') {
            $seoDetail['title'] = $seo->de->h2 ?? '';
            $seoDetail['keyword'] = $seo->de->keyword ?? '';
            $seoDetail['meta_keyword'] = $seo->de->meta_keyword ?? '';
            $seoDetail['desc'] = $seo->de->desc ?? '';
        }

        return Inertia::render('Videos/SingleVideoDetails', [
            'video' => $video,
            'relatedvideos' => $relatedvideos,
            'url' => $request->url(),
            'userLoginID' => optional($user)->id,
            'authUser' => $user
                ? $user->only([
                    'id',
                    'name',
                    'affiliate_code',
                    'is_affiliate_vendor',
                    'affiliate_vendor_verifiy'
                ])
                : null,
            'canBePlayed' => $canBePlayed,
            'popupMessage' => ($showTokenPopup || !$canBePlayed) ? $popupMessage : null,
            'seo' => $seoDetail,
        ]);
    }
    //new code 

    public function linkPurchaseVideo(Video $video, Request $request)
    {
        $user = $request->user();
        if ($video->isPurchasedBy($user)) {
            return back()->with('message', __('You already own this video.'));
        }

        if ($user->tokens < $video->price) {
            return back()->with('error', __('Insufficient tokens.'));
        }

        $user->decrement('tokens', $video->price);
        $user->purchasedVideos()->attach($video->id);

        // Handle affiliate commission
        $ref = session('affiliate_ref');
        if ($ref && $ref['video'] == $video->id) {
            $referrer = User::where('affiliate_code', $ref['code'])
                ->where('is_affiliate_vendor', 1)
                ->where('affiliate_vendor_verifiy', 1)
                ->first();

            if ($referrer && $referrer->id != $user->id) {
                $commissionAmount = floor($video->price * 0.5);
                $referrer->increment('tokens', $commissionAmount);

                AffiliateCommission::create([
                    'user_id' => $referrer->id,
                    'buyer_id' => $user->id,
                    'type' => 'video',
                    'item_id' => $video->id,
                    'token' => $commissionAmount,
                    'status' => 'success',
                ]);

                session()->forget('affiliate_ref');
            }
        }

        return redirect()->route('videos.single', $video->slug)->with('message', __('Video unlocked successfully!'));
    }

    //end new code 
    public function unlockVideo(Video $video, Request $request)
    {
        
        // Load associated streamer
        $video->load('streamer');

        if ($video->canBePlayed) {
            return back()->with('message', __('You already have access to this video'));
        }

        return Inertia::render('Videos/Unlock', compact('video'));
    }

    public function addToFavorite($id)
    {

        try {
            UserFavVideo::updateOrInsert(['user_id' => auth()->user()->id, 'video_id' => $id]);
            session()->flash('message', __("Added To Favorite"));
            return response()->json(['status' => 1]);
        } catch (\Exception $exception) {
            return response()->json(['status' => 0, 'message' => $exception->getMessage()]);
        }
    }

    public function removeFromFavorite($id)
    {

        try {
            UserFavVideo::where(['user_id' => auth()->user()->id, 'video_id' => $id])->delete();
            session()->flash('message', __("Removed From Favorite"));
            return response()->json(['status' => 1]);
        } catch (\Exception $exception) {
            return response()->json(['status' => 0, 'message' => $exception->getMessage()]);
        }
    }

    public function purchaseVideo(Video $video, Request $request)
    {
        // check if user already bought
        if ($video->canBePlayed) {
            return back()->with('message', __('You already have access to this video'));
        }

        // if()

        // $checkHistory = PurchaseHistory::where(function ($query) use ($request, $video) {
        //     $query->where('user_id', auth()->user()->id)
        //         ->orWhere('ip', $request->ip());
        // })
        //     ->where('type', 'video')
        //     ->where('video_id', $video->id)
        //     ->count();

        // if ($checkHistory >= 3) {
        //     return back()->with('message', __('You are not allow to purchase video more then 3 times'));
        // }

        $buyer = $request->user();
        affilaiteCommissionGenrate($buyer, $video);
        // Prioritize session-based (URL click) commission
        // if (session()->has('affiliate_ref')) {
        //     handleAffiliateCommissionForVideo($buyer, $video);
        // } else {
        //     affilaiteCommissionGenrate($buyer, $video);
        // }
        // $referrerId = $buyer->affiliate_user ?? null;

        // if (!empty($referrerId)) {
        //     $referrer = User::where('id', $referrerId)
        //         ->where('is_affiliate_vendor', 1)
        //         ->where('affiliate_vendor_verifiy', 1)
        //         ->first();

        //     if ($referrer) {
        //         $commissionAmount = floor($video->price * 0.5);
        //         $referrer->increment('tokens', $commissionAmount);

        //         AffiliateCommission::create([
        //             'user_id' => $referrer->id,
        //             'buyer_id' => $buyer->id,
        //             'type' => 'video',
        //             'item_id' => $video->id,
        //             'token' => $commissionAmount,
        //             'status' => 'success',
        //         ]);
        //     }
        // }

        // record order
        $videoSale = new VideoSales();
        $videoSale->video_id = $video->id;
        $videoSale->streamer_id = $video->user_id;
        $videoSale->user_id = $request->user()->id;
        $videoSale->price = $video->price;
        $videoSale->save();

        if ($videoSale) {
            $addpurchasehistory = new PurchaseHistory();
            $addpurchasehistory->type = 'video';
            $addpurchasehistory->video_id = $video->id;
            $addpurchasehistory->user_id = auth()->user()->id;
            $addpurchasehistory->ip = $request->ip();
            $addpurchasehistory->save();
        }



        // subtract from user balance
        $request->user()->decrement('tokens', $video->price);

        // notify streamer of this sale (on platform)
        $video->streamer->notify(new NewVideoSale($videoSale));

        //        Notify User that video successfully purchased
        //        $request->user()->notify(new VideoPurchasedMail($videoSale));

        Mail::to($request->user()->email)->send(new VideoPurchasedMail($videoSale));


        // ✅ Affiliate Commission Logic



        // redirect to my videos
        return redirect(route('videos.ordered'))->with('message', __("Thank you, you can now play the video!"));
    }

    public function increaseViews(Video $video, Request $request)
    {
        $sessionName = ip2long($request->ip()) . '_' . $video->id . '_viewed';

        // if (!$request->session()->has($sessionName)) {
            // only increase views if the user didn't already play the video this session
            $video->increment('views');

            // set the session to avoid increasing again
            $request->session()->put($sessionName, date('Y-m-d H:i:s'));

            // return the result
            return response()->json(['result' => 'INCREASED', 'session' => $sessionName]);
        // } else {
        //     return response()->json(['result' => 'ALREADY VIEWED THIS SESSION, NOT INCREASING VIEW COUNT']);
        // }
    }

    public function increaseAudioViews(Audio $shortVideo, Request $request) // Parameter ka naam 'shortVideo' (camelCase)
    {
        $sessionName = ip2long($request->ip()) . '_' . $shortVideo->id . '_short_video_viewed';
        $shortVideo->increment('views');
        $request->session()->put($sessionName, date('Y-m-d H:i:s'));
        Log::info("Views INCREASED for Short Video ID: {$shortVideo->id} by IP: {$request->ip()}");
        return response()->json(['result' => 'INCREASED', 'session' => $sessionName]);
    }

    public function browse(VideoCategories $videocategory = null, string $slug = null)
    {
        $event = new ConversationEvent(request()->get('conversions_tracking', ''));
        $event->callApi('site');

        //dd($userId);
        $request = request();
        $randomvideos = [];
        $userrequest = [];
        $userrequest['page'] = $request->get("page", 1);
        if (!$videocategory) {
            //$randomvideos = (array)Video::with(['streamer'])->inRandomOrder()->paginate(16)->toArray();
            //dd($randomvideos);
            $whereUser = User::pluck('id'); // Extract only user IDs

            // Update the ShortVideo query to ensure price is either 0 or null
            $shortVideo = ShortVideo::with(['streamer'])->where(function ($q) use ($whereUser) {
                $q->whereIn('user_id', $whereUser)
                    ->orWhereNull('user_id');
            })
                ->where('type', 'short-video')
                ->where(function ($q) {
                    $q->where('price', 0)->orWhereNull('price');
                })
                ->inRandomOrder()
                ->paginate(12);

            //prd($shortVideo);

            $freeVideos = Video::where(function ($q) {
                $q->where('price', 0)
                    ->orWhereNull('price');
            })
                ->with(['streamer'])
                ->inRandomOrder()
                ->take(6)
                ->get();

            $paidVideos = Video::where('price', '>', 0)
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

            $randomvideos = $paginatedResults->toArray();

            $videos = Video::with(['streamer']);
            // $videos = Video::with(['category', 'streamer']);
            // $videos = Video::with(['streamer']);
        } else {
            $videos = $videocategory->videos()->with(['streamer']);
            // $videos = $videocategory->videos()->with(['streamer']);
        }

        $userrequest['sort'] = $request->get('sort', 'Recently');

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
            $userrequest['search'] = $request->search;

            $videos->where('title', 'LIKE', '%' . $request->search . '%');
            $randomvideos = [];
        }

        // case categories
        $userrequest['selectedCategories'] = [];
        if ($request->filled('selectedCategories')) {
            $randomvideos = [];
            $userrequest['selectedCategories'] = $request->selectedCategories;
            $videos->where(function ($query) use ($request) {
                foreach ($request->selectedCategories as $key => $categoryId) {
                    if ($key == 0) {
                        $query->where('category_id', 'LIKE', "%{$categoryId}%");
                    } else {
                        $query->orWhere('category_id', 'LIKE', "%{$categoryId}%");
                    }
                }
            });

            //  $videos->whereHas('category', function ($query) use ($request) {
            //      $query->whereIn('category_id', $request->selectedCategories);
            //  });
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

            //  $videos->whereIn('model_id', $request->selectedModels);
        }

        // fetch videos

        $videos = $videos->paginate(28)->appends($request->query())->toArray();

        // the image
        $exploreImage = asset('images/browse-videos-icon.png');

        // all video categories
        $categories = VideoCategories::orderBy('category')->get();

        // assing to simple category
        $category = $videocategory;

        $tags = Tag::orderBy('name')->get();

        $models = Models::orderBy('name')->get();

        $blocks = AdBlock::where('number', 0)->get();

        // render the view

        $headTitle = $request->route()->getName() == 'home' ? 'FetishMegaStore' : 'Browse Videos';

        $recommendedVideoId = RecommendedVideo::pluck('video_id')->toArray();

        $recommendedVideo = Video::with(['streamer'])->whereIn('id', $recommendedVideoId)->paginate(16);

        $featuredChannels = User::where('is_featured_verified', 1)->with('videos')->get();

        $userLoginID = auth()->id();

        return Inertia::render('Videos/BrowseVideos', compact('userLoginID', 'userrequest', 'featuredChannels', 'randomvideos', 'recommendedVideo', 'videos', 'category', 'exploreImage', 'categories', 'tags', 'models', 'blocks', 'headTitle'));
    }

    public function trackUnauthWatchedVideo($slug)
    {
        if (!Auth::check()) {
            $watched = session('unauth_viewed_videos', []);

            if (!in_array($slug, $watched)) {
                $watched[] = $slug;
                session(['unauth_viewed_videos' => $watched]);
            }
        }

        return response()->json(['status' => 'ok']);
    }

    // public function browseVideos(VideoCategories $videocategory = null, string $slug = null)
    // {
    //     $watchVideos = collect();
    //     if (auth()->check()) {
    //         $slugs = session('unauth_viewed_videos', []);
    //         if (!empty($slugs)) {
    //             // Get videos from both tables
    //             $videos = Video::whereIn('slug', $slugs)->get();
    //             $shortVideos = ShortVideo::whereIn('slug', $slugs)->get();
    //             $watchVideos = $videos->merge($shortVideos);
    //             foreach ($watchVideos as $watchVideo) {
    //                 $videoId = $watchVideo->id;
    //                 $videoType = $watchVideo instanceof ShortVideo ? 'short-video' : 'video';

    //                 $alreadyExists = ContentWatchHistory::where('user_id', auth()->id())
    //                     ->where('video_id', $videoId)
    //                     ->where('type', $videoType)
    //                     ->first();

    //                 if (!$alreadyExists) {
    //                     ContentWatchHistory::create([
    //                         'user_id' => auth()->id(),
    //                         'IP' => request()->ip() ?? '',
    //                         'type' => $videoType,
    //                         'video_id' => $videoId,
    //                         'date' => Carbon::today()->format('Y-m-d'),
    //                     ]);
    //                 }
    //             }
    //             session()->forget('unauth_viewed_videos');
    //         }
    //     }

    //     $event = new ConversationEvent(request()->get('conversions_tracking', ''));
    //     $event->callApi('site');

    //     $request = request();
    //     $randomvideos = [];
    //     $userrequest = [];
    //     $userrequest['page'] = $request->get("page", 1);
    //     $whereUser = User::pluck('id');

    //     if (!$videocategory) {
    //         $shortVideo = ShortVideo::with(['streamer'])->where(function ($q) use ($whereUser) {
    //             $q->whereIn('user_id', $whereUser)
    //                 ->orWhereNull('user_id');
    //         })
    //             ->where('type', 'short-video')
    //             ->where(function ($q) {
    //                 $q->where('price', 0)->orWhereNull('price');
    //             })
    //             ->inRandomOrder()
    //             ->paginate(12);

    //         $freeVideos = Video::where(function ($q) {
    //             $q->where('price', 0)
    //                 ->orWhereNull('price');
    //         })
    //             ->with(['streamer'])
    //             ->inRandomOrder()
    //             ->take(6)
    //             ->get();

    //         if ($request->sort != 'Only Free') {
    //             $paidVideos = Video::where('price', '>', 0)
    //                 ->with(['streamer'])
    //                 ->inRandomOrder()
    //                 ->paginate(12);

    //             $mergedResults = $freeVideos->merge($paidVideos->items())->merge($shortVideo->items())->shuffle();
    //         } else {
    //             $mergedResults = $freeVideos->merge($shortVideo->items())->shuffle();
    //         }
    //         // $paginatedResults = new \Illuminate\Pagination\LengthAwarePaginator(
    //         //     $mergedResults->forPage(1, 30),
    //         //     count($mergedResults),
    //         //     16,
    //         //     request()->get('page', 1),
    //         //     ['path' => \Illuminate\Pagination\Paginator::resolveCurrentPath()]
    //         // );

    //         $paginatedResults = new \Illuminate\Pagination\LengthAwarePaginator(
    //             $mergedResults->forPage(1, 12),
    //             $mergedResults->count(),
    //             12,
    //             request()->get('page', 1),
    //             ['path' => \Illuminate\Pagination\Paginator::resolveCurrentPath()]
    //         );

    //         $randomvideos = $paginatedResults->toArray();
    //         $videos = Video::with(['streamer']);
    //     } else {
    //         $videos = $videocategory->videos()->with(['streamer']);
    //     }

    //     $userrequest['sort'] = $request->get('sort', 'Recently');
    //     switch ($request->sort) {
    //         case 'Most':
    //             $videos = $videos->orderByDesc('views');
    //             break;

    //         case 'Recently':
    //             $videos = $videos->orderByDesc('id');
    //             break;

    //         case 'Older':
    //             $videos = $videos->orderBy('created_at');
    //             break;

    //         case 'Highest':
    //             $videos = $videos->orderByDesc('price');
    //             break;

    //         case 'Lowest':
    //             $videos = $videos->orderBy('price');
    //             break;

    //         case 'Only Free':
    //             $videos = $videos->where('price', 0)->orderByDesc('views');
    //             break;
    //         case 'Latest':
    //         default:
    //             $videos = $videos->orderByDesc('id');
    //             break;
    //     }

    //     // if ($request->filled('search')) {
    //     //     $randomvideos = [];
    //     //     $userrequest['search'] = $request->search;

    //     //     $videos->where('title', 'LIKE', '%' . $request->search . '%');

    //     //     $recommendedVideo = collect();
    //     //     $featuredChannels = collect();
    //     // } else {
    //     //     $recommendedVideoId = RecommendedVideo::pluck('video_id')->toArray();
    //     //     $recommendedVideo = Video::with(['streamer'])->whereIn('id', $recommendedVideoId)->paginate(16);
    //     //     $featuredChannels = User::where('is_featured_verified', 1)->with('videos')->get();
    //     // }


    //     $hasFilter = $request->filled('search') || $request->filled('selectedCategories') || $request->filled('selectedTags')
    //         || $request->filled('selectedModels');

    //     if ($hasFilter) {
    //         $randomvideos = [];
    //         $recommendedVideo = collect();
    //         $featuredChannels = collect();
    //     } else {
    //         $recommendedVideoId = RecommendedVideo::pluck('video_id')->toArray();
    //         $recommendedVideo = Video::with(['streamer'])->whereIn('id', $recommendedVideoId)->paginate(16);
    //         $featuredChannels = User::where('is_featured_verified', 1)->with('videos')->get();
    //     }


    //     $userrequest['selectedCategories'] = [];
    //     if ($request->filled('selectedCategories')) {
    //         $randomvideos = [];
    //         $userrequest['selectedCategories'] = $request->selectedCategories;
    //         $videos->where(function ($query) use ($request) {
    //             foreach ($request->selectedCategories as $key => $categoryId) {
    //                 if ($key == 0) {
    //                     $query->where('category_id', 'LIKE', "%{$categoryId}%");
    //                 } else {
    //                     $query->orWhere('category_id', 'LIKE', "%{$categoryId}%");
    //                 }
    //             }
    //         });
    //     }

    //     $userrequest['selectedTags'] = [];
    //     if ($request->filled('selectedTags')) {
    //         $randomvideos = [];
    //         $userrequest['selectedTags'] = $request->selectedTags;
    //         foreach ($request->selectedTags as $key => $tag) {
    //             if ($key == 0) {
    //                 $videos->where('tags', 'LIKE', "%{$tag}%");
    //             } else {
    //                 $videos->orWhere('tags', 'LIKE', "%{$tag}%");
    //             }
    //         }
    //     }
    //     $userrequest['selectedModels'] = [];
    //     if ($request->filled('selectedModels')) {
    //         $randomvideos = [];
    //         $userrequest['selectedModels'] = $request->selectedModels;
    //         foreach ($request->selectedModels as $key => $model) {
    //             if ($key == 0) {
    //                 $videos->where('model_id', 'LIKE', "%{$model}%");
    //             } else {
    //                 $videos->orWhere('model_id', 'LIKE', "%{$model}%");
    //             }
    //         }

    //         //            $videos->whereIn('model_id', $request->selectedModels);

    //     }
    //     $videos = $videos->paginate(6)->appends($request->query())->toArray();

    //     $shortVideos = ShortVideo::where(function ($q) use ($whereUser) {
    //         $q->whereIn('user_id', $whereUser)
    //             ->orWhereNull('user_id');
    //     })
    //         ->where('type', 'short-video')
    //         ->where(function ($q) {
    //             $q->where('price', 0)->orWhereNull('price');
    //         })
    //         ->with(['streamer'])
    //         ->inRandomOrder()
    //         ->paginate(12)
    //         ->appends($request->query())
    //         ->toArray();

    //     $videos['data'] = collect($videos['data'])
    //         ->shuffle()
    //         ->toArray();

    //     $exploreImage = asset('images/browse-videos-icon.png');

    //     $categories = VideoCategories::orderBy('category')->get();

    //     $category = $videocategory;

    //     $tags = Tag::orderBy('name')->get();

    //     $models = Models::orderBy('name')->get();

    //     $blocks = AdBlock::where('number', 0)->get();

    //     $headTitle = $request->route()->getName() == 'home' ? 'FetishMegaStore' : 'Browse Videos';

    //     //$recommendedVideoId = RecommendedVideo::pluck('video_id')->toArray();

    //     //$recommendedVideo = Video::with(['streamer'])->whereIn('id', $recommendedVideoId)->paginate(16);

    //     //$featuredChannels = User::where('is_featured_verified', 1)->with('videos')->get();

    //     $userLoginID = auth()->id();

    //     $adImage = asset(opt('image'));
    //     $adLink = opt('img_url');
    //     $faqs = Faq::where('status', 1)->orderBy('order_by', 'asc')->get();
    //     // dd("in", $videos, $videos['data'][0]['views']);
    //     return Inertia::render('Videos/BrowseVideos', [
    //         'userLoginID' => $userLoginID,
    //         'userrequest' => $userrequest,
    //         'featuredChannels' => $featuredChannels,
    //         'randomvideos' => $randomvideos,
    //         'recommendedVideo' => $recommendedVideo,
    //         'videos' => $videos,
    //         'category' => $category,
    //         'exploreImage' => $exploreImage,
    //         'categories' => $categories,
    //         'tags' => $tags,
    //         'models' => $models,
    //         'blocks' => $blocks,
    //         'headTitle' => $headTitle,
    //         'adImage' => $adImage,
    //         'adLink' => $adLink,
    //         'watchVideos' => $watchVideos,
    //         'faqs' => $faqs,
    //     ]);
    // }

    public function browseVideos(VideoCategories $videocategory = null, string $slug = null)
    {
        $request = request();
        $sort = $request->get('sort', 'Recently');
        $perPage = 30; // Ek page par kitne items dikhane hain
        $preFetchLimit = 100;

        // --- Watch History ka logic (same rahega) ---
        $watchVideos = collect();
        if (auth()->check()) {
            $slugs = session('unauth_viewed_videos', []);
            if (!empty($slugs)) {
                // Get videos from both tables
                $videos = Video::whereIn('slug', $slugs)->get();
                $shortVideos = ShortVideo::whereIn('slug', $slugs)->get();
                $watchVideos = $videos->merge($shortVideos);
                foreach ($watchVideos as $watchVideo) {
                    $videoId = $watchVideo->id;
                    $videoType = $watchVideo instanceof ShortVideo ? 'short-video' : 'video';

                    $alreadyExists = ContentWatchHistory::where('user_id', auth()->id())
                        ->where('video_id', $videoId)
                        ->where('type', $videoType)
                        ->first();

                    if (!$alreadyExists) {
                        ContentWatchHistory::create([
                            'user_id' => auth()->id(),
                            'IP' => request()->ip() ?? '',
                            'type' => $videoType,
                            'video_id' => $videoId,
                            'date' => Carbon::today()->format('Y-m-d'),
                        ]);
                    }
                }
                session()->forget('unauth_viewed_videos');
            }
        }

        // --- FILTER AUR SORT FUNCTIONS ---
        $applyFilters = function ($query) use ($request, $videocategory) {
            if ($videocategory) {
                $query->where('category_id', 'LIKE', "%{$videocategory->id}%");
            }
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

        // 1. Videos fetch karein
        $videosQuery = $applySort($applyFilters(Video::with('streamer')), $sort);
        $videos = $videosQuery->limit($preFetchLimit)->get();

        // 2. Short Videos fetch karein
        $shortVideosQuery = $applySort($applyFilters(ShortVideo::with('streamer')->where('type', 'short-video')), $sort);
        $shortVideos = $shortVideosQuery->limit($preFetchLimit)->get();

        // 3. Sabhi ko merge karein aur type set karein
        $allVideos = collect([])
            ->merge($videos->each(fn($item) => $item->setAttribute('type', 'video')))
            ->merge($shortVideos->each(fn($item) => $item->setAttribute('type', 'short-video')));

        // 4. Shuffle karein
        $shuffledVideos = $allVideos->shuffle();

        // 5. Manually Paginator banayein
        $currentPage = LengthAwarePaginator::resolveCurrentPage();
        $currentPageItems = $shuffledVideos->slice(($currentPage - 1) * $perPage, $perPage)->values();
        $paginatedVideos = new LengthAwarePaginator(
            $currentPageItems,
            $shuffledVideos->count(),
            $perPage,
            $currentPage,
            ['path' => $request->url(), 'query' => $request->query()]
        );

        $hasFilter = $request->filled('search') || $request->filled('selectedCategories') || $request->filled('selectedTags') || $request->filled('selectedModels');
//        $recommendedVideo = $hasFilter ? collect() : RecommendedVideo::pluck('video_id')->toArray();
        $recommendedVideo =  collect() ;
        $recommendedVideoId = RecommendedVideo::pluck('video_id')->toArray();
        $recommendedVideo = Video::with(['streamer'])->whereIn('id', $recommendedVideoId)->paginate(16);
        $featuredChannels = $hasFilter ? collect() : User::where('is_featured_verified', 1)->with('videos')->get();

        // Props for frontend
        $categories = VideoCategories::orderBy('category')->get();
        $tags = Tag::orderBy('name')->get();
        $models = Models::orderBy('name')->get();
        $exploreImage = asset('images/browse-videos-icon.png');
        $headTitle = $request->route()->getName() == 'home' ? 'FetishMegaStore' : 'Browse Videos';

        return Inertia::render('Videos/BrowseVideos', [
            'userLoginID' => auth()->id(),
            'videos' => $paginatedVideos,
            'featuredChannels' => $featuredChannels,
            'recommendedVideo' => $recommendedVideo,
            'category' => $videocategory,
            'categories' => $categories,
            'tags' => $tags,
            'models' => $models,
            'exploreImage' => $exploreImage,
            'headTitle' => $headTitle,
            'watchVideos' => $watchVideos,
            'faqs' => Faq::where('status', 1)->orderBy('order_by', 'asc')->get(),
            'blocks' => AdBlock::where('number', 0)->get(),
            'userrequest' => [
                'sort' => $request->get('sort', 'Recently'),
                'search' => $request->get('search'),
                'page' => $currentPage,
                'selectedCategories' => $request->get('selectedCategories', []),
                'selectedTags' => $request->get('selectedTags', []),
                'selectedModels' => $request->get('selectedModels', []),
            ],
        ]);
    }

    public function filterVideos(Request $request)
    {
        // dd($request->all());
        $videosQuery = Video::select(
            'id',
            'user_id',
            'title',
            'slug',
            'thumbnail',
            'price',
            'views',
            'tags',
            'category_id',
            'model_id',
            'created_at',
            DB::raw("'video' as type") // Type column add kiya
        )->with('streamer');

        $shortVideosQuery = ShortVideo::select(
            'id',
            'user_id',
            'title',
            'slug',
            'thumbnail',
            'price',
            'views',
            'tags',
            'category_id',
            'model_id',
            'created_at',
            DB::raw("'short-video' as type") // Type column add kiya
        )->with('streamer');

        // ---- FILTERING LOGIC ----

        // Search Filter
        if ($request->filled('search')) {
            $searchTerm = '%' . $request->search . '%';
            $videosQuery->where('title', 'LIKE', $searchTerm);
            $shortVideosQuery->where('title', 'LIKE', $searchTerm);
        }

        // Category Filter
        if ($request->filled('selectedCategories')) {
            $categories = $request->selectedCategories;
            $videosQuery->where(function ($query) use ($categories) {
                foreach ($categories as $catId) {
                    $query->orWhereRaw("FIND_IN_SET(?, category_id)", [$catId]);
                }
            });
            $shortVideosQuery->where(function ($query) use ($categories) {
                foreach ($categories as $catId) {
                    $query->orWhereRaw("FIND_IN_SET(?, category_id)", [$catId]);
                }
            });
        }

        // Tags Filter
        if ($request->filled('selectedTags')) {
            $tags = $request->selectedTags;
            $videosQuery->where(function ($query) use ($tags) {
                foreach ($tags as $tag) {
                    $query->orWhere('tags', 'LIKE', "%{$tag}%");
                }
            });
            $shortVideosQuery->where(function ($query) use ($tags) {
                foreach ($tags as $tag) {
                    $query->orWhere('tags', 'LIKE', "%{$tag}%");
                }
            });
        }

        // Models Filter
        if ($request->filled('selectedModels')) {
            $models = $request->selectedModels;
            $videosQuery->where(function ($query) use ($models) {
                foreach ($models as $modelId) {
                    $query->orWhereRaw("FIND_IN_SET(?, model_id)", [$modelId]);
                }
            });
            $shortVideosQuery->where(function ($query) use ($models) {
                foreach ($models as $modelId) {
                    $query->orWhereRaw("FIND_IN_SET(?, model_id)", [$modelId]);
                }
            });
        }

        // Dono queries ko UNION karein
        $videosQuery->unionAll($shortVideosQuery);

        // Ab combined query se ek naya query builder banayein
        $finalQuery = DB::table(DB::raw("({$videosQuery->toSql()}) as videos"))
            ->mergeBindings($videosQuery->getQuery());

        // ---- SORTING LOGIC ----
        $sort = $request->get('sort', 'Recently');
        switch ($sort) {
            case 'Most':
                $finalQuery->orderByDesc('views');
                break;
            case 'Recently':
                $finalQuery->orderByDesc('id');
                break;
            case 'Older':
                $finalQuery->orderBy('created_at', 'asc');
                break;
            case 'Highest':
                $finalQuery->orderByDesc('price');
                break;
            case 'Lowest':
                $finalQuery->orderBy('price', 'asc');
                break;
            case 'Only Free':
                $finalQuery->where(function ($q) {
                    $q->where('price', 0)->orWhereNull('price');
                })->orderByDesc('views');
                break;
            default:
                $finalQuery->orderByDesc('id');
                break;
        }

        // Paginate the final results
        $videos = $finalQuery->paginate(12)->appends($request->query());

        // Manually load streamer relationship for paginated results
        $videoModels = Video::whereIn('id', $videos->pluck('id')->where('type', 'video'))->with('streamer')->get()->keyBy('id');
        $shortVideoModels = ShortVideo::whereIn('id', $videos->pluck('id')->where('type', 'short-video'))->with('streamer')->get()->keyBy('id');

        // $videos->getCollection()->transform(function ($video) use ($videoModels, $shortVideoModels) {
        //     if ($video->type === 'video') {
        //         $video->streamer = $videoModels->get($video->id)->streamer ?? null;
        //     } else {
        //         $video->streamer = $shortVideoModels->get($video->id)->streamer ?? null;
        //     }
        //     return $video;
        // });

        $videos->getCollection()->transform(function ($video) use ($videoModels, $shortVideoModels) {
            // ... (transform logic waise hi rahegi)
            if ($video->type === 'video') {
                $video->streamer = $videoModels->get($video->id)->streamer ?? null;
            } else {
                $video->streamer = $shortVideoModels->get($video->id)->streamer ?? null;
            }
            return $video;
        });

        // SIMPLE FIX: Sirf woh data bhejein jo badal raha hai
        // return inertia('Videos/BrowseVideos', [
        //     'videos' => $videos,
        //     'userrequest' => $request->all() // Yeh zaroori hai taaki filter inputs apni value yaad rakhein
        // ]);
           return inertia('Videos/BrowseVideos', [
            // Filtered Data
            'videos' => $videos,
            'userrequest' => $request->all(),

            // Static Data jo Component ko render hone ke liye chahiye
            'categories' => VideoCategories::orderBy('category')->get(),
            'tags' => Tag::orderBy('name')->get(),
            'models' => Models::orderBy('name')->get(),
            'blocks' => AdBlock::where('number', 0)->get(),
            'faqs' => Faq::where('status', 1)->orderBy('order_by', 'asc')->get(),
            'headTitle' => 'Filtered Videos', // Aap title bhi update kar sakte hain
            'exploreImage' => asset('images/browse-videos-icon.png'),
            
            // Yeh sections filter ke baad nahi dikhenge, isliye khaali bhej rahe hain
            'randomvideos' => ['data' => [], 'total' => 0],
            'recommendedVideo' => ['data' => [], 'total' => 0],
            'featuredChannels' => [],

            // 'category' prop
            'category' => null, // Kyunki yeh ek specific category page nahi hai
        ]);
        // return $videos;
    }

    public function videosManager(Request $request)
    {
        Gate::authorize('channel-settings');

        $videos = $request->user()->videos();
        // ->with('category')

        if ($request->filled('search')) {
            $videos = $videos->where('title', 'LIKE', '%' . $request->search . '%');
        }

        $videos = $videos->withSum('sales', 'price')->orderByDesc('id')->paginate(9)->appends($request->query());
            // ->get()->toArray();
        // dd($videos);

        return Inertia::render('Videos/MyVideos', compact('videos'));
    }

    public function previewManager(Request $request)
    {
        Gate::authorize('channel-settings');

        $videos = ShortVideo::where('user_id', Auth::user()->id)->with(['streamer'])->paginate(9);

        return Inertia::render('Videos/PreviewVideos', compact('videos'));
    }

    public function uploadVideos(Request $request)
    {
        Gate::authorize('channel-settings');

        $video = [
            'id' => null,
            'title' => '',
            'category_id' => '',
            'price' => 0,
            'free_for_subs' => 'no'
        ];

        $imageDirectory = public_path('videos');
        // $directories = File::directories($imageDirectory);
        $availableVideos = \Illuminate\Support\Facades\File::files($imageDirectory);
        $fileNames = [];
        foreach ($availableVideos as $videoDeatils) {
            $checkString = 'videos/' . $videoDeatils->getFilename();
            $checkIfThatVideoAlreadyAssigned = Video::where('video', $checkString)->exists();

            if ($checkIfThatVideoAlreadyAssigned) {
                continue;
            }

            $array = [];
            $array['label'] = $videoDeatils->getFilename();
            $array['value'] = $videoDeatils->getFilename();
            $fileNames[] = $array;
        }

        $tag = Tag::orderBy('id', 'desc')->get();

        $model = Models::orderBy('id', 'desc')->get();

        $category = VideoCategories::orderBy('category')->get();

        $tags = [];
        foreach ($tag as $tagDetails) {
            $dummy = [];
            $dummy['label'] = $tagDetails->name;
            $dummy['value'] = $tagDetails->name;
            $tags[] = $dummy;
        }
        // dd($tags)
        $categories = [];

        foreach ($category as $catDetails) {
            $dummy = [];
            $dummy['label'] = $catDetails->category;
            $dummy['value'] = $catDetails->id;
            $categories[] = $dummy;
        }

        $models = [];

        foreach ($model as $modelDetails) {
            $dummy = [];
            $dummy['label'] = $modelDetails->name;
            $dummy['value'] = $modelDetails->id;
            $models[] = $dummy;
        }
        $supportedLocales = getSupportedLocales();

        // $databaseVideos = Video::select('id','title')->orderBy('id','DESC')->get();
        // $ogValue = [
        //     'title' => null,
        //     'description' => null,
        //     'description_lang' => null,
        //     'title_lang' => null,
        // ];

        $ogValue = [
            'title' => [],
            'description' => [],
            'description_lang' => null,
            'title_lang' => null,
        ];

        return Inertia::render('Videos/Partials/UploadVideo', compact('video','ogValue', 'categories', 'fileNames', 'tags', 'models','supportedLocales'));
    }

    public function uploadPreviews(Request $request)
    {
        Gate::authorize('channel-settings');

        $video = [
            'id' => null,
            'title' => '',
            'category_id' => '',
            'price' => 0,
            'free_for_subs' => 'no',
        ];

        $imageDirectory = public_path('short-videos');
        $availableVideos = \Illuminate\Support\Facades\File::files($imageDirectory);
        $fileNames = [];
        foreach ($availableVideos as $videoDeatils) {
            $checkString = 'short-videos/' . $videoDeatils->getFilename();
            $checkIfThatVideoAlreadyAssigned = ShortVideo::where('video', $checkString)->exists();
            if ($checkIfThatVideoAlreadyAssigned) {
                continue;
            }
            $array = [];
            $array['label'] = $videoDeatils->getFilename();
            $array['value'] = 'short-videos/' . $videoDeatils->getFilename();
            $fileNames[] = $array;
        }

        $tag = Tag::orderBy('name', 'asc')->get();
        $tags = [];
        foreach ($tag as $tagDetails) {
            $dummy = [];
            $dummy['label'] = $tagDetails->name;
            $dummy['value'] = $tagDetails->id;
            $tags[] = $dummy;
        }

        $model = Models::orderBy('id', 'desc')->get();

        $category = VideoCategories::orderBy('category')->get();

        $categories = [];

        foreach ($category as $catDetails) {
            $dummy = [];
            $dummy['label'] = $catDetails->category;
            $dummy['value'] = $catDetails->id;
            $categories[] = $dummy;
        }

        $models = [];

        foreach ($model as $modelDetails) {
            $dummy = [];
            $dummy['label'] = $modelDetails->name;
            $dummy['value'] = $modelDetails->id;
            $models[] = $dummy;
        }

        $databaseVideo = Video::select('id', 'title')->limit(10)->get();
        $systemVideo = [];

        foreach ($databaseVideo as $details) {
            // $systemVideo[] = ['label' => $details->title, 'value' => $details->id];)
            $title = json_decode($details->getRawOriginal('title'));
            $val = App::currentLocale();
            $systemVideo[] = ['label' => $title, 'value' => $details->id];
        }

        // dd($systemVideo);
        // $databaseVideos = Video::select('id','title')->orderBy('id','DESC')->get();

        $isEdit = false;
        $supportedLocales = getSupportedLocales();
        $ogValue = [
            'title' => [],
            'description' => [],
            'description_lang' => null,
            'title_lang' => null,
        ];

        return Inertia::render('Videos/Partials/UploadPreview', compact('video', 'ogValue', 'categories', 'fileNames', 'tags', 'models', 'systemVideo', 'isEdit','supportedLocales'));
    }

    public function previewEdit(ShortVideo $video)
    {
        Gate::authorize('channel-settings');

        $imageDirectory = public_path('short-videos');
        $availableVideos = \Illuminate\Support\Facades\File::files($imageDirectory);
        $fileNames = [];
        foreach ($availableVideos as $videoDeatils) {
            $checkString = 'short-videos/' . $videoDeatils->getFilename();
            $checkIfThatVideoAlreadyAssigned = ShortVideo::where('video', $checkString)->exists();
            if ($checkIfThatVideoAlreadyAssigned) {
                continue;
            }
            $array = [];
            $array['label'] = $videoDeatils->getFilename();
            $array['value'] = 'short-videos/' . $videoDeatils->getFilename();
            $fileNames[] = $array;
        }

        $tag = Tag::orderBy('name', 'asc')->get();
        $tags = [];
        foreach ($tag as $tagDetails) {
            $dummy = [];
            $dummy['label'] = $tagDetails->name;
            $dummy['value'] = $tagDetails->id;
            $tags[] = $dummy;
        }

        $model = Models::orderBy('id', 'desc')->get();

        $category = VideoCategories::orderBy('category')->get();

        $categories = [];

        foreach ($category as $catDetails) {
            $dummy = [];
            $dummy['label'] = $catDetails->category;
            $dummy['value'] = $catDetails->id;
            $categories[] = $dummy;
        }

        $models = [];

        foreach ($model as $modelDetails) {
            $dummy = [];
            $dummy['label'] = $modelDetails->name;
            $dummy['value'] = $modelDetails->id;
            $models[] = $dummy;
        }

        $databaseVideo = Video::select('id', 'title')->get();
        $systemVideo = [];
        $shortVideo = $video;

        foreach ($databaseVideo as $details) {
            $title = json_decode($details->getRawOriginal('title'));
            $val = App::currentLocale();
            $systemVideo[] = ['label' => $title, 'value' => $details->id];
        }
        $supportedLocales = getSupportedLocales();
        $isEdit = true;

        $ogValue = new \stdClass();
        $ogValue->title = json_decode($video->getRawOriginal('title'));
        $ogValue->description = json_decode($video->getRawOriginal('description'));
        $ogValue->description_lang = $video->description_lang;
        $ogValue->title_lang = $video->title_lang;

        if ($ogValue->title_lang === null || trim($ogValue->title_lang) === "") {
            $video->title_lang = "de";
            $ogValue->title_lang = "de";
        }

        if ($ogValue->description_lang === null || trim($ogValue->description_lang) === "") {
            $ogValue->description_lang = "de";
            $video->description_lang = "de";
        }
        // dd($video->title_lang, $video->description_lang, $video, $ogValue);

        return Inertia::render('Videos/Partials/UploadPreview', compact('video', 'ogValue', 'categories', 'fileNames', 'tags', 'models', 'systemVideo', 'isEdit','supportedLocales'));
    }

    public function editVideo(Video $video)
    {
        //  if (auth()->user()->is_streamer == 'yes') {
        //      return to_route('videos.list')->with('message', __('You cannot edit the video'));
        //  }

        Gate::authorize('channel-settings');

        //  $categories = VideoCategories::orderBy('category')->get();
        //  dd($video->video, $video);
        $imageDirectory = public_path('videos');
        //  $directories = File::directories($imageDirectory);
        $availableVideos = \Illuminate\Support\Facades\File::files($imageDirectory);
        $fileNames = [];
        foreach ($availableVideos as $videoDeatils) {
            $array = [];
            $array['label'] = $videoDeatils->getFilename();
            $array['value'] = $videoDeatils->getFilename();
            $fileNames[] = $array;
        }
        
        //  dd($video->video, $video);
        if($video->video != null){
            $video->video = explode('/', $video->video)[1];
        }

        $tag = Tag::orderBy('id', 'desc')->get();
        $tags = [];
        foreach ($tag as $tagDetails) {
            $dummy = [];
            $dummy['label'] = $tagDetails->name;
            $dummy['value'] = $tagDetails->name;
            $tags[] = $dummy;
        }

        //  $ogValue = DB::

        $model = Models::orderBy('id', 'desc')->get();

        $category = VideoCategories::orderBy('category')->get();

        $categories = [];

        foreach ($category as $catDetails) {
            $dummy = [];
            $dummy['label'] = $catDetails->category;
            $dummy['value'] = $catDetails->id;
            $categories[] = $dummy;
        }

        $models = [];

        foreach ($model as $modelDetails) {
            $dummy = [];
            $dummy['label'] = $modelDetails->name;
            $dummy['value'] = $modelDetails->id;
            $models[] = $dummy;
        }
        $supportedLocales = getSupportedLocales();

        $ogValue = new \stdClass();
        $ogValue->title = json_decode($video->getRawOriginal('title'));
        $ogValue->description = json_decode($video->getRawOriginal('description'));
        $ogValue->description_lang = $video->description_lang;
        $ogValue->title_lang = $video->title_lang;
        // dd(gettype($ogValue), $ogValue, $video);

        if ($ogValue->title_lang === null || trim($ogValue->title_lang) === "") {
            $video->title_lang = "de";
            $ogValue->title_lang = "de";
        }

        if ($ogValue->description_lang === null || trim($ogValue->description_lang) === "") {
            $ogValue->description_lang = "de";
            $video->description_lang = "de";
        }
        // dd($video->title_lang, $video->description_lang, $video, $ogValue);
        return Inertia::render('Videos/Partials/UploadVideo', compact('video', 'ogValue', 'categories', 'fileNames', 'tags', 'models','supportedLocales'));
    }

    public function save(Request $request)
    {
        // dd($request->all());
        // Authorize the action
        // Gate::authorize('channel-settings');

        // Validate the incoming request data
        $validatedData = $request->validate([
            'title_en' => 'required|string|max:255',
            'title_de' => 'nullable|string|max:255',
            // 'price' => 'required|numeric|min:0',
            // 'thumbnail' => 'required|image|mimes:png,jpg,jpeg|max:2048',
            // 'video' => 'required|mimes:mp4,avi,mov,mkv|max:102400',
            // 'category_id' => 'required|array',
            // 'category_id.*' => 'integer|exists:categories,id',
            // 'model_id' => 'nullable|array',
            // 'model_id.*' => 'integer|exists:models,id',
            // 'tag' => 'nullable|array',
            // 'tag.*' => 'string',
            // 'description_en' => 'nullable|string',
            // 'description_de' => 'nullable|string',
            // 'free_for_subs' => 'nullable|boolean',
            // 'is_from_ftp' => 'nullable|boolean', // Assuming this field exists
        ]);

        // Define the filesystem disk
        $disk = env('FILESYSTEM_DISK', 'public');

        // Create necessary directories if they don't exist
        Storage::disk($disk)->makeDirectory('videos');
        Storage::disk($disk)->makeDirectory('thumbnails');

        // Initialize variables to store file paths
        $thumbFile = null;
        $videoPath = null;

        // Handle thumbnail upload
        if ($request->hasFile('thumbnail')) {
            $thumbnail = Image::make($request->file('thumbnail'))->fit(640, 320)->stream();
            $thumbFileName = uniqid() . '-' . auth()->id() . '.' . $request->file('thumbnail')->getClientOriginalExtension();
            $thumbFile = 'thumbnails/' . $thumbFileName;
            Storage::disk($disk)->put($thumbFile, $thumbnail);
            Storage::disk($disk)->setVisibility($thumbFile, 'public');
        }

        // Handle video upload
        // if ($request->hasFile('video')) {
        //     $videoFile = $request->file('video');
        //     $videoFileName = uniqid() . '-' . auth()->id() . '.' . $videoFile->getClientOriginalExtension();
        //     $videoPath = 'videos/' . $videoFileName;
        //     Storage::disk($disk)->put($videoPath, file_get_contents($videoFile->getPathname()));
        //     Storage::disk($disk)->setVisibility($videoPath, 'public');
        // }

        // Use a database transaction to ensure atomicity
        DB::beginTransaction();

        try {
            $titleData = ['en' => $request->title_en];
            if ($request->filled('title_lang') && $request->filled('title_de')) {
                $titleData[$request->title_lang] = $request->title_de;
            }

            $descriptionData = ['en' => $request->description_en];
            if ($request->filled('description_lang') && $request->filled('description_de')) {
                $descriptionData[$request->description_lang] = $request->description_de;
            }

            // dd($titleData, $descriptionData);

            $video = $request->user()->videos()->create([
                // 'title' => json_encode([
                //     'en' => $request['title_en'],
                //     'de' => $request['title_de'],
                // ]),
                'title' => json_encode($titleData, JSON_UNESCAPED_UNICODE),
                'title_lang' => $request->title_lang,
                'description' => json_encode($descriptionData, JSON_UNESCAPED_UNICODE),
                'description_lang' => $request->description_lang,
                'price' => $request['price'],

                'slug' => Str::slug($request['title_en']) . '-' . uniqid(), // Ensure uniqueness
                'free_for_subs' => $request['free_for_subs'] ?? false,
                'thumbnail' => $thumbFile,
                'video' => $request['video_file'],
                'disk' => $disk,
                'type' => 'video',
                // 'category_id' => implode(',', $request['category_id']),
                // 'model_id' => isset($request['model_id']) ? (is_array($request['model_id']) ? implode(',', $request['model_id']) : (string)$request['model_id']) : null,
                // 'tags' => isset($request['tag']) ? implode(',', $request['tag']) : null,
                'category_id' => implode(',', $request['category_id']),
                'model_id' => isset($request['model_id']) ? implode(',', $request['model_id']) : null,
                'tags' => isset($request['tag']) ? implode(',', $request['tag']) : null,
                'is_from_ftp' => $request['is_from_ftp'] ?? false,
                'seo' => $request->has('seo') ? json_encode($request->seo) : null,
                'views' => Video::RandomViews(),
                // 'description' => json_encode([
                //     'en' => $request['description_en'],
                //     'de' => $request['description_de'],
                // ]),
            ]);
            // dd($video);
            // Commit the transaction
            DB::commit();
        } catch (\Exception $e) {
            // Rollback the transaction on error
            DB::rollBack();

            // Optionally, delete the uploaded files if database insertion fails
            if ($thumbFile && Storage::disk($disk)->exists($thumbFile)) {
                Storage::disk($disk)->delete($thumbFile);
            }
            if ($videoPath && Storage::disk($disk)->exists($videoPath)) {
                Storage::disk($disk)->delete($videoPath);
            }

            // Log the error or handle it as needed
            return back()->withErrors(['error' => 'An error occurred while saving the video. Please try again.']);
            // return redirect()->back()->with('message', __('Video successfully uploaded'));
        }

        // Redirect to the videos list with a success message
        return redirect()->route('videos.list')->with('message', __('Video successfully uploaded'));
    }

    public function previewSave(Request $request)
    {
        //dd($request->all());

        Gate::authorize('channel-settings');

        $request->validate([
            //            'title' => 'required|min:2',
            'title_en_val' => 'required|min:2',
            'title_de' => 'required|min:2',
            'thumbnail' => 'required|mimes:png,jpg',
            'video_file' => 'required',
            'category_id' => 'required|array', 
            'description_en_val' => 'required',
            'description_de' => 'required',
            'tag' => 'required|array',
        ]);

        $thumbnail = Image::make($request->file('thumbnail'))->fit(640, 320)->stream();
        $thumbFile = 'short-videos/thumbnail/' . uniqid() . '-' . auth()->id() . '.' . $request->file('thumbnail')->getClientOriginalExtension();
        Storage::disk(env('FILESYSTEM_DISK'))->put($thumbFile, $thumbnail);
        Storage::disk(env('FILESYSTEM_DISK'))->setVisibility($thumbFile, 'public');

        $titleData = ['en' => $request->title_en_val]; 
        if ($request->filled('title_lang') && $request->filled('title_de')) {
            $titleData[$request->title_lang] = $request->title_de;
        }

        $descriptionData = ['en' => $request->description_en_val];
        if ($request->filled('description_lang') && $request->filled('description_de')) {
            $descriptionData[$request->description_lang] = $request->description_de;
        }

        ShortVideo::create([
            'user_id' => Auth::user()->id,
            'title' => json_encode($titleData, JSON_UNESCAPED_UNICODE),
            'slug' => Str::slug($request->title_en_val),
            'thumbnail' => $thumbFile,
            'video' => $request->video_file,
            'type' => 'short-video',
            'category_id' => implode(',', $request->category_id),
            'model_id' => $request->model_id ? implode(',', $request->model_id) : null,
            'tags' => implode(',', $request->tag),
            'description' =>json_encode($descriptionData, JSON_UNESCAPED_UNICODE),
            'seo' => $request->has('seo') ? json_encode($request->seo) : null,
            'title_lang' => $request->title_lang,
            'description_lang' => $request->description_lang,
            'video_id' => $request->video_id ?? null,
            'views' => ShortVideo::RandomViews(),
        ]);

        return to_route('preview.list')->with('message', __('Preview successfully uploaded'));
    }

    public function updateVideo(Video $video, Request $request)
    {
        Gate::authorize('channel-settings');

        $video_Path = null;

        $request->validate([
            //            'title' => 'required|min:2',
            'title_en' => 'required|min:2',
            'title_de' => 'required|min:2',
            'price' => 'required|numeric',
            'free_for_subs' => 'required|in:yes,no',
            'category_id.*' => 'required',
        ]);

        if ($request->user()->id !== $video->user_id) {
            abort(403, __("You do not seem to be the owner of this video"));
        }

        if ($request->video_file) {
            $video->video = $request->video_file;
            $video->save();
        }

        // resize & upload thumbnail
        if ($request->hasFile('thumbnail')) {
            $thumbnail = Image::make($request->file('thumbnail'))->fit(640, 320)->stream();
            $thumbFile = 'thumbnails/' . uniqid() . '-' . auth()->id() . '.' . $request->file('thumbnail')->getClientOriginalExtension();

            Storage::disk(env('FILESYSTEM_DISK'))->put($thumbFile, $thumbnail);
            Storage::disk(env('FILESYSTEM_DISK'))->setVisibility($thumbFile, 'public');

            $video->thumbnail = $thumbFile;
            // dd($video, $request->thumbnail, $request->all());
            $video->save();
        }

        if ($request->has('tag') && is_array($request->tag)) {
            $tags = implode(',', $request->tag);
        } else {
            $tags = $request->tag ?? $video->tags;
        }

        $titleData = ['en' => $request->title_en];
        if ($request->filled('title_lang') && $request->filled('title_de')) {
            $titleData[$request->title_lang] = $request->title_de;
        }

        $descriptionData = ['en' => $request->description_en];
        if ($request->filled('description_lang') && $request->filled('description_de')) {
            $descriptionData[$request->description_lang] = $request->description_de;
        }
        // dd($request->all());
        // dd($request['tag'], $titleData, $descriptionData);

        $video->update([
            'title' => json_encode($titleData, JSON_UNESCAPED_UNICODE),
            'title_lang' => $request->title_lang,
            'description' => json_encode($descriptionData, JSON_UNESCAPED_UNICODE),
            'description_lang' => $request->description_lang,
            'slug' => Str::slug($request->title_en),
            'price' => $request->price,
            'free_for_subs' => $request->free_for_subs,
            //  'free_for_subs' => 'yes',
            // 'thumbnail' => $thumbFile,
            // 'video' => $request['video_file'],
            'type' => 'video',
            'disk' => env('FILESYSTEM_DISK'),
            'category_id' => $request->category_id ? implode(',', $request->category_id) : $video->category_id,
            'model_id' => $request->model_id ? implode(',', $request->model_id) : $video->model_id,
            'is_from_ftp' => $request->is_from_ftp == '1' ? true : false,
            'tags' => isset($request['tag']) ? implode(',', $request['tag']) : implode(',', $video->tags),
            //'description' => json_encode(['en' => $request->description_en, 'de' => $request->description_de]),
        ]);

        return back()->with('message', __('Video successfully updated'));
    }

    public function previewUpdate(ShortVideo $video, Request $request)
    {
        $request->validate([
            // 'title' => 'required|min:2',
            'title_en_val' => 'required|min:2',
            'title_de' => 'required|min:2',
            'category_id.*' => 'required',
        ]);

        if ($request->user()->id !== $video->user_id) {
            abort(403, __("You do not seem to be the owner of this video"));
        }

        if ($request->filled('video_file')) {
            $video->video = $request->video_file;
            $video->save();
        }

        // resize & upload thumbnail
        if ($request->hasFile('thumbnail')) {
            $thumbnail = Image::make($request->file('thumbnail'))->fit(640, 320)->stream();
            $thumbFile = 'thumbnails/' . uniqid() . '-' . auth()->id() . '.' . $request->file('thumbnail')->getClientOriginalExtension();

            Storage::disk(env('FILESYSTEM_DISK'))->put($thumbFile, $thumbnail);
            Storage::disk(env('FILESYSTEM_DISK'))->setVisibility($thumbFile, 'public');

            $video->thumbnail = $thumbFile;
            $video->save();
        }

        $titleData = ['en' => $request->title_en_val];
        if ($request->filled('title_lang') && $request->filled('title_de')) {
            $titleData[$request->title_lang] = $request->title_de;
        }

        // Step 2: Description ke liye dynamic array banayein
        $descriptionData = ['en' => $request->description_en_val];
        if ($request->filled('description_lang') && $request->filled('description_de')) {
            $descriptionData[$request->description_lang] = $request->description_de;
        }

        if ($request->has('tag') && is_array($request->tag)) {
            $tags = implode(',', $request->tag);
        } else {
            $tags = $request->tag ?? implode(',', $video->tags);
        }
        // dd($tags, $request->all());

        // create video entry
        $video->update([
            'user_id' => Auth::user()->id,
            'title' => $titleData,
            'slug' => Str::slug($request->title_en_val),
            'type' => 'short-video',
            'category_id' => implode(',', $request->category_id),
            'model_id' => $request->model_id ? implode(',', $request->model_id) : null,
            'tags' => $tags,
            'description' => $descriptionData,
            'title_lang' => $request->title_lang,
            'description_lang' => $request->description_lang,
            'seo' => $request->has('seo') ? json_encode($request->seo) : null,
            'video_id' => $request->video_id ?? null,
        ]);

        return to_route('preview.list')->with('message', __('Preview successfully updated'));
    }

    // attach video upload
    public function uploadChunkedVideo(Request $request)
    {

        $file = $request->file;
        $is_last = $request->is_last;

        // temp chunks path
        $path = Storage::disk('public')->path("chunks/{$file->getClientOriginalName()}");

        // Check if the 'chunks' directory exists, create if not
        $chunkDirectory = Storage::disk('public')->path('chunks');
        if (!is_dir($chunkDirectory)) {
            mkdir($chunkDirectory, 0777, true);
        }

        // filename without .part in it
        $withoutPart = basename($path, '.part');

        // set file name inside path without .part
        $renamePath = public_path('chunks/' . $withoutPart);

        // set allowed extensions
        $allowedExt = ['ogg', 'wav', 'mp4', 'webm', 'mov', 'qt'];
        $fileExt = explode('.', $withoutPart);
        $fileExt = end($fileExt);
        $fileExt = strtolower($fileExt);

        // preliminary: validate allowed extensions
        if (!in_array($fileExt, $allowedExt)) {
            Storage::disk('public')->delete($renamePath);
            throw new \Exception('Invalid extension');
        }

        // append chunk to the file
        FileFacade::append($path, $file->get());

        // finally, let's make the file complete
        if ($is_last == "true") {
            // rename the file to original name
            FileFacade::move($path, $renamePath);

            // set a reference to the local file
            $localFile = new File($renamePath);

            try {
                // first, let's get the mime type
                $finfo = new \finfo();
                $mime = $finfo->file($renamePath, FILEINFO_MIME_TYPE);
            } catch (\Exception $e) {
                $mime = null;
            }

            // validate allowed mimes
            if ($mime) {
                if (!in_array($mime, ['video/mp4', 'video/webm', 'video/mov', 'video/ogg', 'video/qt', 'video/quicktime']) && $mime != 'application/octet-stream') {
                    throw new \Exception('Invalid file type: ' . $mime);
                }

                // if mime type is application/octet-stream, treat it as 'video'
                if ($mime == 'application/octet-stream') {
                    $mime = 'video';
                }
            } else {
                $mime = 'video';
            }

            // set file destination
            $fileDestination = $request->has('from') && $request->from == 'short-videos' ? 'short-videos' : 'videos';

            // Move this thing to the storage disk
            $fileName = Storage::disk(env('FILESYSTEM_DISK'))->putFile($fileDestination, $localFile, 'public');

            // remove it from chunks folder
            FileFacade::delete($renamePath);

            return response()->json(['result' => $fileName]);
        }
    }

    public function delete(Request $request)
    {
        Gate::authorize('channel-settings');
        $video = $request->user()->videos()->findOrFail($request->video);
        //Storage::disk($video->disk)->delete($video->video);
        //Storage::disk($video->disk)->delete($video->thumbnail);
        if ($video->video && Storage::disk($video->disk)->exists($video->video)) {
            Storage::disk($video->disk)->delete($video->video);
        }
        if ($video->thumbnail && Storage::disk($video->disk)->exists($video->thumbnail)) {
            Storage::disk($video->disk)->delete($video->thumbnail);
        }
        $video->sales()->delete();
        $video->delete();
        return back()->with('message', __('Video removed'));
    }

    public function previewDelete(Request $request)
    {
        Gate::authorize('channel-settings');

        // find video
        $video = ShortVideo::findOrFail($request->video);

        // delete file from disk
        Storage::disk($video->disk)->delete($video->video);
        Storage::disk($video->disk)->delete($video->thumbnail);

        // delete video sales
        //        $video->sales()->delete();

        // delete video
        $video->delete();

        return back()->with('message', __('Preview removed'));
    }

    public function videoRequest(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'description' => 'required',
            'video_id' => 'required|exists:videos,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 0, 'message' => $validator->errors()->first()]);
        }

        $check = RequestedVideo::where('user_id', auth()->user()->id)->where('video_id', $request->video_id)->where('status', '0')->exists();

        if ($check) {
            return response()->json(['status' => 0, 'message' => 'you already requested this video!']);
        }

        try {

            $videoReq = new RequestedVideo();
            $videoReq->video_id = $request->video_id;
            $videoReq->user_id = auth()->user()->id;
            $videoReq->description = $request->description;
            $videoReq->save();

            return response()->json(['status' => 1, 'message' => 'Video Requested Successfully!']);
        } catch (\Exception $exception) {
            return response()->json(['status' => 0, 'message' => $exception->getMessage()]);
        }
    }

    public function videoDownload(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'slug' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 0, 'message' => $validator->getMessage()]);
        }

        $video = Video::whereSlug($request->slug)->first();

        $checkHistory = DownloadHistory::where(function ($query) use ($request, $video) {
            $query->where('user_id', auth()->user()->id)
                ->orWhere('ip', $request->ip());
        })
            ->where('video_id', $video->id)
            ->count();

        /* if ($checkHistory >= 2) {
        return response()->json(['status' => 0, 'message' => __('You have already downloaded this video 2 or more times.')]);
        } */

        try {

            $videoReq = new DownloadHistory();
            $videoReq->video_id = $video->id;
            $videoReq->user_id = auth()->user()->id;
            $videoReq->ip = $request->ip();
            $videoReq->save();

            return response()->json(['status' => 1, 'message' => 'Video Download Successfully!', 'link' => $video->videoUrl]);
        } catch (\Exception $exception) {
            return response()->json(['status' => 0, 'message' => $exception->getMessage()]);
        }
    }

    public function galleryManager(Request $request)
    {
        Gate::authorize('channel-settings');

        $videos = Gallery::where('user_id', Auth::user()->id)->paginate(9);
        //        dd(Auth::user()->id,$videos->toArray());

        return Inertia::render('Videos/GalleryPictures', compact('videos'));
    }

    public function uploadGallery(Request $request)
    {
        $video = [
            'id' => null,
            'title_en_val' => null,
            'selectedLang' => null,
            'title_de_val' => null,
            'description_en_val' => null,
            'selectedDescriptionLang' => null,
            'description_de_val' => null,
        ];

        Gate::authorize('channel-settings');

        $tag = Tag::orderBy('name', 'asc')->get();
        $tags = [];
        foreach ($tag as $tagDetails) {
            $dummy = [];
            $dummy['label'] = $tagDetails->name;
            $dummy['value'] = $tagDetails->id;
            $tags[] = $dummy;
        }

        $model = Models::orderBy('id', 'desc')->get();

        $category = VideoCategories::orderBy('category')->get();

        $categories = [];

        foreach ($category as $catDetails) {
            $dummy = [];
            $dummy['label'] = $catDetails->category;
            $dummy['value'] = $catDetails->id;
            $categories[] = $dummy;
        }

        $models = [];

        foreach ($model as $modelDetails) {
            $dummy = [];
            $dummy['label'] = $modelDetails->name;
            $dummy['value'] = $modelDetails->id;
            $models[] = $dummy;
        }

        $databaseVideo = Video::select('id', 'title')->get();
        $systemVideo = [];

        foreach ($databaseVideo as $details) {
            // $systemVideo[] = ['label' => $details->title, 'value' => $details->id];
            $title = json_decode($details->getRawOriginal('title'));
            $val = App::currentLocale();
            $systemVideo[] = ['label' => $title, 'value' => $details->id];
        }

        // $databaseVideos = Video::select('id','title')->orderBy('id','DESC')->get();
        $supportedLocales = getSupportedLocales();
        // $shortVideo = $video;
        // dd($shortVideo,$video);
        $ogValue = [
            'title' => [],
            'description' => [],
            'description_lang' => null,
            'title_lang' => null,
        ];
        $isEdit = false;
        return Inertia::render('Videos/Partials/UploadGallery', compact('video', 'ogValue', 'categories', 'tags', 'models', 'systemVideo', 'isEdit','supportedLocales'));
    }

    public function galleryEdit(Request $request, Gallery $video)
    {
        $tag = Tag::orderBy('name', 'asc')->get();
        $tags = [];
        foreach ($tag as $tagDetails) {
            $dummy = [];
            $dummy['label'] = $tagDetails->name;
            $dummy['value'] = $tagDetails->id;
            $tags[] = $dummy;
        }

        $model = Models::orderBy('id', 'desc')->get();

        $category = VideoCategories::orderBy('category')->get();

        $categories = [];

        foreach ($category as $catDetails) {
            $dummy = [];
            $dummy['label'] = $catDetails->category;
            $dummy['value'] = $catDetails->id;
            $categories[] = $dummy;
        }

        $models = [];

        foreach ($model as $modelDetails) {
            $dummy = [];
            $dummy['label'] = $modelDetails->name;
            $dummy['value'] = $modelDetails->id;
            $models[] = $dummy;
        }

        $databaseVideo = Video::select('id', 'title')->get();
        $systemVideo = [];

        foreach ($databaseVideo as $details) {
            // $systemVideo[] = ['label' => $details->title, 'value' => $details->id];
            $title = json_decode($details->getRawOriginal('title'));
            $val = App::currentLocale();
            $systemVideo[] = ['label' => $title, 'value' => $details->id];
        }
        $shortVideo = $video;

        $supportedLocales = getSupportedLocales();

        $ogValue = new \stdClass();
        $ogValue->title = json_decode($video->getRawOriginal('title'));
        $ogValue->description = json_decode($video->getRawOriginal('description'));
        $ogValue->description_lang = $video->description_lang;
        $ogValue->title_lang = $video->title_lang;
        // dd(gettype($ogValue), $ogValue, $video);
        $isEdit = true;

        if ($ogValue->title_lang === null || trim($ogValue->title_lang) === "") {
            $video->title_lang = "de";
            $ogValue->title_lang = "de";
        }

        if ($ogValue->description_lang === null || trim($ogValue->description_lang) === "") {
            $ogValue->description_lang = "de";
            $video->description_lang = "de";
        }
        // dd($video->title_lang, $video->description_lang, $video, $ogValue);
        return Inertia::render('Videos/Partials/UploadGallery', compact('video', 'ogValue', 'categories', 'tags', 'models', 'systemVideo', 'isEdit','supportedLocales'));
    }

    public function gallerySave(Request $request)
    {
        // dd($request->all());
        // Gate::authorize('channel-settings');
        $request->validate([
            'title_en' => 'required',
            'thumbnail' => 'required|image|mimes:jpeg,png,jpg,gif,svg,webp',
            // 'images' => 'required|array',
            // 'images.*' => 'image|mimes:jpeg,png,jpg,gif,svg,webp',
        ]);

        try {

            $titleData = ['en' => $request->title_en];
            if ($request->filled('title_lang') && $request->filled('title_de')) {
                $titleData[$request->title_lang] = $request->title_de;
            }

            $descriptionData = ['en' => $request->description_en];
            if ($request->filled('description_lang') && $request->filled('description_de')) {
                $descriptionData[$request->description_lang] = $request->description_de;
            }

            $blog = new Gallery();
            $blog->title = $titleData;
            $blog->description = $descriptionData;
            $blog->title_lang = $request->title_lang;
            $blog->description_lang = $request->description_lang;
            $blog->user_id = Auth::user()->id;
            $blog->slug = Str::slug($request->title_en);
            $blog->category_id = !empty($request->category_id) ? implode(',', $request->category_id) : null;
            $blog->model_id = !empty($request->model_id) ? implode(',', $request->model_id) : null;
            $blog->tags = !empty($request->tag) ? implode(',', $request->tag) : null;
            $blog->video_id = $request->video_id ?? null;
            // dd($blog, $request->all(), $descriptionData, $titleData);

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
            // dd($blog, $request->all(), $descriptionData, $titleData);
            $blog->save();

            // $thumbFile = null;
            // if ($request->hasFile('thumbnail')) {
            //     $thumbnail = Image::make($request->file('thumbnail'))->stream();
            //     $thumbFile = 'gallery/thumbnail/' . uniqid() . '.' . $request->file('thumbnail')->getClientOriginalExtension();
            //     Storage::disk(env('FILESYSTEM_DISK'))->put($thumbFile, $thumbnail);
            //     Storage::disk(env('FILESYSTEM_DISK'))->setVisibility($thumbFile, 'public');
            // }

            // // Multiple images ko process karein
            // $imagesPaths = [];
            // if ($request->hasFile('images')) {
            //     $addedImages = [];
            //     foreach ($request->file('images') as $key => $image) {
            //         $imageStream = Image::make($image)->stream();
            //         $imageFile = 'gallery/' . uniqid() . '-' . $key . '.' . $image->getClientOriginalExtension();
            //         Storage::disk(env('FILESYSTEM_DISK'))->put($imageFile, $imageStream);
            //         Storage::disk(env('FILESYSTEM_DISK'))->setVisibility($imageFile, 'public');
            //         $addedImages[] = $imageFile;
            //     }
            //     $imagesPaths = implode(',', $addedImages);
            // }

            // Gallery::create([
            //     'user_id' => Auth::user()->id,
            //     'title' => $titleData,
            //     'description' => $descriptionData,
            //     'title_lang' => $request->title_lang,
            //     'description_lang' => $request->description_lang,
            //     'slug' => Str::slug($request->title_en),
            //     'category_id' => !empty($request->category_id) ? implode(',', $request->category_id) : null,
            //     'model_id' => !empty($request->model_id) ? implode(',', $request->model_id) : null,
            //     'tags' => !empty($request->tag) ? implode(',', $request->tag) : null,
            //     'video_id' => $request->video_id ?? null,
            //     'thumbnail' => $thumbFile,
            //     'images' => $imagesPaths,
            //     'seo' => $request->has('seo') ? $request->seo : null, // Model casting iska dhyan rakhega
            // ]);

            return to_route('gallery.list')->with('message', __('Gallery Pictures Added Successfully!'));
        } catch (\Exception $exception) {
            return to_route('gallery.list')->with('message', $exception->getMessage());
        }
    }

    public function galleryUpdate(Request $request, Gallery $video)
    {
        //        dd($request->all(), $video);
        // Gate::authorize('channel-settings');

        //        $request->validate([
        //            'title_en' => 'required',
        ////            'thumbnail' => 'required|image|mimes:jpeg,png,jpg,gif,svg,webp',
        //            'images' => 'required|array',
        //            'images.*' => 'image|mimes:jpeg,png,jpg,gif,svg,webp',
        //        ]);

        try {

            $titleData = ['en' => $request->title_en];
            if ($request->filled('title_lang') && $request->filled('title_de')) {
                $titleData[$request->title_lang] = $request->title_de;
            }

            $descriptionData = ['en' => $request->description_en];
            if ($request->filled('description_lang') && $request->filled('description_de')) {
                $descriptionData[$request->description_lang] = $request->description_de;
            }

            $filterImages = [];

            foreach ($request->temp_gallery as $currentImages) {
                $filterImages[] = $currentImages['path'];
            }

            $blog = Gallery::find($video->id);
            $blog->title = $titleData;
            $blog->description = $descriptionData;
            $blog->title_lang = $request->title_lang;
            $blog->description_lang = $request->description_lang;
            $blog->user_id = Auth::user()->id;
            $blog->slug = Str::slug($request->title_en);
            $blog->category_id = !empty($request->category_id) ? implode(',', $request->category_id) : null;
            $blog->model_id = !empty($request->model_id) ? implode(',', $request->model_id) : null;
            $blog->tags = !empty($request->tag) ? implode(',', $request->tag) : implode(',', $video->tags) ;
            $blog->video_id = $request->video_id ?? null;

            if ($request->hasFile('thumbnail')) {
                $thumbnail = Image::make($request->file('thumbnail'))->stream();
                $thumbFile = 'gallery/thumbnail/' . uniqid() . '.' . $request->file('thumbnail')->getClientOriginalExtension();
                Storage::disk(env('FILESYSTEM_DISK'))->put($thumbFile, $thumbnail);
                Storage::disk(env('FILESYSTEM_DISK'))->setVisibility($thumbFile, 'public');
                $blog->thumbnail = $thumbFile;
            }

            if ($request->has('images')) {
                foreach ($request->images as $key => $image) {
                    $thumbnail = Image::make($image)->stream();
                    $thumbFile = 'gallery/' . uniqid() . '-' . $key . '.' . $image->getClientOriginalExtension();
                    Storage::disk(env('FILESYSTEM_DISK'))->put($thumbFile, $thumbnail);
                    Storage::disk(env('FILESYSTEM_DISK'))->setVisibility($thumbFile, 'public');
                    $filterImages[] = $thumbFile;
                }
            }
            $blog->images = implode(',', $filterImages);
            $blog->seo = $request->has('seo') ? json_encode($request->seo) : null;
            $blog->save();

            return to_route('gallery.list')->with('message', __('Gallery Pictures Updated Successfully!'));
        } catch (\Exception $exception) {
            return to_route('gallery.list')->with('message', $exception->getMessage());
        }
    }

    public function galleryDelete(Request $request)
    {

        $originalThumbnail = DB::table('gallery')->find($request->video)->thumbnail;

        unlink(public_path($originalThumbnail));

        Gallery::find($request->video)->delete();

        return to_route('gallery.list')->with('message', __('Gallery Deleted Successfully!'));
    }

    //audio upload function
    public function audioManager(Request $request)
    {
        Gate::authorize('channel-settings');
        $audio = $request->user()->audio()
            // ->withSum('sales', 'price')
            ->orderByDesc('id')
            ->paginate(9);
        // dd($audio);
        return Inertia::render('Videos/MyAudio', compact('audio'));
    }

    public function uploadAudio(Request $request)
    {
        // Gate authorization check
        Gate::authorize('channel-settings');

        // Initialize the audio array
        $audio = [
            'id' => null,
            'title' => '',
            'category_id' => '',
            'price' => 0,
            'free_for_subs' => 'no',
        ];

        // Directory for storing audio files
        $audioDirectory = public_path('audio');

        // Fetch all files from the audio directory
        $availableAudio = \Illuminate\Support\Facades\File::files($audioDirectory);

        $fileNames = [];
        foreach ($availableAudio as $audioDetails) {

            // Check if this audio file is already assigned
            $checkString = 'audio/' . $audioDetails->getFilename();
            $checkIfThatAudioAlreadyAssigned = Audio::where('audio', $checkString)->exists();

            if ($checkIfThatAudioAlreadyAssigned) {
                continue;
            }

            // Prepare file name data
            $fileNames[] = [
                'label' => $audioDetails->getFilename(),
                'value' => $audioDetails->getFilename(),
            ];
        }

        // Fetch tags
        $tags = Tag::orderBy('name', 'asc')->get()->map(function ($tagDetails) {
            return [
                'label' => $tagDetails->name,
                'value' => $tagDetails->name,
            ];
        });

        // Fetch models
        $models = Models::orderBy('id', 'desc')->get()->map(function ($modelDetails) {
            return [
                'label' => $modelDetails->name,
                'value' => $modelDetails->id,
            ];
        });

        // Fetch categories
        $categories = VideoCategories::orderBy('category')->get()->map(function ($catDetails) {
            return [
                'label' => $catDetails->category,
                'value' => $catDetails->id,
            ];
        });

        $supportedLocales = getSupportedLocales();
        $ogValue = [
            'title' => [],
            'description' => [],
            'description_lang' => null,
            'title_lang' => null,
        ];
        // Render the view with the necessary data
        return Inertia::render('Videos/Partials/UploadAudio', compact('audio', 'ogValue', 'categories', 'fileNames', 'tags', 'models','supportedLocales'));
    }

    public function editAudio(Audio $audio)
    {
        // if (auth()->user()->is_streamer == 'yes') {
        //     return to_route('audio.list')->with('message', __('You cannot edit the video'));
        // }

        // Ensure the user has permission to edit the audio
        Gate::authorize('channel-settings');

        // Define the directory where audio files are stored
        $imageDirectory = public_path('audio');
        $availableAudio = \Illuminate\Support\Facades\File::files($imageDirectory);

        $fileNames = collect(\Illuminate\Support\Facades\File::files(public_path('audio')))
        ->map(fn($file) => ['label' => $file->getFilename(), 'value' => $file->getFilename()])
        ->all();
    
        $tags = Tag::orderBy('name', 'asc')->get()->map(fn($t) => ['label' => $t->name, 'value' => $t->name])->all();
        $models = Models::orderBy('id', 'desc')->get()->map(fn($m) => ['label' => $m->name, 'value' => $m->id])->all();
        $categories = VideoCategories::orderBy('category')->get()->map(fn($c) => ['label' => $c->category, 'value' => $c->id])->all();

        $selectedCategoryIds = !empty($audio->category_id) ? explode(',', $audio->category_id) : [];
        $selectedModelIds = !empty($audio->model_id) ? explode(',', $audio->model_id) : [];
        $selectedTagNames = !empty($audio->tags) ? explode(',', $audio->tags) : [];

        $supportedLocales = getSupportedLocales();

        // $decodedTitle = json_decode($audio->title, true) ?? [];
        // $audio->title_en = $decodedTitle['en'] ?? '';
        // $audio->selectedLang = $audio->title_lang ?? '';
        // $audio->title_lang_val = $audio->selectedLang && isset($decodedTitle[$audio->selectedLang])
        //     ? $decodedTitle[$audio->selectedLang]
        //     : '';

        // // Decode description JSON
        // $decodedDescription = json_decode($audio->description, true) ?? [];
        // $audio->description_en = $decodedDescription['en'] ?? '';
        // $audio->selectedDescriptionLang = $audio->description_lang ?? '';
        // $audio->description_lang_val = $audio->selectedDescriptionLang && isset($decodedDescription[$audio->selectedDescriptionLang])
        //     ? $decodedDescription[$audio->selectedDescriptionLang]
        //     : '';

        $ogValue = new \stdClass();
        $ogValue->title = json_decode($audio->getRawOriginal('title'));
        $ogValue->description = json_decode($audio->getRawOriginal('description'));
        $ogValue->description_lang = $audio->description_lang;
        $ogValue->title_lang = $audio->title_lang;
        // dd(gettype($ogValue), $ogValue, $audio);

        if ($ogValue->title_lang === null || trim($ogValue->title_lang) === "") {
            // $video->title_lang = "de";
            $ogValue->title_lang = "de";
        }

        if ($ogValue->description_lang === null || trim($ogValue->description_lang) === "") {
            $ogValue->description_lang = "de";
            // $video->description_lang = "de";
        }
        // dd($ogValue->title_lang, $ogValue->description_lang, $ogValue, $ogValue);
        return Inertia::render('Videos/Partials/UploadAudio', compact('audio', 'ogValue', 'categories', 'fileNames', 'tags', 'models', 'supportedLocales',
        'selectedCategoryIds', 'selectedModelIds', 'selectedTagNames'));
    }

    public function updateAudio(Audio $audio, Request $request)
    {
        // dd($audio, $request->all(), "update Audio fuinction");
        $disk = env('FILESYSTEM_DISK', 'public');
        $ebookPath = null;

        Gate::authorize('channel-settings');

        $request->validate([
            // 'title' => 'required|min:2',
            'title_en' => 'required|min:2',
            'title_lang_val' => 'required|min:2',
            'price' => 'required|numeric',
            'free_for_subs' => 'required|in:yes,no',
            'category_id.*' => 'required',
        ]);

        // if ($request->user()->id !== $audio->user_id) {
        //     abort(403, __("You do not seem to be the owner of this video"));
        // }

        if ($request->filled('audio_file_input')) {
            $audio->audio = $request->audio_file_input;
            $audio->save();
        }

        // resize & upload thumbnail
        if ($request->hasFile('thumbnail')) {
            $thumbnail = Image::make($request->file('thumbnail'))->fit(640, 320)->stream();
            $thumbFile = 'thumbnails/' . uniqid() . '-' . auth()->id() . '.' . $request->file('thumbnail')->getClientOriginalExtension();

            Storage::disk(env('FILESYSTEM_DISK'))->put($thumbFile, $thumbnail);
            Storage::disk(env('FILESYSTEM_DISK'))->setVisibility($thumbFile, 'public');

            $audio->thumbnail = $thumbFile;
            $audio->save();
        }

        // Ebook file upload (if not from FTP)
        if ($request->hasFile('audio_file_input')) {
            $ebookFile = $request->file('audio_file_input');
            $ebookFileName = 'audio/' . uniqid() . '-' . Auth::user()->id . '.' . $ebookFile->getClientOriginalExtension();
            Storage::disk($disk)->put($ebookFileName, file_get_contents($ebookFile->getRealPath()));
            Storage::disk($disk)->setVisibility($ebookFileName, 'public');
            $ebookPath = $ebookFileName;
            // dd("if",$ebookPath);
        } else {
            $ebookPath = $audio->audio_file;
            // dd("else", $audio->audio_file, $ebookPath);
        }

        // dd($ebookPath);

        $titleFromDb = is_string($audio->title) ? json_decode($audio->title, true) : $audio->title;
        // Ab yeh pakka hai ki `$titleArray` ek array hi hai.
        $titleArray = $titleFromDb ?? ['en' => ''];
        $titleArray['en'] = $request->title_en;
        if (!empty($request->title_lang) && !empty($request->title_lang_val)) {
            $titleArray[$request->title_lang] = $request->title_lang_val;
        }

        // Description ke liye (bilkul waisa hi)
        $descriptionFromDb = is_string($audio->description) ? json_decode($audio->description, true) : $audio->description;
        $descriptionArray = $descriptionFromDb ?? ['en' => ''];
        $descriptionArray['en'] = $request->description_en;
        if (!empty($request->description_lang) && !empty($request->description_lang_val)) {
            $descriptionArray[$request->description_lang] = $request->description_lang_val;
        }

        // create video entry
        $audio->update([
            'title' => $titleArray,
            'title_lang' => $request->title_lang,
            'title_en' => $request->title_en,
            'slug' => Str::slug($request->title_en),
            'price' => $request->price,
            'free_for_subs' => $request->free_for_subs,
            'audio_file' => $ebookPath,
            'audio' => $ebookPath,
            'disk' => env('FILESYSTEM_DISK'),
            'category_id' => is_array($request->category_id) ? implode(',', $request->category_id) : $audio->category_id,
            'model_id' => is_array($request->model_id) ? implode(',', $request->model_id) : $audio->model_id,
            'is_from_ftp' => $request->is_from_ftp == '1' ? true : false,
            'tags' => is_array($request->tag) ? implode(',', $request->tag) : implode(',', $audio->tag),
            'description' => $descriptionArray,
            'description_lang' => $request->description_lang,
        ]);

        return back()->with('message', __('Audio successfully updated'));
    }

    public function saveAudio(Request $request)
    {
        // dd($request->all(), "update Audio fuinction");
        $thumbFile = null;
        $disk = env('FILESYSTEM_DISK', 'public');
        $ebookPath = null;

        Gate::authorize('channel-settings');
        $request->validate([
            //            'title' => 'required|min:2',
            'title_en' => 'required|min:2',
            'title_lang_val' => 'required|min:2',
            'price' => 'required|numeric',
            'free_for_subs' => 'required|in:yes,no',
            'thumbnail' => 'required|mimes:png,jpg',
            //'video_file' => 'required',
            'category_id' => 'required|array', // Ensure it's an array
            //            'category_id.*' => 'required|integer|exists:categories,id', // Validate each element of the array
            //            'model_id' => 'required|exists:models,id',
            'description_en' => 'required',
            'description_lang_val' => 'required',
            'tag.*' => 'required',
        ]);

        // resize & upload thumbnail
        $thumbnail = Image::make($request->file('thumbnail'))->fit(640, 320)->stream();
        $thumbFile = 'thumbnails/' . uniqid() . '-' . auth()->id() . '.' . $request->file('thumbnail')->getClientOriginalExtension();
        Storage::disk(env('FILESYSTEM_DISK'))->put($thumbFile, $thumbnail);
        Storage::disk(env('FILESYSTEM_DISK'))->setVisibility($thumbFile, 'public');

        $titleArray = ['en' => $request->title_en];
        if (!empty($request->title_lang) && !empty($request->title_lang_val)) {
            $titleArray[$request->title_lang] = $request->title_lang_val;
        }

        $descriptionArray = ['en' => $request->description_en];
        if (!empty($request->description_lang) && !empty($request->description_lang_val)) {
            $descriptionArray[$request->description_lang] = $request->description_lang_val;
        }

        // Ebook file upload (if not from FTP)
        if ($request->hasFile('audio_file_input')) {
            $ebookFile = $request->file('audio_file_input');
            $ebookFileName = 'audio/' . uniqid() . '-' . Auth::user()->id . '.' . $ebookFile->getClientOriginalExtension();
            Storage::disk($disk)->put($ebookFileName, file_get_contents($ebookFile->getRealPath()));
            Storage::disk($disk)->setVisibility($ebookFileName, 'public');
            $ebookPath = $ebookFileName;
        } elseif ($request->is_from_ftp && $request->filled('ebook_file_ftp')) {
            $ebookPath = 'audio/' . $request->ebook_file_ftp;
        }
        // dd($ebookPath, $thumbFile, $request->all(), "update Audio fuinction");

        // create video entry
        $request->user()->audio()->create([
            'title' => $titleArray,
            'title_lang' => $request->title_lang,
            'title_en' => $request->title_en,
            'price' => $request->price,
            'slug' => Str::slug($request->title_en),
            //            'free_for_subs' => $request->free_for_subs,
            'free_for_subs' => 'yes',
            'thumbnail' => $thumbFile,
            'audio_file' => $ebookPath,
            'audio' => $ebookPath,
            'disk' => env('FILESYSTEM_DISK'),
            'category_id' => is_array($request->category_id) ? implode(',', $request->category_id) : (string)$request->category_id,
            'model_id' => $request->model_id ? (is_array($request->model_id) ? implode(',', $request->model_id) : (string)$request->model_id) : null,
            'is_from_ftp' => $request->is_from_ftp == '1' ? true : false,
            'tags' => is_array($request->tag) ? implode(',', $request->tag) : (string)$request->tag,
            'description' => $descriptionArray,
            'description_lang' => $request->description_lang,
            'seo' => $request->has('seo') ? json_encode($request->seo) : null,
            'views' => Audio::RandomViews(),
        ]);

        return to_route('audio.list')->with('message', __('Audio successfully uploaded'));
    }

    public function uploadChunkedAudio(Request $request)
    {
        $file = $request->file;
        $is_last = $request->is_last;

        // temp chunks path
        $path = Storage::disk('public')->path("audio/{$file->getClientOriginalName()}");

        // filename without .part in it
        $withoutPart = basename($path, '.part');

        // set file name inside path without .part
        $renamePath = public_path('audio/' . $withoutPart);

        // set allowed extensions
        $allowedExt = ['mp3', 'ogg', 'mpeg'];
        $fileExt = explode('.', $withoutPart);
        $fileExt = end($fileExt);
        $fileExt = strtolower($fileExt);

        // preliminary: validate allowed extensions
        // we're validating true mime later, but just to avoid the effort if fails from the begining
        if (!in_array($fileExt, $allowedExt)) {
            Storage::disk('public')->delete($renamePath);
            throw new \Exception('Invalid extension');
        }

        // build allowed mimes
        $allowedMimes = [
            'audio/mp3',
            'audio/ogg',
            'audio/mpeg',
        ];

        // append chunk to the file
        FileFacade::append($path, $file->get());

        // finally, let's make the file complete
        if ($is_last == "true") {
            // rename the file to original name
            FileFacade::move($path, $renamePath);

            // set a ref to local file
            $localFile = new File($renamePath);

            try {
                // first, lets get the mime type
                $finfo = new \finfo();
                $mime = $finfo->file($renamePath, FILEINFO_MIME_TYPE);
            } catch (\Exception $e) {
                $mime = null;
            }

            // validate allowed mimes
            if ($mime) {
                if (!in_array($mime, $allowedMimes) && $mime != 'application/octet-stream') {
                    throw new \Exception('Invalid file type: ' . $mime);
                }

                // this is from chunks, keep it as it passed the other validation
                if ($mime == 'application/octet-stream') {
                    $mime = 'audio';
                }
            } else {
                $mime = 'audio';
            }

            // set file destination
            if ($request->has('from') && $request->from = 'short-audio') {
                $fileDestination = 'short-audio';
            } else {
                $fileDestination = 'audio';
            }

            $fileName = Storage::disk(env('FILESYSTEM_DISK'))->putFile($fileDestination, $localFile, 'public');

            FileFacade::delete($renamePath);
            return response()->json(['result' => $fileName]);
        }
    }

    public function uploadChunkedEbook(Request $request)
    {
        $file = $request->file;
        $is_last = $request->is_last;

        // temp chunks path
        $path = Storage::disk('public')->path("ebook/{$file->getClientOriginalName()}");

        // filename without .part in it
        $withoutPart = basename($path, '.part');

        // set file name inside path without .part
        $renamePath = public_path('ebook/' . $withoutPart);

        // set allowed extensions
        $allowedExt = ['pdf', 'txt', 'docx', 'doc'];
        $fileExt = explode('.', $withoutPart);
        $fileExt = end($fileExt);
        $fileExt = strtolower($fileExt);

        // preliminary: validate allowed extensions
        // we're validating true mime later, but just to avoid the effort if fails from the begining
        if (!in_array($fileExt, $allowedExt)) {
            Storage::disk('public')->delete($renamePath);
            throw new \Exception('Invalid extension');
        }

        // build allowed mimes
        $allowedMimes = [
            // 'ebook/mp3',
            // 'ebook/ogg',
            // 'ebook/mpeg',
            'application/pdf',
            'text/plain',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];

        // append chunk to the file
        FileFacade::append($path, $file->get());

        // finally, let's make the file complete
        if ($is_last == "true") {
            // rename the file to original name
            FileFacade::move($path, $renamePath);

            // set a ref to local file
            $localFile = new File($renamePath);

            try {
                // first, lets get the mime type
                $finfo = new \finfo();
                $mime = $finfo->file($renamePath, FILEINFO_MIME_TYPE);
            } catch (\Exception $e) {
                $mime = null;
            }

            // validate allowed mimes
            if ($mime) {
                if (!in_array($mime, $allowedMimes) && $mime != 'application/octet-stream') {
                    throw new \Exception('Invalid file type: ' . $mime);
                }

                // this is from chunks, keep it as it passed the other validation
                if ($mime == 'application/octet-stream') {
                    $mime = 'ebook';
                }
            } else {
                $mime = 'ebook';
            }

            // set file destination
            if ($request->has('from') && $request->from = 'short-ebook') {
                $fileDestination = 'short-ebook';
            } else {
                $fileDestination = 'ebook';
            }

            $fileName = Storage::disk(env('FILESYSTEM_DISK'))->putFile($fileDestination, $localFile, 'public');

            FileFacade::delete($renamePath);
            return response()->json(['result' => $fileName]);
        }
    }

    public function deleteAudio(Request $request)
    {
        Gate::authorize('channel-settings');
        $audio = $request->user()->audio()->findOrFail($request->audio);
        if ($audio->audio) {
            Storage::disk($audio->disk)->delete($audio->audio);
        }
        if ($audio->thumbnail) {
            Storage::disk($audio->disk)->delete($audio->thumbnail);
        }
        $audio->delete();
        return back()->with('message', __('Audio removed'));
    }

    public function browseAudio(VideoCategories $videocategory = null, string $slug = null)
    {
        $event = new ConversationEvent(request()->get('conversions_tracking', ''));
        $event->callApi('site');

        $request = request();
        $randomaudio = [];
        $userrequest = [];
        $userrequest['page'] = $request->get("page", 1);
        if (!$videocategory) {
            $randomaudio = (array)Audio::with(['streamer'])->inRandomOrder()->paginate(16)->toArray();
            //dd($randomaudio);
            $audio = Audio::with(['streamer']);
            $textFile = TextFile::with(['streamer']);
            $gallery = Gallery::with(['streamer']);
            //$gallery = Gallery::get();


            //            $audio = Video::with(['category', 'streamer']);
            //            $audio = Video::with(['streamer']);
            //             $audio = Audio::with(['streamer'])->inRandomOrder()->limit(8)->get();
            // $textFile = TextFile::inRandomOrder()->limit(8)->get();
            // $gallery = Gallery::inRandomOrder()->limit(8)->get();
            // $combinedData = $audio->merge($textFile)->merge($gallery);

            // $shuffledData = $combinedData->shuffle();
            // $randomaudio = $shuffledData->toArray();
        } else {
            $audio = $videocategory->audio()->with(['streamer']);
            $textFile = $videocategory->textFile()->with(['streamer']);
            $gallery = $videocategory->gallery()->with(['streamer']);
            //$gallery = $videocategory->gallery();

            //            $audio = $videocategory->audio()->with(['streamer']);
        }

        $userrequest['sort'] = $request->get('sort', 'Recently', 'pictures');

        switch ($request->sort) {
            case 'Most':
                $audio = $audio->orderByDesc('views');
                break;

            case 'Recently':
                $audio = $audio->orderByDesc('id');
                break;


            case 'Older':
                $audio = $audio->orderBy('created_at');
                break;

            case 'Highest':
                $audio = $audio->orderByDesc('price');
                break;

            case 'Lowest':
                $audio = $audio->orderBy('price');
                break;

            case 'Only Free':
                $audio = $audio->where('price', 0)->orderByDesc('views');
                break;
            case 'Latest':

            case 'toy':
                $audio = $audio->orderByDesc('id');
                break;

            case 'Ebook':
                $audio = $audio->orderByDesc('id');
                break;

            case 'audio_file':
                $audio = $audio->orderBy('title', 'asc');
                break;

            case 'text_file':
                $audio = $textFile->orderByDesc('id');
                break;

            case 'phone_sex':
                $audio = $audio->orderByDesc('id');
                break;

            case 'real_session':
                $audio = $audio->orderByDesc('id');
                break;

            case 'live_streaming':
                $audio = $audio->orderByDesc('id');
                break;

            case 'weared_clothes':
                $audio = $audio->orderByDesc('id');
                break;

            case 'pictures':
                $audio = $gallery->orderByDesc('id');
                break;

            default:
                $audio = $audio->orderByDesc('id');
                break;
        }

        // if keyword
        if ($request->filled('search')) {
            $userrequest['search'] = $request->search;

            $audio->where('title', 'LIKE', '%' . $request->search . '%');
        }


        // case categories
        $userrequest['selectedCategories'] = [];
        if ($request->filled('selectedCategories')) {
            $randomaudio = [];
            $userrequest['selectedCategories'] = $request->selectedCategories;
            //            dd($request->selectedCategories);
            $audio->where(function ($query) use ($request) {
                foreach ($request->selectedCategories as $key => $categoryId) {
                    if ($key == 0) {
                        $query->where('category_id', 'LIKE', "%{$categoryId}%");
                    } else {
                        $query->orWhere('category_id', 'LIKE', "%{$categoryId}%");
                    }
                }
            });

            //            $audio->whereHas('category', function ($query) use ($request) {
            //                $query->whereIn('category_id', $request->selectedCategories);
            //            });
        }

        // case tags
        $userrequest['selectedTags'] = [];
        if ($request->filled('selectedTags')) {
            $randomaudio = [];
            $userrequest['selectedTags'] = $request->selectedTags;
            foreach ($request->selectedTags as $key => $tag) {
                if ($key == 0) {
                    $audio->where('tags', 'LIKE', "%{$tag}%");
                } else {
                    $audio->orWhere('tags', 'LIKE', "%{$tag}%");
                }
            }
        }
        $userrequest['selectedModels'] = [];
        if ($request->filled('selectedModels')) {
            $randomaudio = [];
            $userrequest['selectedModels'] = $request->selectedModels;
            foreach ($request->selectedModels as $key => $model) {
                if ($key == 0) {
                    $audio->where('model_id', 'LIKE', "%{$model}%");
                } else {
                    $audio->orWhere('model_id', 'LIKE', "%{$model}%");
                }
            }

            //            $audio->whereIn('model_id', $request->selectedModels);

        }


        // fetch audio
        $audio = $audio->paginate(28)->appends($request->query())->toArray();

        // the image
        $exploreImage = asset('images/browse-videos-icon.png');

        // all video categories
        $categories = VideoCategories::orderBy('category')->get();

        // assing to simple category
        $category = $videocategory;

        $tags = Tag::orderBy('name')->get();

        $models = Models::orderBy('name')->get();

        $blocks = AdBlock::all();
        // render the view

        $headTitle = $request->route()->getName() == 'home' ? 'FetishMegaStore' : 'Browse Audio';

        $recommendedAudioId = RecommendedVideo::pluck('video_id')->toArray();

        $recommendedAudio = audio::with(['streamer'])->whereIn('id', $recommendedAudioId)->paginate(16);

        return Inertia::render('Videos/BrowseAudio', compact('userrequest', 'randomaudio', 'recommendedAudio', 'audio', 'category', 'exploreImage', 'categories', 'tags', 'models', 'blocks', 'headTitle'));
    }

    public function singleAudioPage($id)
    {
        $request = request();
        $audio = Audio::with('streamer')->where('slug', $id)->firstOrFail(); // Use `firstOrFail` for better error handling

        // Populate duration and tags
        $audio->duration = $audio->getDurationAttribute();
        $tags = is_array($audio->tags) ? $audio->tags : [];
        $audiotags = [];

        foreach ($tags as $tag) {
            $item = Tag::where('name', 'LIKE', "%{$tag}%")->first();
            if ($item) {
                $audiotags[] = [
                    "id" => $item->id,
                    "name" => $tag,
                ];
            }
        }

        $audio->tags = $audiotags;

        // Fetch related audio
        $relatedaudio = Audio::where(function ($query) use ($audiotags) {
            foreach ($audiotags as $tag) {
                $query->orWhere('tags', 'LIKE', "%{$tag['name']}%");
            }
        })->paginate(8)->appends($request->query());

        // Handle pagination and return response
        $url = $request->url();

        if ($request->has('page') && $request->page > 1) {
            return $relatedaudio;
        }

        $audio->canDownload = $audio->canBePlayed;

        // dd($audio, $audio->views);
        return Inertia::render('Videos/SingleAudioNew', compact('audio', 'relatedaudio', 'url'));
    }

    public function downloadAudio(Request $request, Audio $audio)
    {
        if (!$audio->canBePlayed) {
            abort(403, 'You do not have permission to download this file.');
        }

        $filePath = $audio->audio_file;
        $disk = $audio->disk ?? env('FILESYSTEM_DISK');

        if (!Storage::disk($disk)->exists($filePath)) {
            abort(404, 'File not found.');
        }

        $fileName = $audio->slug . '.mp3';

        return Storage::disk($disk)->download($filePath, $fileName);
    }

    public function myAudio(Request $request)
    {
        $audio = $request->user()
            ->purchasedAudio()
            ->with('streamer');

        if ($request->has('search_term')) {
            $audio->where('title', 'LIKE', '%' . $request->search_term . '%');
        }

        $audio = $audio->paginate(4);
        // dd($audio);

        return Inertia::render('Videos/OrderedAudio', compact('audio'));
    }

    public function unlockAudio(Audio $audio, Request $request)
    {
        $audio->load('streamer');

        if ($audio->canBePlayed) {
            return back()->with('message', __('You already have access to this audio'));
        }

        // dd($audio);
        return Inertia::render('Audio/Unlock', compact('audio'));
    }

    public function purchaseAudio(Audio $audio, Request $request)
    {
        // check if user already bought
        if ($audio->canBePlayed) {
            return back()->with('message', __('You already have access to this audio'));
        }

        $buyer = $request->user();
        affilaiteCommissionGenrate($buyer, $audio);
        // record order
        $audioSale = new AudioSales();
        $audioSale->audio_id = $audio->id;
        $audioSale->streamer_id = $audio->user_id;
        $audioSale->user_id = $request->user()->id;
        $audioSale->price = $audio->price;
        // dd($audioSale, $audio);
        $audioSale->save();

        if ($audioSale) {
            $addpurchasehistory = new PurchaseHistory();
            $addpurchasehistory->type = 'audio';
            $addpurchasehistory->video_id = $audio->id;
            $addpurchasehistory->user_id = auth()->user()->id;
            $addpurchasehistory->ip = $request->ip();
            $addpurchasehistory->save();
        }

        // subtract from user balance
        $request->user()->decrement('tokens', $audio->price);

        // notify streamer of this sale (on platform)
        $audio->streamer->notify(new NewAudioSale($audioSale));

        Mail::to($request->user()->email)->send(new AudioPurchasedMail($audioSale));
        return redirect(route('audio.ordered'))->with('message', __("Thank you, you can now play the audio!"));
    }

    //blogs manager
    public function blogsManager(Request $request)
    {
        Gate::authorize('channel-settings');

        $blogs = Blog::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->paginate(9);

        return Inertia::render('Videos/BlogManager/Blogs', [
            'blogs' => $blogs,
        ]);
    }

    public function addBlogs()
    {
        Gate::authorize('channel-settings');

        $tags = Tag::orderBy('id', 'desc')
            ->get()
            ->map(fn($tag) => ['label' => $tag->name, 'value' => $tag->id]);

        $categories = VideoCategories::orderBy('category')
            ->get()
            ->map(fn($cat) => ['label' => $cat->category, 'value' => $cat->id]);

        $blog = [
            'id' => null,
            'title' => ['en' => '', 'de' => ''],
            'description' => ['en' => '', 'de' => ''],
            'category_id' => [],
            'tag_id' => [],
            'image' => [],
            'seo' => [
                'h2' => '',
                'keyword' => '',
                'meta_keyword' => '',
                'desc' => '',
                'de' => [
                    'h2' => '',
                    'keyword' => '',
                    'meta_keyword' => '',
                    'desc' => ''
                ],
                'og_title' => '',
                'og_desc' => '',
                'cust_url' => ''
            ]
        ];

        return Inertia::render('Videos/Partials/Blogs/AddBlogs', [
            'categories' => $categories,
            'tags' => $tags,
            'blogs' => $blog,
        ]);
    }

    public function blogSave(Request $request)
    {
        Gate::authorize('channel-settings');

        $request->validate([
            'title_en' => 'required|string|max:255',
            // 'title_de' => 'nullable|string|max:255',
            // 'description_en' => 'nullable|string',
            // 'description_de' => 'nullable|string',
            // 'image.*' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:5120',
            // 'category_id' => 'nullable|array',
            // 'tags' => 'nullable|array',
            // 'seo' => 'nullable|array',
        ]);

        try {
            $blog = new Blog();

            $blog->title = json_encode([
                'en' => $request->title_en,
                'de' => $request->title_de,
            ]);

            $blog->description = json_encode([
                'en' => $request->description_en,
                'de' => $request->description_de,
            ]);

            $blog->user_id = Auth::id();
            $blog->slug = Str::slug($request->title_en);
            $blog->category_id = $request->category_id ? implode(',', $request->category_id) : null;
            $blog->tag_id = $request->tag_id ? implode(',', $request->tag_id) : null;
 
            $disk = env('FILESYSTEM_DISK', 'public');
            $uploadedImages = [];

            if ($request->hasFile('image')) {
                $files = $request->file('image');
                if (!is_array($files)) {
                    $files = [$files];
                }
                foreach ($files as $key => $image) {
                    $ext = $image->getClientOriginalExtension();
                    $path = 'blog/' . uniqid() . '-' . $key . '.' . $ext;
                    $img = Image::make($image)->encode($ext);
                    Storage::disk($disk)->put($path, (string) $img);
                    Storage::disk($disk)->setVisibility($path, 'public');
                    $uploadedImages[] = $path;
                }
            }

            $blog->image = $uploadedImages ? implode(',', $uploadedImages) : null;
            $blog->seo = json_encode($request->seo ?? []);
            $blog->save();

            return redirect()->route('blogs.list')->with('message', __('Blog Added Successfully!'));
        } catch (Exception $exception) {
            Log::error($exception);
            return redirect()->route('blogs.list')->with('error', $exception->getMessage());
        }
    }

    public function blogsEdit($id)
    {
        Gate::authorize('channel-settings');

        $tags = Tag::orderBy('id', 'desc')->get()->map(fn($tag) => [
            'label' => $tag->name, 'value' => $tag->id
        ]);

        $categories = VideoCategories::orderBy('category')->get()->map(fn($cat) => [
            'label' => $cat->category, 'value' => $cat->id
        ]);

        $blog = Blog::findOrFail($id);

        $blogData = [
            'id' => $blog->id,
            'title' => json_decode($blog->getRawOriginal('title'), true) ?? ['en' => '', 'de' => ''],
            'description' => json_decode($blog->getRawOriginal('description'), true) ?? ['en' => '', 'de' => ''],
            'category_id' => $blog->category_id ? array_map('intval', explode(',', $blog->category_id)) : [],
            'tag_id' => $blog->tag_id ? array_map('intval', explode(',', $blog->tag_id)) : [],
            'images' => $blog->image ? explode(',', $blog->image) : [],
            'seo' => json_decode($blog->getRawOriginal('seo'), true) ?? [],
        ];

        return Inertia::render('Videos/Partials/Blogs/EditBlogs', [
            'categories' => $categories,
            'tags' => $tags,
            'blogs' => $blogData,
            'isEdit' => true
        ]);
    }

    public function blogsUpdate(Request $request, Blog $blog)
    {
        Gate::authorize('channel-settings');

        try {
            $existingImages = $blog->image ? explode(',', $blog->image) : [];

            // Append new images
            if ($request->hasFile('image')) {
                $disk = env('FILESYSTEM_DISK', 'public');
                $files = is_array($request->file('image')) ? $request->file('image') : [$request->file('image')];

                foreach ($files as $key => $image) {
                    $ext = $image->getClientOriginalExtension();
                    $path = 'blog/' . uniqid() . '-' . $key . '.' . $ext;
                    $img = Image::make($image)->encode($ext);
                    Storage::disk($disk)->put($path, (string) $img);
                    Storage::disk($disk)->setVisibility($path, 'public');
                    $existingImages[] = $path;
                }
            }

            // Update titles
            $title = json_decode($blog->getRawOriginal('title'), true) ?? ['en' => '', 'de' => ''];
            if ($request->has('title_en')) $title['en'] = $request->input('title_en');
            if ($request->has('title_de')) $title['de'] = $request->input('title_de');
            $blog->title = json_encode($title);

            // Update descriptions
            $description = json_decode($blog->getRawOriginal('description'), true) ?? ['en' => '', 'de' => ''];
            if ($request->has('description_en')) $description['en'] = $request->input('description_en');
            if ($request->has('description_de')) $description['de'] = $request->input('description_de');
            $blog->description = json_encode($description);

            // Slug
            $blog->slug = Str::slug($title['en']);
            $blog->user_id = Auth::id();

            // Categories & tags
            if ($request->has('category_id')) {
                $blog->category_id = implode(',', (array)$request->category_id);
            }
            if ($request->has('tag_id')) {
                $blog->tag_id = implode(',', (array)$request->tag_id);
            }

            // Images
            $blog->image = count($existingImages) ? implode(',', array_unique($existingImages)) : $blog->image;

            // SEO merge
            $currentSeo = json_decode($blog->getRawOriginal('seo'), true) ?? [];
            $newSeo = $request->input('seo', []);
            $blog->seo = json_encode(array_replace_recursive($currentSeo, $newSeo));

            $blog->save();

            return redirect()->route('blogs.list')->with('message', __('Blog Updated Successfully!'));
        } catch (\Exception $exception) {
            Log::error($exception);
            return redirect()->route('blogs.list')->with('error', $exception->getMessage());
        }
    }
    
    public function blogsDelete(Request $request)
    {
        Gate::authorize('channel-settings');

        $blog = Blog::findOrFail($request->blog);
        $disk = env('FILESYSTEM_DISK', 'public');

        if (!empty($blog->image)) {
            foreach (explode(',', $blog->image) as $imagePath) {
                if (Storage::disk($disk)->exists($imagePath)) {
                    Storage::disk($disk)->delete($imagePath);
                }
            }
        }

        $blog->delete();

        return redirect()->route('blogs.list')->with('message', __('Blog Deleted Successfully!'));
    }

    public function displayUserGuidePage(Request $request)
    {
        $page = Page::where('page_slug', 'guide')->firstOrFail();
        return Inertia::render('UserGuide', compact('page'));
    }
}