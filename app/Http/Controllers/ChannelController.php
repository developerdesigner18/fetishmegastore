<?php

namespace App\Http\Controllers;

use App\Events\LiveStreamBan;
use App\Http\Requests\ChannelSettingsRequest;
use App\Models\Models;
use App\Models\RoomBans;
use App\Models\ShortVideo;
use App\Models\Subscription;
use App\Models\Tag;
use App\Models\User;
use App\Models\UserMeta;
use App\Models\Video;
use App\Models\VideoCategories;
use App\Rules\UniqueUsername;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Illuminate\Support\Facades\Gate;
use Image;
use Illuminate\Support\Str;
use function PHPUnit\Framework\stringEndsWith;

class ChannelController extends Controller
{
    // midleware
    public function __construct()
    {
        // $this->middleware('auth');
    }

    // search channel
    public function search(Request $request)
    {
        $request->validate(['term' => 'required|min:2']);

        return User::isStreamer()
            ->where('username', 'like', '%' . $request->term . '%')
            ->where('name', 'like', '%' . $request->term . '%')
            ->take(40)
            ->get();
    }

    // live stream
    public function liveStream($user, Request $r)
    {

        
        // get the stream user
        $streamUser = User::whereUsername($user)
            ->withCount(['followers', 'subscribers', 'videos'])
            ->firstOrFail();

        $streamUser->increment('popularity');

        // check this user (if authenticated) is banned form this room
        if (auth()->check()) {
            $isBanned = $r->user()->bannedFromRooms()->where('streamer_id', $streamUser->id)->exists();
            if ($isBanned) {
                return to_route('channel.bannedFromRoom', ['user' => $streamUser->username]);
            }
        }

        // check if this ip is banned from this room
        $isBannedFromRoom = RoomBans::where('ip', $r->ip())->exists();
        if ($isBannedFromRoom) {
            return to_route('channel.bannedFromRoom', ['user' => $streamUser->username]);
        }

        // if authenticated user == streamuser
        $isChannelOwner = false;

        if (auth()->check() && $streamUser->username === request()->user()->username) {
            $isChannelOwner = true;
        }

        // check if it follows channel
        $userFollowsChannel = false;
        if (auth()->check() && auth()->user()->isFollowing($streamUser)) {
            $userFollowsChannel = true;
        }

        // check if has subscription
        $userIsSubscribed = false;
        if (auth()->check() && auth()->user()->hasSubscriptionTo($streamUser)) {
            $userIsSubscribed = true;
        }

        // room name
        if (user_meta('streaming_key', true, $streamUser->id)) {
            $roomName = user_meta('streaming_key', true, $streamUser->id);
        } else {
            $roomName = $streamUser->id . '.' . Str::random(16);
            set_user_meta('streaming_key', $roomName, true, $streamUser->id);
        }

        return Inertia::render('Channel/LiveStream', compact('isChannelOwner', 'streamUser', 'userFollowsChannel', 'userIsSubscribed', 'roomName'));
    }

    // start stream
    public function userProfile($user)
    {  
        
        
        // get the stream user
        $streamUser = User::whereUsername($user)
            ->withCount(['followers', 'subscribers', 'videos'])
            ->first();

            // dd($streamUser);

        if(!$streamUser){
            return to_route('channels.browse');
        }

        $streamUser->about = nl2br($streamUser->about);

        // increase popularity
        $streamUser->increment('popularity');

        // get authenticated user
        $user = auth()->user();

        // if authenticated user == streamuser, show start stream
        $isChannelOwner = false;

        if (auth()->check() && $streamUser->username === $user->username) {
            $isChannelOwner = true;
        }

        // check if it follows channel
        $userFollowsChannel = false;
        if (auth()->check() && auth()->user()->isFollowing($streamUser)) {
            $userFollowsChannel = true;
        }

        // check if has subscription
        $userIsSubscribed = false;
        if (auth()->check() && auth()->user()->hasSubscriptionTo($streamUser)) {
            $userIsSubscribed = true;
        }


        /* $subscriptions = Subscription::where('streamer_id', $streamUser->id)
                        ->where('subscriber_id', auth()->user()->id)
                        ->where('subscription_expires', '>=', Carbon::now()) 
                        ->where('status', '!=', 'Pending')
                        ->first();
                        //prd($subscriptions);
            if(!empty($subscriptions)){
                $userIsSubscribed = true;
            } */
        // build opengraph tags
        $ogTags = [
            'title' => __(":channelName's channel (:handle)", ['channelName' => $streamUser->name, 'handle' => '@' . $streamUser->username]),
            'url' => route('channel', ['user' => $streamUser->username]),
            'image' => $streamUser->cover_picture
        ];


        $totalVideos = $streamUser->videos()->count();

//        //        dd($streamUser->videos()->get());
//        $channleVideoCategoryIds = $streamUser->videos()->get()->map(function ($videoDetails) {
//            return $videoDetails->category_id;
//        })->flatten()->unique()->values()->toArray();
//
//        $videoCategories = VideoCategories::select('slug', 'category')->whereIn('id', $channleVideoCategoryIds)->get()->map(function ($categoryDetails) {
//            return [
//                $categoryDetails->slug => $categoryDetails->category
//            ];
//        });
//
//        $channleVideoTagIds = $streamUser->videos()->get()->map(function ($videoDetails) {
//            return $videoDetails->tags;
//        })->flatten()->unique()->values()->toArray();
//
//
//        $videoTags = Tag::select('slug', 'name')
//            ->where(function ($query) use ($channleVideoTagIds) {
//                foreach ($channleVideoTagIds as $term) {
//                    $query->orWhereRaw("JSON_UNQUOTE(JSON_EXTRACT(name, '$.en')) = ?", [$term])
//                        ->orWhereRaw("JSON_UNQUOTE(JSON_EXTRACT(name, '$.de')) = ?", [$term]);
//                }
//            })
//            ->get()
//            ->map(function ($categoryDetails) {
//                return [
//                    $categoryDetails->slug => $categoryDetails->name
//                ];
//            });

        $isLoggedIn = auth()->check();
        $userLoginID = auth()->id() ?? false;
        return Inertia::render('Channel/User', compact('user', 'isChannelOwner', 'streamUser', 'userFollowsChannel', 'userIsSubscribed', 'ogTags', 'totalVideos', 'isLoggedIn', 'userLoginID'));
    }

    // channel settings
    public function channelSettings()
    {

        Gate::authorize('channel-settings');

        return Inertia::render('Channel/Settings');
    }

    // update channel settings
//    public function updateChannelSettings(ChannelSettingsRequest $request)
    public function updateChannelSettings(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => [
                'required', 'regex:/^[\w-]*$/',
                new UniqueUsername(),
            ],
//            'category' => 'required|exists:categories,id',
            'profilePicture' => ['image', 'mimes:jpg,jpeg,png'],
            'coverPicture' => ['image', 'mimes:jpg,jpeg,png'],
        ]);


        if ($validator->fails()) {
            return response()->json(['status' => 0, 'message' => $validator->errors()->first()]);
        }


        Gate::authorize('channel-settings');

        // user
        $user = $request->user();

        // save details to database
        $user->about = $request->about;
        $user->username = $request->username;
        $user->headline = $request->headline;
        $user->save();

        // save category
        if ($request->category) {
            $user->categories()->detach();
            $user->categories()->attach($request->category);
        }

        // save profile picture if needed
        if ($request->hasFile('profilePicture')) {
            $profilePicture = Image::make($request->file('profilePicture'));
            $picturePath = 'profilePics/' . $request->user()->id . '-' . uniqid() . '.' . $request->file('profilePicture')->getClientOriginalExtension();

            $profilePicture->fit(80, 80, function ($constrain) {
                $constrain->upsize();
            })->save(public_path($picturePath), 100);

            $user->profile_picture = $picturePath;
            $user->save();
        }

        // save cover picture if needed
        if ($request->hasFile('coverPicture')) {

            $coverPicture = Image::make($request->file('coverPicture'));
            $picturePath = 'coverPics/' . $request->user()->id . '-' . uniqid() . '.' . $request->file('coverPicture')->getClientOriginalExtension();
            $coverPicture->resize(1024, null, function ($constraint) {
                $constraint->aspectRatio();
            })->save(public_path($picturePath), 100);
            /*  $coverPicture->fit(960, 280, function ($constrain) {
                  $constrain->upsize();
              })->save(public_path($picturePath), 100);*/

            $user->cover_picture = $picturePath;
            $user->save();
        }

        if ($request->input('fb_link')) {
            UserMeta::updateOrCreate(['user_id' => auth()->user()->id, 'meta_key' => 'fb_link'], ['meta_value' => $request->input('fb_link')]);
        }

        if ($request->input('wb_link')) {
            UserMeta::updateOrCreate(['user_id' => auth()->user()->id, 'meta_key' => 'wb_link'], ['meta_value' => $request->input('wb_link')]);
        }

        if ($request->input('x_link')) {
            UserMeta::updateOrCreate(['user_id' => auth()->user()->id, 'meta_key' => 'x_link'], ['meta_value' => $request->input('x_link')]);
        }

        if ($request->input('insta_link')) {
            UserMeta::updateOrCreate(['user_id' => auth()->user()->id, 'meta_key' => 'insta_link'], ['meta_value' => $request->input('insta_link')]);
        }

        if ($request->input('telegram')) {
            UserMeta::updateOrCreate(['user_id' => auth()->user()->id, 'meta_key' => 'telegram'], ['meta_value' => $request->input('telegram')]);
        }

        if ($request->input('skype')) {
            UserMeta::updateOrCreate(['user_id' => auth()->user()->id, 'meta_key' => 'skype'], ['meta_value' => $request->input('skype')]);
        }

        if ($request->input('paxum_email')) {
            UserMeta::updateOrCreate(['user_id' => auth()->user()->id, 'meta_key' => 'paxum_email'], ['meta_value' => $request->input('paxum_email')]);
        }


        return back()->with('message', __("Profile updated"));
    }

    // followers
    public function followers($user, Request $request)
    {
        Gate::authorize('channel-settings');

        $followers = $request->user()->followers;

        return Inertia::render('Channel/Followers', compact('followers'));
    }

    // tiers
    public function getTiers(User $user)
    {
        return $user->tiers;
    }

    // videos
//    public function channelVideos(Request $request, User $user)
//    {
//        $videos = $user->videos()
//            ->with('streamer')
//            ->where('price', '>=', 0)
//            ->get(); // Get all videos first
//
//        $shuffledVideos = $videos->shuffle();
//
//        return $shuffledVideos->forPage($request->query('page', 1), 40)->values();
//    }

//AJ FUNCTION
    public function channelVideos(Request $request, User $user)
    {
        //        $user->videos()->where('price', '>=', 0)->with('streamer')->inRandomOrder()->paginate(40)

        $shortVideo = ShortVideo::with(['streamer'])->where('user_id', $user->id)
            ->where('type', 'short-video')
            ->where(function ($q) {
                $q->where('price', 0)->orWhereNull('price');
            })
            ->inRandomOrder()
            ->paginate(12);


        $freeVideos = Video::where('user_id', $user->id)->where(function ($q) {
            $q->where('price', 0)
                ->orWhereNull('price');
        })
            ->with(['streamer']);


        $paidVideos = Video::where('user_id', $user->id)->where('price', '>', 0)
            ->with(['streamer']);




        $sort = $request->sort ?? 'Latest';
        switch ($sort) {
            case 'Most':
                $freeVideos->orderByDesc('views');
                $paidVideos->orderByDesc('views');
                break;
            case 'Recently':
                $freeVideos->orderByDesc('id');
                $paidVideos->orderByDesc('id');
                break;
            case 'Older':
                $freeVideos->orderBy('created_at');
                $paidVideos->orderBy('created_at');
                break;
            case 'Highest':
                $freeVideos->orderByDesc('price');
                $paidVideos->orderByDesc('price');
                break;
            case 'Lowest':
                $freeVideos->orderBy('price');
                $paidVideos->orderBy('price');
                break;
            case 'Only Free':
                $paidVideos->where('price', 0);
                break;
            case 'Latest':
            default:
                $freeVideos->orderByDesc('id');
                $paidVideos->orderByDesc('id');
                break;
        }


        $freeVideos = $freeVideos ->inRandomOrder()
            ->take(6)
            ->get();

        $paidVideos = $paidVideos->inRandomOrder()
            ->paginate(6);

        // Merge paginated items properly
        $mergedResults = $freeVideos->merge($paidVideos->items())->merge($shortVideo->items())->shuffle();

        // Create custom pagination
        $paginatedResults = new \Illuminate\Pagination\LengthAwarePaginator(
            $mergedResults->forPage(1, 6), // Get first 6 items for the page
            count($mergedResults), // Total merged count
            6, // Items per page
            request()->get('page', 1), // Get current page from request
            ['path' => \Illuminate\Pagination\Paginator::resolveCurrentPath()]
        );

        $videos = $paginatedResults->toArray();
        //        $videos = $mergedResults;

        $data = $videos;

        return $data;
    }


    // audio
    public function channelAudio(Request $request, User $user)
    {
        return $user->audio()->with('streamer')->inRandomOrder()->paginate(40);
    }

    // ebook
    public function channelEbook(Request $request, User $user)
    {
        return $user->ebooks()->with('streamer')->inRandomOrder()->paginate(40);
    }

    public function channelModels(Request $request, User $user)
    {
//        return $user->videos()->with('streamer')->inRandomOrder()->paginate(40);

        $channleVideoModelIds = $user->videos()->get()->map(function ($videoDetails) {
            return $videoDetails->model_id;
        })->flatten()->unique()->values()->toArray();

        $models = Models::whereIn('id', $channleVideoModelIds)->inRandomOrder()->paginate(40);

        return $models;
    }

    public function channelCategories(Request $request, User $user)
    {
        //        dd($streamUser->videos()->get());
        $channleVideoCategoryIds = $user->videos()->get()->map(function ($videoDetails) {
            return $videoDetails->category_id;
        })->flatten()->unique()->values()->toArray();

        $videoCategories = VideoCategories::whereIn('id', $channleVideoCategoryIds)->paginate(6)->appends($request->query());

        return $videoCategories;

    }

    public function channelTags(Request $request, User $user)
    {
        $channleVideoTagIds = $user->videos()->get()->map(function ($videoDetails) {
            return $videoDetails->tags;
        })->flatten()->unique()->values()->toArray();


        $videoTags = Tag::where(function ($query) use ($channleVideoTagIds) {
            foreach ($channleVideoTagIds as $term) {
                $query->orWhereRaw("JSON_UNQUOTE(JSON_EXTRACT(name, '$.en')) = ?", [$term])
                    ->orWhereRaw("JSON_UNQUOTE(JSON_EXTRACT(name, '$.de')) = ?", [$term]);
            }
        })
            ->paginate(6)->appends($request->query());

        return $videoTags;
    }

    public function channelPreviews(Request $request, User $user)
    {
        return $user->preview()->paginate(20)->appends($request->query());
    }

    public function channelGalleries(Request $request, User $user)
    {
        return $user->gallery()->paginate(20)->appends($request->query());
    }

    // banned users
    public function bannedUsers()
    {
        Gate::authorize('channel-settings');

        $roomBans = auth()->user()->streamerBans()->with('user')->get();

        return Inertia::render('Channel/BannedUsers', compact('roomBans'));
    }


    // banned from room
    public function bannedFromRoom($user)
    {
        // find this room
        $streamUser = User::where('username', $user)->firstOrFail();

        return Inertia::render('Channel/BannedFromRoom', compact('streamUser'));
    }

    // lift user ban
    public function liftUserBan(RoomBans $roomban, Request $r)
    {
        Gate::authorize('channel-settings');


        if ($roomban->streamer_id != $r->user()->id) {
            abort(403);
        }

        $roomban->delete();

        toast(__('User ban lifted'), 'success');

        return back();
    }


    // ban user from room
    public function banUserFromRoom(User $user, Request $r)
    {
        Gate::authorize('channel-settings');

        $ban = $r->user()->streamerBans()->create([
            'user_id' => $user->id,
            'ip' => $user->ip
        ]);


        broadcast(new LiveStreamBan($r->user()));

        return response()->json(['ban' => $ban]);
    }
}
