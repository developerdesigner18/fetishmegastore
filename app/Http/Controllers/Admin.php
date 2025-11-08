<?php

namespace App\Http\Controllers;

use App\Mail\VideoLink;
use App\Models\AdBlock;
use App\Models\BunnyVideosList;
use App\Models\Blog;
use App\Models\Gallery;
use App\Models\Glossar;
use App\Models\RecommendedVideo;
use App\Models\RemovedSale;
use App\Models\RequestedVideo;
use App\Models\ShortVideo;
use App\Models\Story;
use App\Models\UserVoucherCode;
use App\Models\VideoSales;
use Carbon\Carbon;
use App\Models\Page;
use App\Models\Models;
use App\Models\Post;
use App\Models\Tips;
use App\Models\User;
use App\Models\Banned;
use App\Models\Report;
use App\Models\Options;
use App\Models\Tag;
use App\Models\Profile;
use App\Models\Category;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;
use App\Models\Subscription;
use Illuminate\Http\Request;
use App\Models\SaasSubscription;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Models\RoomBans;
use Illuminate\Support\Facades\Auth;
use App\Models\TokenPack;
use App\Models\TokenSale;
use App\Models\Video;
use App\Models\Audio;
use App\Models\VideoCategories;
use Illuminate\Support\Facades\Validator;
use App\Models\Withdrawal;
use App\Notifications\PaymentRequestProcessed;
use App\Notifications\StreamerVerifiedNotification;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image;

class Admin extends Controller
{
    public $bunnyClient;

    public $accessKey = 'adc3e470-1c44-487b-8f938c786a3b-0348-4764';

    public $zone = 'fetishmegastore';

    public function __construct()
    {
        $this->bunnyClient = new \Bunny\Storage\Client($this->accessKey, $this->zone, 'de');
    }

    // update .env FILE
    public function __updateEnvKey($key, $value)
    {
        $path = app()->environmentFilePath();

        $escaped = preg_quote('=' . env($key), '/');


        file_put_contents($path, preg_replace(
            "/^{$key}{$escaped}/m",
            "{$key}={$value}",
            file_get_contents($path)
        ));
    }


    // GET|POST /admin/login
    public function login(Request $r)
    {
        $message = '';

        if ($r->isMethod('post')) {
            $credentials = [
                'email' => request('email'),
                'password' => request('password')
            ];


            if (Auth::attempt($credentials)) {
                // get current user info
                $user = auth()->user();


                if ($user->is_admin == 'yes') {
                    return redirect('admin');
                } else {
                    $message = 'Invalid admin login.';
                }
            } else {
                $message = 'Invalid login.';
            }
        }

        return view('admin.admin-login')->with('message', $message);
    }

    // streamer bans
    public function streamerBans(Request $r)
    {
        if ($r->filled('delete')) {
            $streamerBan = RoomBans::findOrFail($r->delete);

            if ($streamerBan) {
                $streamerBan->delete();
            }

            return redirect('/admin/streamer-bans')->with('msg', __('Ban successfully removed!'));
        }
        $streamerBans = RoomBans::with(['streamer', 'user'])->get();
        return view('admin.streamer-bans')->with('active', 'streamer-bans')->with('streamerBans', $streamerBans);
    }

    // GET /admin/logout
    public function logout()
    {
        \Session::forget('admin');
        auth()->logout();
        return redirect('/admin/login');
    }

    // GET /admin/config-logins
    public function configLogins()
    {
        return view('admin.config-logins')->with('active', 'admin-login');
    }

    // POST /admin/save-logins
    public function saveLogins(Request $r)
    {
        if (env('IS_LIVE_DEMO', false) === true) {
            return back()->with('msg', 'No changes will be applied on this live demo.');
        }

        $this->validate($r, [
            'admin_user' => 'required|email',
            'admin_pass' => 'required|confirmed'
        ]);

        $user = auth()->user()->id;
        $user = User::findOrFail($user);

        $user->email = $r->admin_user;
        $user->password = \Hash::make($r->admin_pass);
        $user->save();

        return back()->with('msg', 'Successfully updated admin user details.');
    }

    public function dashboard()
    {
        // get total streamers
        $allStreamers = User::where('is_streamer', 'yes')->count();

        // get total users
        $allUsers = User::where('is_streamer', 'no')->count();

        // get tokens sold total
        $tokensSold = TokenSale::where('status', 'paid')->sum('tokens');

        // get tokens amount total
        $tokensAmount = TokenSale::where('status', 'paid')->sum('amount');


        $date = \Carbon\Carbon::parse('31 days ago');
        $dateRange = \Carbon\CarbonPeriod::create($date, now());
        $earnings = [];

        foreach ($dateRange as $d) {
            $earnings[$d->format('Y-m-d')] = [
                'date' => $d->format('Y-m-d'),
                'tokens' => 0,
                'amount' => 0,
            ];
        }

        // compute token sales earnings
        $salesEarnings = TokenSale::select(array(
            DB::raw('DATE(`created_at`) as `date`'),
            DB::raw('SUM(`tokens`) as `tokensTotal`'),
            DB::raw('SUM(`amount`) as `amountTotal`')
        ))
            ->where('created_at', '>', $date)
            ->groupBy('date')
            ->orderBy('date', 'DESC')
            ->get();

        // append subscription earnings
        foreach ($salesEarnings as $d) {
            $earnings[$d->date]['date'] = $d->date;
            $earnings[$d->date]['tokens'] = $d->tokensTotal;
            $earnings[$d->date]['amount'] = $d->amountTotal;
        }


        // finally, return the view
        return view('admin.dashboard')
            ->with('active', 'dashboard')
            ->with('allStreamers', $allStreamers)
            ->with('allUsers', $allUsers)
            ->with('tokensAmount', $tokensAmount)
            ->with('tokensSold', $tokensSold)
            ->with('earnings', $earnings);
    }

    public function generateSitemap(Request $request)
    {
        // Directory to store sub-sitemaps
        $sitemapFolder = public_path('sitemap');
        if (!File::exists($sitemapFolder)) {
            File::makeDirectory($sitemapFolder, 0755, true);
        }

        // Main Sitemap Index
        $sitemapIndex = [];

        // Static Pages (Only added to sitemap.xml)
        $staticPages = [
            'blog',
            'glossar',
            'story',
            'get-tokens',
            'browse-categories',
            'browse-tags',
            'browse-models',
            'browse-videos',
            'browse-short-videos',
            'browse-gallery',
            'browse-audio'
        ];

        foreach ($staticPages as $page) {
            $sitemapIndex[] = [
                'loc' => URL::to("/$page"),
                'lastmod' => date('Y-m-d'),
            ];
        }

        // Function to generate sub-sitemap files
        function createSubSitemap($filename, $items, $baseUrl, $suffix = '')
        {
            $xmlContent = '<?xml version="1.0" encoding="UTF-8"?>';
            $xmlContent .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

            foreach ($items as $slug) {
                $xmlContent .= '<url>';
                $xmlContent .= '<loc>' . htmlspecialchars(URL::to("$baseUrl/$slug$suffix")) . '</loc>';
                $xmlContent .= '<lastmod>' . date('Y-m-d') . '</lastmod>';
                $xmlContent .= '<changefreq>daily</changefreq>';
                $xmlContent .= '<priority>0.8</priority>';
                $xmlContent .= '</url>';
            }

            $xmlContent .= '</urlset>';

            // Save to subfolder
            File::put(public_path("sitemap/$filename.xml"), $xmlContent);
        }

        // Generate Sub-Sitemaps for dynamic pages
        createSubSitemap('blogs', Blog::pluck('slug')->toArray(), '/blog');
        $sitemapIndex[] = ['loc' => URL::to('/sitemap/blogs.xml'), 'lastmod' => date('Y-m-d')];

        createSubSitemap('glossar', Glossar::pluck('slug')->toArray(), '/glossar');
        $sitemapIndex[] = ['loc' => URL::to('/sitemap/glossar.xml'), 'lastmod' => date('Y-m-d')];

        createSubSitemap('stories', Story::pluck('slug')->toArray(), '/story');
        $sitemapIndex[] = ['loc' => URL::to('/sitemap/stories.xml'), 'lastmod' => date('Y-m-d')];

        createSubSitemap('videos', Video::pluck('slug')->toArray(), '/single-video');
        $sitemapIndex[] = ['loc' => URL::to('/sitemap/videos.xml'), 'lastmod' => date('Y-m-d')];

        createSubSitemap('previews', ShortVideo::pluck('slug')->toArray(), '/short-single-video');
        $sitemapIndex[] = ['loc' => URL::to('/sitemap/previews.xml'), 'lastmod' => date('Y-m-d')];

        createSubSitemap('audio', Audio::pluck('slug')->toArray(), '/single-audio');
        $sitemapIndex[] = ['loc' => URL::to('/sitemap/audio.xml'), 'lastmod' => date('Y-m-d')];

        createSubSitemap('models', Models::pluck('slug')->toArray(), '/model');
        $sitemapIndex[] = ['loc' => URL::to('/sitemap/models.xml'), 'lastmod' => date('Y-m-d')];


        createSubSitemap('categories', VideoCategories::pluck('slug')->toArray(), '/category');
        $sitemapIndex[] = ['loc' => URL::to('/sitemap/categories.xml'), 'lastmod' => date('Y-m-d')];

        createSubSitemap('tags', Tag::pluck('slug')->toArray(), '/tag');
        $sitemapIndex[] = ['loc' => URL::to('/sitemap/tags.xml'), 'lastmod' => date('Y-m-d')];

        createSubSitemap('galleries', Gallery::pluck('slug')->toArray(), '/single-gallery');
        $sitemapIndex[] = ['loc' => URL::to('/sitemap/galleries.xml'), 'lastmod' => date('Y-m-d')];

        // User Channels + Additional URLs
        $usernames = User::where('is_streamer', 'yes')->pluck('username')->toArray();
        createSubSitemap('channels', $usernames, '/channel');
        $sitemapIndex[] = ['loc' => URL::to('/sitemap/channels.xml'), 'lastmod' => date('Y-m-d')];

        //        foreach ($usernames as $username) {
        //            $extraUrls = ["/channel/$username/followers", "/channel/$username/subscribers", "/channel/$username/videos", "/channel/$username/models"];
        //            createSubSitemap("channel_$username", $extraUrls, '');
        //            $sitemapIndex[] = ['loc' => URL::to("/sitemap/channel_$username.xml"), 'lastmod' => date('Y-m-d')];
        //        }

        // Generate Sitemap Index XML
        $xmlContent = '<?xml version="1.0" encoding="UTF-8"?>';
        $xmlContent .= '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

        foreach ($sitemapIndex as $sitemap) {
            $xmlContent .= '<sitemap>';
            $xmlContent .= '<loc>' . htmlspecialchars($sitemap['loc']) . '</loc>';
            $xmlContent .= '<lastmod>' . $sitemap['lastmod'] . '</lastmod>';
            $xmlContent .= '</sitemap>';
        }

        $xmlContent .= '</sitemapindex>';

        // Save main sitemap.xml
        File::put(public_path('sitemap.xml'), $xmlContent);

        return response()->json(['message' => 'Sitemap generated successfully!']);
    }

    // verify streamer
    public function approveStreamer(Request $r)
    {
        $u = User::findOrFail($r->user);

        $u->is_streamer_verified = 'yes';
        $u->save();

        $u->notify(new StreamerVerifiedNotification());

        return redirect('/admin/streamers')->with('msg', __(":name (:username) was verified as a streamer", [
            'name' => $u->name,
            'username' => '@' . $u->username
        ]));
    }

    // payout requests
    public function payoutRequests()
    {
        $active = 'payout-requests';
        $payoutRequests = Withdrawal::where('status', 'Pending')->orderByDesc('id')->get();

        $gateway_meta = collect(DB::select('SELECT * FROM user_meta WHERE meta_key = ?', ['payout_destination']));
        $payout_meta = collect(DB::select('SELECT * FROM user_meta WHERE meta_key = ?', ['payout_details']));

        return view('admin.payout-requests', compact('payoutRequests', 'gateway_meta', 'payout_meta'));
    }

    // approve payment request
    public function markPaymentRequestAsPaid(Withdrawal $withdrawal)
    {
        // mark withdrawal as paid
        $withdrawal->status = 'Paid';
        $withdrawal->save();

        // subtract the balance
        $withdrawal->user->tokens -= $withdrawal->tokens;
        $withdrawal->user->save();

        // email the happy streamer
        $withdrawal->user->notify(new PaymentRequestProcessed($withdrawal));

        return back()->with('msg', __('Payment request marked as Paid and user notified!'));
    }

    // videos
    public function videos(Request $r)
    {
        if ($r->filled('remove')) {
            if (env('IS_LIVE_DEMO', false) === true) {
                return back()->with('msg', 'No changes will be applied on this live demo.');
            }

            $video = Video::findOrFail($r->remove);
            $video->sales()->delete();
            $video->delete();

            return back()->with('msg', __('Video successfully removed!'));
        }

        $active = 'videos';
        $videos = Video::orderByDesc('id');


        if ($r->filled('search')) {
            $videos->where('title', 'LIKE', '%' . $r->search . '%');
        }

        if ($r->filled('category')) {
            $videos->where(function ($query) use ($r) {
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
                    $videos->where('tags', 'LIKE', "%{$tag}%");
                } else {
                    $videos->orWhere('tags', 'LIKE', "%{$tag}%");
                }
            }
        }

        if ($r->filled('model')) {
            foreach ($r->model as $key => $model) {
                if ($key == 0) {
                    $videos->where('model_id', 'LIKE', "%{$model}%");
                } else {
                    $videos->orWhere('model_id', 'LIKE', "%{$model}%");
                }
            }
        }

        if ($r->filled('channels')) {
            $videos->whereIn('user_id', $r->channels);
        }

        $tag = Tag::all();
        $category = VideoCategories::all();
        $model = Models::all();

        $channles = User::select('username', 'id')->where('is_streamer', 'yes')->get();

        $videos = $videos->paginate(9);

        return view('admin.videos', compact('active', 'videos', 'tag', 'category', 'model', 'channles'));
    }

    // edit video
    public function editVideo(Video $video)
    {
        $active = 'videos';
        $video_categories = VideoCategories::orderBy('category')->get();

        $ogValue = DB::table('videos')->find($video->id);

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

        $imageDirectory = public_path('videos');
        $availableVideos = \Illuminate\Support\Facades\File::files($imageDirectory);
        $fileNames = [];
        foreach ($availableVideos as $videoDeatils) {
            $array = [];
            $array['label'] = $videoDeatils->getFilename();
            $array['value'] = 'videos/' . $videoDeatils->getFilename();
            $fileNames[] = $array;
        }

        $bunnyList = BunnyVideosList::selectRaw('label as value, name as label')->get()->toArray();

        $fileNames = array_merge($fileNames, $bunnyList);

        $video->video = explode('/', $video->video)[1];

        $supportedLocales = getSupportedLocales();

        $decodedTitle = json_decode($video->title, true) ?? [];

        if ($ogValue->title_lang === null || trim($ogValue->title_lang) === "") {
            $video->title_lang = "de";
            $ogValue->title_lang = "de";
        }

        if ($ogValue->description_lang === null || trim($ogValue->description_lang) === "") {
            $ogValue->description_lang = "de";
            $video->description_lang = "de";
        }
        // dd($ogValue->title_lang, $ogValue->description_lang, $ogValue);
        return view('admin.edit-video', compact('active', 'video', 'video_categories', 'ogValue', 'models', 'tags', 'fileNames','supportedLocales'));
    }

    // update video
    public function saveVideo(Video $video, Request $request)
    {
        // dd($request->all());
        // if (env('IS_LIVE_DEMO', false) === true) {
        //     return back()->with('msg', 'No changes will be applied on this live demo.');
        // }

        $request->validate(['title' => 'required', 'price' => 'required|numeric|min:0', 'free_for_subs' => 'required|in:yes,no', 'category_id' => 'required|exists:video_categories,id']);


        if ($request->hasFile('thumbnail')) {
            $thumbnail = Image::make($request->file('thumbnail'))->fit(640, 320)->stream();
            $thumbFile = 'thumbnails/' . uniqid() . '-' . auth()->id() . '.' . $request->file('thumbnail')->getClientOriginalExtension();

            Storage::disk(env('FILESYSTEM_DISK'))->put($thumbFile, $thumbnail);
            Storage::disk(env('FILESYSTEM_DISK'))->setVisibility($thumbFile, 'public');

            $video->update(['thumbnail' => $thumbFile]);
        }

        $titleData = ['en' => $request->title];
        if ($request->filled('title_lang') && $request->filled('title')) {
            $titleData[$request->title_lang] = $request->title;
        }

        // Step 2: Description ke liye dynamic array banayein
        $descriptionData = ['en' => $request->description];
        if ($request->filled('description_lang') && $request->filled('description_de')) {
            $descriptionData[$request->description_lang] = $request->description_de;
        }
        // dd($request->all(), $request->description_en, $titleData, $descriptionData);

        $video->update([
            'title' => $titleData,
            'title_lang' => $request->title_lang,
            'description' => $descriptionData,
            'description_lang' => $request->description_lang,
            'slug' => Str::slug($request->title),
            'price' => $request->price,
            'free_for_subs' => $request->free_for_subs,
            'category_id' => $request->category_id ? implode(',', $request->category_id) : $video->model_id,
            'model_id' => $request->model_id ? implode(',', $request->model_id) : $video->model_id,
            'tags' => $request->tags ? implode(',', $request->tags) : $video->tags,
            'video' => $request->video,
            'seo' => $request->has('seo') ? json_encode($request->seo) : null,
        ]);

        return redirect('admin/videos')->with('msg', __('Successfully updated video #' . $video->id));
    }

    // subscriptions
    public function subscriptions(Request $r)
    {
        if ($r->has('delete')) {
            // get subscription info
            $subscr = Subscription::findOrFail($r->delete);

            // delete
            $subscr->delete();

            return back()->with('msg', 'Subscription deleted.');
        }

        $active = 'subscriptions';
        $subscriptions = Subscription::with('streamer', 'subscriber')
            ->orderByDesc('id')
            ->whereDate('subscription_expires', '>=', Carbon::now())
            ->get();
        return view('admin.subscriptions', compact('subscriptions', 'active'));
    }


    // token sales
    public function tokenSales()
    {
        $active = 'token-sales';
        $sales = TokenSale::where('status', 'paid')->orderByDesc('id')->get();

        return view('admin.token-sales', compact('sales', 'active'));
    }

    public function addTokenSale(Request $request)
    {
        $request->validate(['user' => 'required|exists:users,id', 'packId' => 'required|exists:token_packs,id']);

        $user = User::find($request->user);
        $pack = TokenPack::find($request->packId);

        $active = 'token-sales';
        return view('admin.add-token-sale', compact('active', 'user', 'pack'));
    }

    public function saveTokenSale(User $user, Request $request)
    {
        if (env('IS_LIVE_DEMO', false) === true) {
            return back()->with('msg', 'No changes will be applied on this live demo.');
        }

        $request->validate(['addTokens' => 'required|numeric|min:1', 'amount' => 'required|numeric']);

        $user->increment('tokens', $request->addTokens);

        $tokenSale = TokenSale::create([
            'user_id' => $user->id,
            'tokens' => $request->addTokens,
            'amount' => $request->amount,
            'gateway' => 'Bank Transfer',
            'status' => 'paid'
        ]);

        $lastInsertedId = $tokenSale->id;

        handleAffiliateCommissionForTokens($tokenSale);

        return redirect('admin/token-sales')->with('msg', __(":tokensCount tokens were added to :username balance", ["tokensCount" => $request->addTokens, "username" => $user->username]));
    }

    // token packs
    public function tokenPacks(Request $r)
    {
        if ($r->filled('remove')) {
            if (env('IS_LIVE_DEMO', false) === true) {
                return back()->with('msg', 'No changes will be applied on this live demo.');
            }

            TokenPack::findOrFail($r->remove)->delete();
            return back()->with('msg', __('Token package removed.'));
        }

        $active = 'token-sales';
        $packs = TokenPack::orderBy('price')->get();

        return view('admin.token-packs', compact('packs', 'active'));
    }

    // create token pack
    public function createTokenPack()
    {
        return view('admin.create-token-pack');
    }

    // edit token pack
    public function editTokenPack(TokenPack $tokenPack)
    {
        return view('admin.edit-token-pack', compact('tokenPack'));
    }

    public function addTokenPack(Request $r)
    {
        if (env('IS_LIVE_DEMO', false) === true) {
            return back()->with('msg', 'No changes will be applied on this live demo.');
        }

        $r->validate([
            'name' => 'required',
            'tokens' => 'required|numeric|min:1',
            'price' => 'required|min:1'
        ]);

        TokenPack::create($r->only(['name', 'tokens', 'price']));

        return redirect('admin/token-packs')->with('msg', __('Token package was successfully created.'));
    }

    public function updateTokenPack(TokenPack $tokenPack, Request $r)
    {
        if (env('IS_LIVE_DEMO', false) === true) {
            return back()->with('msg', 'No changes will be applied on this live demo.');
        }

        $r->validate([
            'name' => 'required',
            'tokens' => 'required|numeric|min:1',
            'price' => 'required|min:1'
        ]);

        $tokenPack->update($r->only(['name', 'tokens', 'price']));

        return redirect('admin/token-packs')->with('msg', __('Token package was successfully updated.'));
    }

    // tips
    public function tips(Request $r)
    {
        if ($r->has('delete')) {
            if (env('IS_LIVE_DEMO', false) === true) {
                return back()->with('msg', 'No changes will be applied on this live demo.');
            }

            $tip = Tips::findOrFail($r->delete);
            $tip->delete();

            return back()->with('msg', 'User tip successfully removed!');
        }

        $active = 'tips';
        $tips = Tips::with('tipper', 'tipped')
            ->orderByDesc('id')
            ->where('payment_status', 'Paid')
            ->get();


        return view('admin.tips', compact('tips', 'active'));
    }


    public function streamers(Request $r)
    {
        $active = 'streamers';

        if ($r->has('remove')) {
            if (env('IS_LIVE_DEMO', false) === true) {
                return back()->with('msg', 'No changes will be applied on this live demo.');
            }

            if ($r->remove == 1) {
                return back()->with('msg', 'Do not delete the main admin user');
            }

            // find user and delete all it's related data
            $user = User::findOrFail($r->remove);
            $user->delete();

            return back()->with('msg', 'Successfully removed all this streamer & his data');
        }

        $users = User::where('is_streamer', 'yes')->orderByDesc('id')->paginate(10);

        return view('admin.users', compact('active', 'users'));
    }


    // edit creator subscription
    public function editSubscription(Subscription $subscription)
    {
        $planExpires = explode("-", $subscription->subscription_expires);
        list($year, $month, $day) = $planExpires;

        $day = explode(" ", $day);
        $day = reset($day);

        return view('admin.edit-subscription', compact('subscription', 'day', 'month', 'year'));
    }

    public function updateSubscription(Subscription $subscription, Request $r)
    {
        if (env('IS_LIVE_DEMO', false) === true) {
            return back()->with('msg', 'No changes will be applied on this live demo.');
        }

        $this->validate($r, [
            'mm' => 'required|numeric',
            'dd' => 'required|numeric',
            'yy' => 'required|numeric',
            'price' => 'required|numeric|min:0',
        ]);

        // compute plan expires
        $planExpires = mktime(0, 0, 0, $r->mm, $r->dd, $r->yy);

        $subscription->subscription_expires = date('Y-m-d H:i:s', $planExpires);
        $subscription->subscription_tokens = $r->price;
        $subscription->save();

        return redirect('admin/subscriptions')->with('msg', $subscription->subscriber->username . ' subscription to @' . $subscription->streamer->username . ' successfully updated');
    }

    // users overview
    public function users(Request $r)
    {

        $active = 'users';

        if ($r->has('remove')) {
            if (env('IS_LIVE_DEMO', false) === true) {
                return back()->with('msg', 'No changes will be applied on this live demo.');
            }

            if ($r->remove == 1) {
                return back()->with('msg', 'Do not delete the main admin user');
            }

            // find user and delete all it's related data
            $user = User::findOrFail($r->remove);
            $user->delete();

            return back()->with('msg', 'Succesfully removed all this user data');
        }

        $users = User::where('is_streamer', 'no');

        if ($r->has('search')) {
            $users = $users->where(function ($query) use ($r) {
                $query->where('name', 'LIKE', "$r->search")->OrWhere('username', 'LIKE', "$r->search")->OrWhere('email', 'LIKE', "$r->search");
            });
        }
        $users = $users->orderByDesc('id')->paginate(15);

        //        return $users;

        return view('admin.users', compact('active', 'users'));
    }

    // adjust tokens balance
    public function adjustTokenForm(User $user)
    {
        return view('admin.adjust-token', compact('user'));
    }

    // save new tokens balance
    public function saveTokenBalance(User $user, Request $request)
    {
        $request->validate(['balance' => 'required|numeric']);
        $user->tokens = $request->balance;
        $user->save();

        if ($user->is_streamer == 'yes') {
            return redirect('/admin/streamers')->with('msg', __('Successfully adjusted balance to :newBalance for streamer @:username', ['newBalance' => $request->balance, 'username' => $user->username]));
        } else {
            return redirect('/admin/users')->with('msg', __('Successfully adjusted balance to :newBalance tokens for user :username', ['newBalance' => $request->balance, 'username' => $user->username]));
        }
    }

    // set admin role
    public function setAdminRole(User $user)
    {
        if (env('IS_LIVE_DEMO', false) === true) {
            return back()->with('msg', 'No changes will be applied on this live demo.');
        }

        // set as admin
        $user->is_admin = 'yes';
        $user->save();

        return back()->with('msg', 'Successfully added ' . $user->email . ' as an admin');
    }

    // remove admin role
    public function unsetAdminRole(User $user)
    {
        if (env('IS_LIVE_DEMO', false) === true) {
            return back()->with('msg', 'No changes will be applied on this live demo.');
        }

        // find if there is any other admin remaining.
        $adminsRemaining = User::where('is_admin', 'yes')->where('id', '!=', $user->id)->exists();

        if ($adminsRemaining) {
            $user->is_admin = 'no';
            $user->save();

            $msg = 'Successfully removed admin role of ' . $user->email;
        } else {
            $msg = 'At all points, there must be at least one admin user on this website.';
        }


        return back()->with('msg', $msg);
    }

    // ban user
    public function banUser(User $user)
    {
        if (env('IS_LIVE_DEMO', false) === true) {
            return back()->with('msg', 'No changes will be applied on this live demo.');
        }

        if (auth()->id() == $user->id) {
            return back()->with('msg', 'Do not ban yourself');
        }

        $msg = 'Successfully banned ' . $user->email;

        // if ip is NOT null
        if ($user->ip) {
            // add banned ip entry
            $ban = new Banned();
            $ban->ip = $user->ip;
            $ban->save();
        } else {
            $msg = 'IP not available for ban';
        }

        return back()->with('msg', $msg);
    }

    // remove user ban
    public function unbanUser(User $user)
    {
        if (env('IS_LIVE_DEMO', false) === true) {
            return back()->with('msg', 'No changes will be applied on this live demo.');
        }

        // removed banned ip entry
        $ban = Banned::where('ip', $user->ip)->get();

        if ($ban->count()) {
            foreach ($ban as $b) {
                $b->delete();
            }
        }

        return back()->with('msg', 'Successfully removed ban for ' . $user->email);
    }

    // login as vendor
    public function loginAsVendor($vendorId)
    {
        // get user
        $user = User::findOrFail($vendorId);

        // login
        \Auth::loginUsingId($user->id);

        return redirect(route('home'));
    }


    // categories
    public function categories_overview(Request $r)
    {
        // if remove
        if ($removeId = $r->remove) {
            if (env('IS_LIVE_DEMO', false) === true) {
                return back()->with('msg', 'No changes will be applied on this live demo.');
            }

            // does this category contain creators?
            $hasCreators = DB::select('SELECT COUNT(*) as usersCount FROM category_user WHERE category_id = ?', [$r->remove]);
            $hasCreators = reset($hasCreators);


            if ($hasCreators->usersCount != 0) {
                return redirect('admin/categories')->with('msg', 'Sorry, this category contains creators. You can only remove categories that have 0 creators using it.');
            }

            // remove from db
            $d = Category::findOrFail($removeId);
            $d->delete();

            return redirect('admin/categories')->with('msg', 'Successfully removed category');
        }


        // if update
        $catname = '';
        $catID = '';
        if ($updateCat = $r->update) {
            // find category
            $c = Category::findOrFail($updateCat);
            $catname = $c->category;
            $catID = $c->id;
        }

        $categories = Category::withCount('users')->orderBy('category')->get();

        return view('admin.categories')
            ->with('active', 'categories')
            ->with('categories', $categories)
            ->with('catname', $catname)
            ->with('catID', $catID);
    }

    // add category
    public function add_category(Request $r)
    {
        if (env('IS_LIVE_DEMO', false) === true) {
            return back()->with('msg', 'No changes will be applied on this live demo.');
        }

        $this->validate($r, ['catname' => 'required']);

        $c = new Category();
        $c->category = $r->catname;
        $c->save();

        return redirect('admin/categories')->with('msg', 'Category successfully created.');
    }

    // update category
    public function update_category(Request $r)
    {
        if (env('IS_LIVE_DEMO', false) === true) {
            return back()->with('msg', 'No changes will be applied on this live demo.');
        }

        $this->validate($r, ['catname' => 'required']);

        $c = Category::findOrFail($r->catID);
        $c->category = $r->catname;
        $c->save();

        return redirect('admin/categories')->with('msg', 'Category successfully updated.');
    }

    // VIDEO categories
    public function video_categories(Request $r)
    {
        // if remove
        if ($removeId = $r->remove) {
            if (env('IS_LIVE_DEMO', false) === true) {
                return back()->with('msg', 'No changes will be applied on this live demo.');
            }

            // does this category contain creators?
            $hasCreators = VideoCategories::withCount('videos')->find($r->remove);


            if ($hasCreators->videos_count != 0) {
                return redirect('admin/video-categories')->with('msg', 'Sorry, this category contains videos. You can only remove categories that have 0 videos.');
            }

            // remove from db
            $d = VideoCategories::findOrFail($removeId);
            $d->delete();

            return redirect('admin/video-categories')->with('msg', 'Successfully removed category');
        }


        // if update
        $catname = '';
        $catID = '';
        if ($updateCat = $r->update) {
            // find category
            $c = VideoCategories::findOrFail($updateCat);
            $ogValue = DB::table('video_categories')->find($updateCat);

            $isJson = Str::isJson($ogValue->category);

            if (!$isJson) {
                $ogValue->category = $ogValue->category;
            } else {
                $ogValue->category = json_decode($ogValue->category);
            }
            $ogValue->seo = $ogValue->seo ? json_decode($ogValue->seo) : null;
            $catname = $c->category;
            $catID = $c->id;
        }

        $categories = VideoCategories::withCount('videos')->orderBy('category')->get();

        return view('admin.video-categories')
            ->with('active', 'categories')
            ->with('ogValue', $ogValue ?? null)
            ->with('categories', $categories)
            ->with('catname', $catname)
            ->with('catID', $catID);
    }

    // add category
    public function add_video_category(Request $r)
    {

        if (env('IS_LIVE_DEMO', false) === true) {
            return back()->with('msg', 'No changes will be applied on this live demo.');
        }

        $this->validate($r, ['catname' => 'required']);

        if ($r->hasFile('image')) {
            $thumbnail = Image::make($r->file('image'))->fit(640, 320)->stream();
            $thumbFile = 'categories/' . uniqid() . '-' . $r->file('image')->getClientOriginalExtension();
            Storage::disk(env('FILESYSTEM_DISK'))->put($thumbFile, $thumbnail);
            Storage::disk(env('FILESYSTEM_DISK'))->setVisibility($thumbFile, 'public');
            $this->bunnyClient->upload(public_path($thumbFile), $thumbFile);
            Storage::disk(env('FILESYSTEM_DISK'))->delete($thumbFile);
        }


        $c = new VideoCategories();
        $c->category = json_encode($r->catname);
        $c->slug = Str::slug($r->catname['en']);
        $c->image = $thumbFile ?? null;
        $c->seo_desc = $r->seo_desc ?? null;
        $c->seo_keyword = $r->seo_keyword ?? null;
        $c->seo_h2 = $r->seo_h2 ?? null;
        $c->seo = $r->input('seo');

        $c->save();

        return redirect('admin/video-categories')->with('msg', 'Category successfully created.');
    }

    // update category
    public function update_video_category(Request $r)
    {

        if (env('IS_LIVE_DEMO', false) === true) {
            return back()->with('msg', 'No changes will be applied on this live demo.');
        }
        $this->validate($r, ['catname' => 'required']);

        $c = VideoCategories::findOrFail($r->catID);


        if ($r->hasFile('image')) {
            $thumbnail = Image::make($r->file('image'))->fit(640, 320)->stream();
            $thumbFile = 'categories/' . uniqid() . '-' . $r->file('image')->getClientOriginalExtension();
            Storage::disk(env('FILESYSTEM_DISK'))->put($thumbFile, $thumbnail);
            Storage::disk(env('FILESYSTEM_DISK'))->setVisibility($thumbFile, 'public');
            $this->bunnyClient->upload(public_path($thumbFile), $thumbFile);
            Storage::disk(env('FILESYSTEM_DISK'))->delete($thumbFile);
        }


        $c->category = json_encode($r->catname);
        $c->slug = Str::slug($r->catname['en']);
        $c->image = $thumbFile ?? $c->image;
        $c->seo_desc = $r->seo_desc ?? $c->seo_desc;
        $c->seo_keyword = $r->seo_keyword ?? $c->seo_keyword;
        $c->seo_h2 = $r->seo_h2 ?? $c->seo_h2;
        $c->seo = $r['seo'] ? json_encode($r['seo']) : null;

        $c->save();

        return redirect('admin/video-categories')->with('msg', 'Category successfully updated.');
    }


    public function tags(Request $request)
    {
        // if remove
        if ($removeId = $request->remove) {
            if (env('IS_LIVE_DEMO', false) === true) {
                return back()->with('msg', 'No changes will be applied on this live demo.');
            }

            // does this category contain creators?
            //            $hasCreators = VideoCategories::withCount('videos')->find($request->remove);
            //
            //
            //            if ($hasCreators->videos_count != 0) {
            //                return redirect('admin/video-categories')->with('msg', 'Sorry, this category contains videos. You can only remove categories that have 0 videos.');
            //            }
            // remove from db
            $d = Tag::findOrFail($removeId);

            $d->delete();

            return redirect('admin/tag')->with('msg', 'Successfully removed tag');
        }


        // if update
        $catname = '';
        $catID = '';
        if ($updateCat = $request->update) {
            // find category
            $c = Tag::findOrFail($updateCat);
            $ogValue = DB::table('tags')->find($updateCat);

            $isJson = Str::isJson($ogValue->name);

            if (!$isJson) {
                $ogValue->name = $ogValue->name;
            } else {
                $ogValue->name = json_decode($ogValue->name);
            }
            $ogValue->seo = $ogValue->seo ? json_decode($ogValue->seo) : null;


            $catname = $c->name;
            $catID = $c->id;
        }

        $categories = Tag::get();


        return view('admin.tags')
            ->with('name', $catname)
            ->with('ogValue', $ogValue ?? null)
            ->with('categories', $categories)
            ->with('id', $catID);
    }

    public function recommendedVideos(Request $request)
    {
        // if remove
        if ($removeId = $request->remove) {
            if (env('IS_LIVE_DEMO', false) === true) {
                return back()->with('msg', 'No changes will be applied on this live demo.');
            }

            RecommendedVideo::where('id', $removeId)->delete();

            return redirect('admin/recommended-videos')->with('msg', 'video removed from recommended');
        }


        $allVideos = Video::select('title', 'id')->orderBy('created_at', 'desc')->get();

        $recommendedVideos = RecommendedVideo::with('video')->orderBy('created_at', 'desc')->get();


        return view('admin.recommended-videos', compact('allVideos', 'recommendedVideos'));
    }

    public function addRecommended(Request $request)
    {
        $this->validate($request, ['video_id' => 'required|unique:recommended_videos,video_id']);

        $save = new RecommendedVideo();
        $save->video_id = $request->video_id;
        $save->save();

        return redirect('admin/recommended-videos')->with('msg', 'video added to recommended list.');
    }

    // add category
    public function add_tag(Request $request)
    {
        if (env('IS_LIVE_DEMO', false) === true) {
            return back()->with('msg', 'No changes will be applied on this live demo.');
        }

        $this->validate($request, ['name' => 'required']);


        $c = new Tag();
        $c->name = json_encode($request->name);
        $c->slug = Str::slug($request->name['en']);

        if ($request->hasFile('image')) {
            $thumbnail = Image::make($request->file('image'))->fit(640, 320)->stream();
            $thumbFile = 'categories/' . uniqid() . '-' . $request->file('image')->getClientOriginalExtension();
            Storage::disk(env('FILESYSTEM_DISK'))->put($thumbFile, $thumbnail);
            Storage::disk(env('FILESYSTEM_DISK'))->setVisibility($thumbFile, 'public');
            $this->bunnyClient->upload(public_path($thumbFile), $thumbFile);
            Storage::disk(env('FILESYSTEM_DISK'))->delete($thumbFile);
        }
        $c->image = $thumbFile ?? null;
        $c->seo = json_encode($request->seo);
        $c->description = $request->description;
        $c->save();

        return redirect('admin/tag')->with('msg', 'Tag successfully created.');
    }

    // update category
    public function update_tag(Request $request)
    {

        if (env('IS_LIVE_DEMO', false) === true) {
            return back()->with('msg', 'No changes will be applied on this live demo.');
        }
        $this->validate($request, ['name' => 'required']);

        $c = Tag::findOrFail($request->id);


        $c->name = json_encode($request->name);
        $c->slug = Str::slug($request->name['en']);
        if ($request->hasFile('image')) {
            $thumbnail = Image::make($request->file('image'))->fit(640, 320)->stream();
            $thumbFile = 'categories/' . uniqid() . '-' . $request->file('image')->getClientOriginalExtension();
            Storage::disk(env('FILESYSTEM_DISK'))->put($thumbFile, $thumbnail);
            Storage::disk(env('FILESYSTEM_DISK'))->setVisibility($thumbFile, 'public');
            Storage::disk(env('FILESYSTEM_DISK'))->setVisibility($thumbFile, 'public');
            $this->bunnyClient->upload(public_path($thumbFile), $thumbFile);
            Storage::disk(env('FILESYSTEM_DISK'))->delete($thumbFile);
        }
        $c->image = $thumbFile ?? $c->image;
        $c->seo = json_encode($request->seo);
        $c->description = $request->description;
        $c->save();

        return redirect('admin/tag')->with('msg', 'Tag successfully updated.');
    }

    // pages controller
    public function pages()
    {
        // get existent pages
        $pages = Page::all();

        return view('admin.pages')->with('pages', $pages)
            ->with('active', 'pages');
    }

    // create a page
    public function create_page(Request $r)
    {
        if (env('IS_LIVE_DEMO', false) === true) {
            return back()->with('msg', 'No changes will be applied on this live demo.');
        }

        // validate form entries
        $this->validate($r, ['page_title' => 'unique:pages|required']);

        // save page
        $page = new Page();
        $page->page_title = $r->page_title;
        //        $page->from_i_talk = $r->from_i_talk;
        $page->page_slug = Str::slug($r->page_title);
        $page->page_content = $r->page_content;
        $page->save();

        return redirect()->route('admin-cms')->with('msg', 'Page successfully created');
    }

    // update page
    public function showUpdatePage($page)
    {
        $page = Page::find($page);
        return view('admin.update-page')->with('p', $page)->with('active', 'pages');
    }

    // update page processing
    public function processUpdatePage($page, Request $r)
    {
        if (env('IS_LIVE_DEMO', false) === true) {
            return back()->with('msg', 'No changes will be applied on this live demo.');
        }

        $page = Page::find($page);
        $page->page_title = $r->page_title;
        //        $page->from_i_talk = $r->from_i_talk;
        $page->page_content = $r->page_content;
        $page->save();

        return redirect('admin/cms-edit-' . $page->id)->with('msg', 'Page successfully updated.');
    }

    // delete page
    public function deletePage($page)
    {
        if (env('IS_LIVE_DEMO', false) === true) {
            return back()->with('msg', 'No changes will be applied on this live demo.');
        }

        $page = Page::find($page);
        $page->delete();
        return redirect()->route('admin-cms')->with('msg', 'Page successfully deleted.');
    }

    // upload image from CMS
    public function uploadImageFromCMS(Request $r)
    {
        if (env('IS_LIVE_DEMO', false) === true) {
            return back()->with('msg', 'No changes will be applied on this live demo.');
        }

        $fileName = $r->file('file')->storePublicly('cms-uploads', 'public');

        return response()->json(['location' => asset($fileName)]);
    }


    // appearance setup
    public function appearance()
    {
        return view('admin.appearance')->with('active', 'appearance');
    }

    // payments and pricing setup
    public function paymentsSetup()
    {
        $active = 'payments';
        return view('admin.payments-setup')->with('active', $active);
    }

    // payments and pricing setup
    public function paymentsSetupProcess()
    {
        if (env('IS_LIVE_DEMO', false) === true) {
            return back()->with('msg', 'No changes will be applied on this live demo.');
        }

        $options = request()->except('_token', 'sb_settings');

        // save options
        foreach ($options as $name => $value) {
            if ($name == 'payment-settings_currency_symbol') {
                $name = 'payment-settings.currency_symbol';
            } elseif ($name == 'payment-settings_currency_code') {
                $name = 'payment-settings.currency_code';
            } else {
                $name = $name;
            }
            Options::update_option($name, $value);
        }

        return redirect('admin/configuration/payment')->with('msg', 'Payments settings successfully saved!');
    }

    // general configuration
    public function configuration()
    {

        $active = 'configuration';
        return view('admin.configuration', compact('active'));
    }

    // process configuration changes
    public function configurationProcess(Request $r)
    {
        if (env('IS_LIVE_DEMO', false) === true) {
            return back()->with('msg', 'No changes will be applied on this live demo.');
        }

        $options = $r->except([
            '_token',
            'sb_settings',
            'admin_current_pass',
            'admin_new_pass',
            'site_favico'
        ]);

        // save options
        foreach ($options as $name => $value) {
            Options::update_option($name, $value);
        }


        if ($r->has('commission_percentage')) {
                Options::update_option('commission_percentage', $r->input('commission_percentage'));
            }

            if ($r->has('minimum_withdrawal_limit')) {
                Options::update_option('minimum_withdrawal_limit', $r->input('minimum_withdrawal_limit'));
            }

            if ($r->has('currency')) {
                Options::update_option('currency', $r->input('currency'));
            }

        // site logo (night mode) updated?
        if ($r->hasFile('site_logo')) {
            // validate image
            $this->validate($r, ['site_logo' => 'required|mimes:jpg,png']);

            // get extension
            $ext = $r->file('site_logo')->getClientOriginalExtension();

            // set destination
            $destinationPath = public_path() . '/images/';

            // set random file name
            $fileName = uniqid(rand()) . '.' . $ext;

            // upload the logo
            $r->file('site_logo')->move($destinationPath, $fileName);

            // update option
            Options::update_option('site_logo', '/images/' . $fileName);
        }

        // site logo (day mode) updated?
        if ($r->hasFile('site_logo_footer')) {
            // validate image
            $this->validate($r, ['site_logo_footer' => 'required|mimes:jpg,png']);

            // get extension
            $ext = $r->file('site_logo_footer')->getClientOriginalExtension();

            // set destination
            $destinationPath = public_path() . '/images/';

            // set random file name
            $fileName = uniqid(rand()) . '.' . $ext;

            // upload the logo
            $r->file('site_logo_footer')->move($destinationPath, $fileName);

            // update option
            Options::update_option('site_logo_footer', '/images/' . $fileName);
        }

        // favico updated?
        if ($r->hasFile('site_favico')) {
            // validate favicon
            $this->validate($r, ['site_favico' => 'required|mimes:jpg,png']);

            // get extension
            $ext = $r->file('site_favico')->getClientOriginalExtension();

            // set destination
            $destinationPath = public_path() . '/images/';

            // set random file name
            $fileName = uniqid(rand()) . '.' . $ext;

            // upload the logo
            $r->file('site_favico')->move($destinationPath, $fileName);


            // update option
            Options::update_option('favicon', '/images/' . $fileName);
        }

        return redirect('admin/configuration')->with('msg', 'Configuration settings successfully saved!');
    }

    // streaming configuration
    public function streamingConfig()
    {
        $active = 'streaming';
        return view('admin.streaming-config', compact('active'));
    }

    // save streaming configuration
    public function saveStreamingConfig(Request $r)
    {
        if (env('IS_LIVE_DEMO', false) === true) {
            return back()->with('msg', 'No changes will be applied on this live demo.');
        }

        $inputs = $r->only(['RTMP_URL']);

        foreach ($inputs as $key => $val) {
            $this->__updateEnvKey($key, $val);
        }

        return back()->with('msg', __('RTMP URL successfully saved'));
    }

    // chat configuration
    public function chatConfig()
    {
        $active = 'chat';
        return view('admin.chat-config', compact('active'));
    }

    // save chat configuration
    public function saveChatConfig(Request $r)
    {
        if (env('IS_LIVE_DEMO', false) === true) {
            return back()->with('msg', 'No changes will be applied on this live demo.');
        }

        $inputs = $r->only(['PUSHER_APP_KEY', 'PUSHER_APP_ID', 'PUSHER_APP_SECRET', 'PUSHER_APP_CLUSTER']);

        foreach ($inputs as $key => $val) {
            $this->__updateEnvKey($key, $val);
        }

        return back()->with('msg', __('Pusher app details successfully saved'));
    }



    public function videoSettingsConfig()
    {
        $active = 'video-settings';
        return view('admin.video-settings', compact('active'));
    }


    public function saveVideoSettingsConfig(Request $r)
    {
        updateOption('per_day_user_limit', $r->per_day_user_limit);
        updateOption('sign_up_bonus', $r->sign_up_bonus);


        if ($r->hasFile('image')) {
            $this->validate($r, ['image' => 'required|mimes:jpg,png']);
            $ext = $r->file('image')->getClientOriginalExtension();
            $destinationPath = public_path() . '/ads/';

            $fileName = uniqid(rand()) . '.' . $ext;

            // upload the logo
            $r->file('image')->move($destinationPath, $fileName);

            updateOption('image', '/ads/' . $fileName);
        }

        if ($r->filled('img_url')) {
            updateOption('img_url', $r->img_url);
        }
        updateOption('min_token_req', $r->min_token_req);
        updateOption('video_row_limit', $r->video_row_limit);
        return back()->with('msg', __('Video settings details successfully saved.'));
    }
    public function unsubscribeReasons()
    {
        $active = 'unsubscribe-reasons';
        return view('admin.unsubscribe-reasons', compact('active'));
    }

    public function saveUnsubscribeReasons(Request $request)
    {
        $reasons = $request->input('reasons');

        if (!is_array($reasons)) {
            return back()->with('msg', __('Invalid input.'));
        }
        $cleaned = array_filter(array_map('trim', $reasons));

        $cleaned = array_values($cleaned);
        if (($key = array_search('Other', $cleaned)) !== false) {
            unset($cleaned[$key]);
            $cleaned[] = 'Other';
        }

        updateOption('reason', json_encode(array_values($cleaned)));

        return back()->with('msg', __('Reason details successfully saved.'));
    }



    // extra CSS / JS
    public function extraCSSJS()
    {
        $active = 'cssjs';

        return view('admin.cssjs', compact('active'));
    }


    // save extra css/js
    public function saveExtraCSSJS(Request $r)
    {
        if (env('IS_LIVE_DEMO', false) === true) {
            return back()->with('msg', 'No changes will be applied on this live demo.');
        }

        Options::update_option('admin_extra_CSS', $r->admin_extra_CSS);
        Options::update_option('admin_extra_JS', $r->admin_extra_JS);
        Options::update_option('admin_raw_JS', $r->admin_raw_JS);

        return back()->with('msg', 'Successfully updated extra CSS/JS');
    }

    // mail configuration
    public function mailconfiguration()
    {
        return view('admin/mail-configuration', ['active' => 'mailconfig']);
    }

    // update mail configuration
    public function updateMailConfiguration(Request $r)
    {
        if (env('IS_LIVE_DEMO', false) === true) {
            return back()->with('msg', 'No changes will be applied on this live demo.');
        }

        try {
            $i = $r->except(['sb_settings', '_token']);

            foreach ($i as $k => $v) {
                $this->__updateEnvKey($k, $v);
            }

            $msg = 'Mail Configuration settings successfully saved!';
        } catch (\Exception $e) {
            $msg = $e->getMessage();
        }

        return redirect('admin/mailconfiguration')->with('msg', $msg);
    }

    // mail test
    public function mailtest()
    {
        if (env('IS_LIVE_DEMO', false) === true) {
            return back()->with('msg', 'No changes will be applied on this live demo.');
        }

        try {
            $data['message'] = 'This is a test email to check your mail server configuration.';

            $data['intromessage'] = 'Mail Server Configuration';
            $data['url'] = env('APP_URL') . '/admin/mailconfiguration';
            $data['buttonText'] = 'See Mail Configuration';

            $adminEmail = User::where('is_admin', 'yes')->first();


            \Mail::send('emails.test-email', ['data' => $data], function ($m) use ($adminEmail, $data) {
                $m->from(env('MAIL_FROM_ADDRESS'));
                $m->to($adminEmail->email);
                $m->subject('Email Configuration Test');
            });

            return redirect('admin/mailconfiguration')->with('msg', 'Mail sent to your server, it is up to them to deliver it now.');
        } catch (\Exception $e) {
            return redirect('admin/mailconfiguration')->with('msg', $e->getMessage());
        }
    }


    // show cloud settings page
    public function cloudSettings()
    {
        $active = 'cloud';
        return view('admin.cloud-settings', compact('active'));
    }

    // save cloud settings
    public function saveCloudSettings(Request $r)
    {
        if (env('IS_LIVE_DEMO', false) === true) {
            return back()->with('msg', 'No changes will be applied on this live demo.');
        }

        $options = $r->except([
            '_token',
            'sb_settings',
        ]);

        // save options
        foreach ($options as $name => $value) {
            $this->__updateEnvKey($name, $value);
        }

        return back()->with('msg', 'Cloud storage settings successfully saved');
    }


    // configure entry popup
    public function entryPopup()
    {
        $active = 'popup';
        return view('admin.entry-popup', compact('active'));
    }

    // save entry popup settings
    public function entryPopupSave(Request $r)
    {
        $options = request()->except('_token', 'sbPopup');

        // save options
        foreach ($options as $name => $value) {
            Options::update_option($name, $value);
        }

        return back()->with('msg', 'Report successfully removed.');
    }

    public function models(Request $request)
    {

        if ($request->remove && $request->remove != "") {
            if (env('IS_LIVE_DEMO', false) === true) {
                return back()->with('msg', 'No changes will be applied on this live demo.');
            }

            // does this category contain creators?
            $hasCreators = Models::withCount('videos')->find($request->remove);


            if ($hasCreators->videos_count != 0) {
                return redirect('admin/video-categories')->with('msg', 'Sorry, this model contains videos. You can only remove models that have 0 videos.');
            }

            // remove from db
            $d = Models::findOrFail($request->remove);
            $d->delete();

            return redirect('admin/models')->with('msg', 'Successfully removed model');
        }


        $models = Models::orderBy('id', 'DESC');


        $active = 'models';

        if ($request->filled('search')) {
            $models->where('name', 'LIKE', '%' . $request->search . '%');
        }

        $models = $models->paginate(9);

        return view('admin.models', compact('active', 'models'));
    }

    public function addNewModelView()
    {

        return view('admin.new-model');
    }

    public function addNewModel(Request $request)
    {


        if (env('IS_LIVE_DEMO', false) === true) {
            return back()->with('msg', 'No changes will be applied on this live demo.');
        }

        $this->validate($request, ['name' => 'required|unique:models', 'photo' => 'required|mimes:jpg,jpeg,png,webp']);


        $photos = [];
        if ($request->has('photos') && !empty($request->photos)) {
            if (count($request->photos) > 10 && count($request->photos) < 8) {
                return redirect()->back()->with('msg', 'For Gallery You Must Select 8 to 10 photos');
            }
            foreach ($request->photos as $key => $galleryPhotos) {

                $thumbnail = Image::make($galleryPhotos)->fit(1080, 1350)->stream();
                $gallaryFile = 'models/gallery/' . time() . $key . '-' . $galleryPhotos->getClientOriginalExtension();
                $photos[] = 'models/gallery/' . time() . $key . '-' . $galleryPhotos->getClientOriginalExtension();
                Storage::disk(env('FILESYSTEM_DISK'))->put($gallaryFile, $thumbnail);
                Storage::disk(env('FILESYSTEM_DISK'))->setVisibility($gallaryFile, 'public');
                $this->bunnyClient->upload(public_path($gallaryFile), $gallaryFile);
                Storage::disk(env('FILESYSTEM_DISK'))->delete($gallaryFile);
            }
        }

        if ($request->hasFile('photo')) {
            $thumbnail = Image::make($request->file('photo'))->fit(1080, 1350)->stream();
            $thumbFile = 'models/' . uniqid() . '-' . $request->file('photo')->getClientOriginalExtension();

            Storage::disk(env('FILESYSTEM_DISK'))->put($thumbFile, $thumbnail);
            Storage::disk(env('FILESYSTEM_DISK'))->setVisibility($thumbFile, 'public');
            $this->bunnyClient->upload(public_path($thumbFile), $thumbFile);
            Storage::disk(env('FILESYSTEM_DISK'))->delete($thumbFile);
        }

        //        dd('GG');
        $model = new Models();
        $model->name = $request->name;
        $model->slug = Str::slug($request->name);
        $model->photo = $thumbFile;
        $model->country = $request->country;
        $model->age = $request->age;
        $model->size = $request->size;
        $model->shoe_size = $request->shoe_size;
        $model->weight = $request->weight;
        $model->email = $request->email;
        $model->insta_url = $request->insta_url;
        $model->twitter_url = $request->twitter_url;
        $model->facebook_url = $request->facebook_url;
        $model->description = $request->description ?? null;
        $model->photos = !empty($photos) ? implode(',', $photos) : null;
        $model->seo = $request->seo ? json_encode($request->seo) : null;
        $model->save();


        return redirect('admin/models')->with('msg', 'Model successfully created.');
    }

    public function editModelView($id)
    {
        $model = Models::find($id);
        return view('admin.edit-model', compact('model'));
    }

    public function updateModel(Request $request)
    {
        $model = Models::find($request->id);


        $photos = [];
        $filteredArray = [];

        $photos = explode(',', $model->photos);

        $filteredArray = array_filter($photos, function ($value) {
            return $value !== "";
        });


        if ($request->has('photos') && !empty($request->photos)) {

            $checkHowManyImageAreAvailable = count($model->galleryUrl ?? []);

            if ($checkHowManyImageAreAvailable <= 10 && $checkHowManyImageAreAvailable >= 8) {
                return redirect()->back()->with('msg', 'You already have gallery image around 8 to 10 you cannot add more.');
            }

            $countUpcomingImages = $checkHowManyImageAreAvailable + count($request->photos);


            if ($countUpcomingImages > 10 && $countUpcomingImages < 8) {
                return redirect()->back()->with('msg', 'For Gallery You Must Have to Maintain 8 to 10 photos upcoming image is:' . $countUpcomingImages);
            }


            foreach ($request->photos as $key => $galleryPhotos) {
                $thumbnail = Image::make($galleryPhotos)->fit(1080, 1350)->stream();
                $gallaryFile = 'models/gallery/' . time() . $key . '-' . $galleryPhotos->getClientOriginalExtension();
                $filteredArray[] = 'models/gallery/' . time() . $key . '-' . $galleryPhotos->getClientOriginalExtension();
                Storage::disk(env('FILESYSTEM_DISK'))->put($gallaryFile, $thumbnail);
                Storage::disk(env('FILESYSTEM_DISK'))->setVisibility($gallaryFile, 'public');
                $this->bunnyClient->upload(public_path($gallaryFile), $gallaryFile);
                Storage::disk(env('FILESYSTEM_DISK'))->delete($gallaryFile);
            }
        }


        $oldName = $model->photo;

        if ($request->hasFile('photo')) {
            $thumbnail = Image::make($request->file('photo'))->fit(1080, 1350)->stream();
            $thumbFile = 'models/' . uniqid() . '-' . $request->file('photo')->getClientOriginalExtension();
            Storage::disk(env('FILESYSTEM_DISK'))->put($thumbFile, $thumbnail);
            Storage::disk(env('FILESYSTEM_DISK'))->setVisibility($thumbFile, 'public');
            $this->bunnyClient->upload(public_path($thumbFile), $thumbFile);
            Storage::disk(env('FILESYSTEM_DISK'))->delete($thumbFile);
            $oldName = $thumbFile;
        }

        $model->name = $request->name;
        $model->slug = Str::slug($request->name);
        $model->photo = $oldName;
        $model->country = $request->country;
        $model->age = $request->age;
        $model->size = $request->size;
        $model->shoe_size = $request->shoe_size;
        $model->weight = $request->weight;
        $model->email = $request->email;
        $model->insta_url = $request->insta_url;
        $model->twitter_url = $request->twitter_url;
        $model->facebook_url = $request->facebook_url;
        $model->photos = implode(',', $filteredArray);
        $model->description = $request->description ?? null;
        $model->seo = $request->seo ? json_encode($request->seo) : null;
        $model->save();

        return redirect('admin/models')->with('msg', 'Model successfully updated.');
    }

    public function requestedVideos()
    {

        $active = 'requested-videos';


        $requests = RequestedVideo::with('video', 'user')->where('status', '0')->orderByDesc('id')->get();
        //        $requests = RequestedVideo::with('video','user')->orderByDesc('id')->get();


        return view('admin.requested-videos', compact('active', 'requests'));
    }

    public function sendRequestLink(Request $request)
    {

        try {
            $requestedVideo = RequestedVideo::with('video', 'user')->find($request->id);

            Mail::to($requestedVideo->user->email)->send(new VideoLink($requestedVideo));

            $requestedVideo->update(['status' => '1']);


            return response()->json(['status' => 1, 'message' => 'Mail Sent Successfully!']);
        } catch (\Exception $exception) {
            return response()->json(['status' => 0, 'message' => $exception->getMessage()]);
        }
    }

    public function adBlock()
    {

        $adBlocks = AdBlock::all();
        return view('admin.ad-block', compact('adBlocks'));
    }


    public function add_block(Request $request)
    {
        // $validator = Validator::make($request->all(), [
        //     'number' => 'required|integer',
        //     'page_content' => 'required|string',
        //     'block_one' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        //     'block_two' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        // ]);

        // $validator->after(function ($validator) use ($request) {
        //     if ($request->hasFile('block_one')) {
        //         $blockOne = Image::make($request->file('block_one')->getPathname());
        //         if (!($blockOne->width() <= 728 && $blockOne->height() <= 90)) {
        //             $validator->errors()->add('block_one', 'Block One must be 728x90 pixels or smaller.');
        //         }
        //     }
        //     if ($request->hasFile('block_two')) {
        //         $blockTwo = Image::make($request->file('block_two')->getPathname());
        //         if (!($blockTwo->width() <= 468 && $blockTwo->height() <= 60)) {
        //             $validator->errors()->add('block_two', 'Block Two must be 468x60 pixels or smaller.');
        //         }
        //     }
        // });
        // if ($validator->fails()) {
        //     return redirect()->back()->withErrors($validator)->withInput();
        // }
        try {
            $adBlock = AdBlock::where('number', $request->number)->first();
            $blockOnePath = null;
            $blockTwoPath = null;
            if ($request->hasFile('block_one')) {
                $blockOnePath = $request->file('block_one')->store('ad_blocks', 'public');
            }
            if ($request->hasFile('block_two')) {
                $blockTwoPath = $request->file('block_two')->store('ad_blocks', 'public');
            }

            if ($adBlock) {
                $adBlock->html = $request->page_content;
                if ($blockOnePath) {
                    $adBlock->block_one = $blockOnePath;
                }
                if ($blockTwoPath) {
                    $adBlock->block_two = $blockTwoPath;
                }
                $adBlock->save();
                return redirect('admin/adBlocks')->with('msg', 'Updated Successfully!');
            } else {
                $newAdBlock = new AdBlock();
                $newAdBlock->number = $request->number;
                $newAdBlock->html = $request->page_content;
                $newAdBlock->block_one = $blockOnePath;
                $newAdBlock->block_two = $blockTwoPath;
                $newAdBlock->save();
                return redirect('admin/adBlocks')->with('msg', 'Added Successfully!');
            }
        } catch (\Exception $e) {
            return redirect('admin/adBlocks')->with('msg', $e->getMessage());
        }
    }


    public function deleteModelGalleryImage(Request $request)
    {

        $sepratePath = explode('/', $request->path);

        $getModel = Models::find($request->modelId);
        $newtring = Str::replace($request->path, '', $getModel->photos);

        $getModel->update(['photos' => $newtring]);

        @unlink(public_path($request->path));

        return response()->json(['status' => 1, 'message' => 'Image Removed!']);
    }

    public function submittedVouchers()
    {

        $data = UserVoucherCode::where('status', false)->orderBy('id', 'desc')->get();

        $active = 'submitted_vouchers';

        return view('admin.submitted_vouchers', compact('active', 'data'));
    }

    public function approveVoucher(Request $request)
    {

        try {

            $voucher = UserVoucherCode::with('user', 'token')->where('id', $request->id)->first();

            $voucher->user->increment('tokens', $voucher->token->tokens);

            $voucher->update(['status' => true]);

            return response()->json(['status' => 1, 'message' => 'Approved!']);
        } catch (\Exception $exception) {

            return response()->json(['status' => 0, 'message' => $exception->getMessage()]);
        }
    }

    public function userPurchaseHistory(Request $request)
    {

        $type = $request->get('type', 'active');

        switch ($type) {
            case 'active':
                $data = VideoSales::with(['user', 'video', 'streamer'])->orderBy('created_at', 'desc')->paginate(10);
                break;
            case 'deleted':
                $data = RemovedSale::with(['user', 'video', 'streamer'])->orderBy('created_at', 'desc')->paginate(10);
                break;
            default:
                $data = VideoSales::with(['user', 'video', 'streamer'])->orderBy('created_at', 'desc')->paginate(10);
                break;
        }


        $active = 'User Purchased History';


        return view('admin.user-purchase-history', compact('active', 'data'));
    }


    //new function start

    public function destroy($id)
    {
        $u = UserVoucherCode::find($id);

        if (!$u) {
            return response()->json(['success' => false, 'message' => 'Voucher not found.'], 404);
        }

        try {
            $u->delete();
            return response()->json(['success' => true, 'message' => 'Voucher deleted successfully.']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Failed to delete Voucher.']);
        }
    }

    //End new function 

    // audio
    public function audio(Request $r)
    {
        if ($r->filled('remove')) {
            if (env('IS_LIVE_DEMO', false) === true) {
                return back()->with('msg', 'No changes will be applied on this live demo.');
            }

            $audio = Audio::findOrFail($r->remove);
            $audio->sales()->delete();
            $audio->delete();

            return back()->with('msg', __('Audio successfully removed!'));
        }

        $active = 'audios';
        // $audios = Audio::orderByDesc('id');
        $audios = Audio::orderByDesc('id')->with('streamer');

        if ($r->filled('search')) {
            $audios->where('title', 'LIKE', '%' . $r->search . '%');
        }

        if ($r->filled('category')) {
            $audios->where(function ($query) use ($r) {
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
                    $audios->where('tags', 'LIKE', "%{$tag}%");
                } else {
                    $audios->orWhere('tags', 'LIKE', "%{$tag}%");
                }
            }
        }

        if ($r->filled('model')) {
            foreach ($r->model as $key => $model) {
                if ($key == 0) {
                    $audios->where('model_id', 'LIKE', "%{$model}%");
                } else {
                    $audios->orWhere('model_id', 'LIKE', "%{$model}%");
                }
            }
        }

        if ($r->filled('channels')) {
            $audios->whereIn('user_id', $r->channels);
        }

        $tag = Tag::all();
        $category = VideoCategories::all();
        $model = Models::all();

        $channles = User::select('username', 'id')->where('is_streamer', 'yes')->get();

        $audios = $audios->paginate(9);

        return view('admin.audios', compact('active', 'audios', 'tag', 'category', 'model', 'channles'));
    }

    // edit audio
    public function editAudio(Audio $audio)
    {
        $active = 'audio';
        $categories = VideoCategories::orderBy('category')->get();

        $ogValue = DB::table('audio')->find($audio->id);

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

        $imageDirectory = public_path('audio');
        $availableaudio = \Illuminate\Support\Facades\File::files($imageDirectory);
        $fileNames = [];
        foreach ($availableaudio as $videoDeatils) {
            $array = [];
            $array['label'] = $videoDeatils->getFilename();
            $array['value'] = 'audio/' . $videoDeatils->getFilename();
            $fileNames[] = $array;
        }

        $bunnyList = BunnyVideosList::selectRaw('label as value, name as label')->get()->toArray();

        $fileNames = array_merge($fileNames, $bunnyList);

        if($audio->audio){
            $audio->audio = explode('/', $audio->audio)[1];
        }

        $supportedLocales = getSupportedLocales();

        $decodedTitle = json_decode($audio->title, true) ?? [];
        // dd($audio->tags, $audio);

        if ($ogValue->title_lang === null || trim($ogValue->title_lang) === "") {
            $audio->title_lang = "de";
            $ogValue->title_lang = "de";
        }

        if ($ogValue->description_lang === null || trim($ogValue->description_lang) === "") {
            $ogValue->description_lang = "de";
            $audio->description_lang = "de";
        }
        // dd($ogValue->title_lang, $ogValue->description_lang, $ogValue);
        return view('admin.edit-audio', compact('active', 'audio', 'categories', 'ogValue', 'models', 'tags', 'fileNames','supportedLocales'));
    }

    // update audio
    public function saveAudio(Audio $audio, Request $request)
    {
        // dd($request->all());
        // if (env('IS_LIVE_DEMO', false) === true) {
        //     return back()->with('msg', 'No changes will be applied on this live demo.');
        // }

        $request->validate([
            'title' => 'required',
            'price' => 'required|numeric|min:0',
            'free_for_subs' => 'required|in:yes,no',
            'category_id.*' => 'required'
        ]);

        if ($request->filled('audio_file')) {
            $audio->audio = $request->audio_file;
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

        $titleFromDb = is_string($audio->title) ? json_decode($audio->title, true) : $audio->title;
        $titleArray = $titleFromDb ?? ['en' => ''];
        $titleArray['en'] = $request->title;
        if (!empty($request->title_lang) && !empty($request->title_de)) {
            $titleArray[$request->title_lang] = $request->title_de;
        }

        $descriptionFromDb = is_string($audio->description) ? json_decode($audio->description, true) : $audio->description;
        $descriptionArray = $descriptionFromDb ?? ['en' => ''];
        $descriptionArray['en'] = $request->description;
        if (!empty($request->description_lang) && !empty($request->description_de)) {
            $descriptionArray[$request->description_lang] = $request->description_de;
        }

        // dd($request->all(), $request->description, $titleArray, $descriptionArray);

        // $audio->update([
        //     'title' => $titleArray, 
        //     'title_lang' => $request->title_lang,
        //     'description' => $descriptionArray,
        //     'description_lang' => $request->description_lang,
        //     'slug' => Str::slug($request->title),
        //     'price' => $request->price,
        //     'free_for_subs' => $request->free_for_subs,
        //     // 'category_id' => $request->category_id ? implode(',', $request->category_id) : $audio->category_id,
        //     // 'model_id' => $request->model_id ? implode(',', $request->model_id) : $audio->model_id,
        //     'category_id' => is_array($request->category_id) ? implode(',', $request->category_id) : (string)$request->category_id,
        //     'model_id' => $request->model_id ? (is_array($request->model_id) ? implode(',', $request->model_id) : (string)$request->model_id) : null,
        //     'tags' => $request->tags ? implode(',', $request->tags) : $audio->tags,
        //     'audio' => $request->audio,
        //     'seo' => $request->has('seo') ? json_encode($request->seo) : null,
        // ]);

        $audio->update([
            'title_en' => $request->title_de,
            'title_de' => $request->description_de,
            'title' => $titleArray,
            'title_lang' => $request->title_lang,
            'slug' => Str::slug($request->title),
            'price' => $request->price,
            'free_for_subs' => $request->free_for_subs,
            'disk' => env('FILESYSTEM_DISK'),
            'category_id' => is_array($request->category_id) ? implode(',', $request->category_id) : $audio->category_id,
            'model_id' => is_array($request->model_id) ? implode(',', $request->model_id) : $audio->model_id,
            'is_from_ftp' => $request->is_from_ftp == '1' ? true : false,
            'tags' => $request->tags ? implode(',', $request->tags) : $audio->tags,
            'description' => $descriptionArray,
            'description_lang' => $request->description_lang,
        ]);

        return redirect('admin/audios')->with('msg', __('Successfully updated audio #' . $audio->id));
    }
}