<?php

use App\Models\AffiliateCommission;
use App\Models\AffiliateTransactions;
use App\Models\Options;
use App\Models\PaymentMethod;
use App\Models\UserMeta;
use App\Models\User;
use App\Models\AffiliateTracks;
use Illuminate\Support\Facades\Auth;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use App\Models\Video;
use Bunny\Storage\Client;




if (!function_exists('opt')) {
    function updateOption($key, $value)
    {
        Options::updateOrCreate(
            ['option_name' => $key],
            ['option_value' => $value]
        );
    }
}

if (!function_exists('opt')) {
    function opt($key)
    {
        return Options::where('option_name', $key)->value('option_value');
    }
}


if (!function_exists('updateOption')) {
    function updateOption($key, $value)
    {
        Options::updateOrCreate(
            ['option_name' => $key],
            ['option_value' => $value]
        );
    }
}

if (!function_exists('opt')) {
    function opt($key)
    {
        return Options::where('option_name', $key)->value('option_value');
    }
}

if (!function_exists('opt')) {
    function opt($option_name, $default_value = null)
    {
        if ($option_name == 'home_callout_formatted') {
            $val = Options::get_option('home_callout', $default_value);
            $val = str_replace("##", "<b>", $val);
            $val = str_replace("$$", "</b>", $val);
            return $val;
        }

        return Options::get_option($option_name, $default_value);
    }
}

if (!function_exists('setopt')) {
    function setopt($option_name, $option_value)
    {
        return Options::update_option($option_name, $option_value);
    }
}


if (!function_exists('user_meta')) {
    function user_meta($key, $single = true, $user_id = 'self')
    {
        if ($user_id == 'self') {
            $user_id = auth()->id();
        }

        $userMeta = UserMeta::where('user_id', $user_id)->where('meta_key', $key);

        if ($single) {
            return $userMeta->pluck('meta_value')->first();
        } else {
            return $userMeta->get();
        }
    }
}

if (!function_exists('get_page_description')) {
    function get_page_description()
    {
        $getRoute = request()->route()->uri();

        switch ($getRoute) {
            case '/':
                return 'Fetish Videos Online Streaming';
                break;
            case 'browse-categories':
                return 'Explore Our Diverse Fetish Categories';
                break;
            case 'browse-videos/{videocategory?}{slug?}':

                return 'Browse Our Extensive Collection of Fetish Videos';
                break;
            case 'browse-models':
                return 'Meet Our Stunning Fetish Models';
                break;
            case 'browse-channels/{category?}{slug?}':
                return 'Explore Our Exclusive Fetish Channels';
                break;
            case 'browse-tags':
                return 'Browse Fetish Videos by Tags';
                break;
            case 'get-tokens':
                return 'Purchase Tokens for Premium Fetish Content';
                break;
            case 'login':
                return 'Login to Your Fetish Megastore Account';
                break;
            case 'signup':
                return 'Join Fetish Megastore Today';
                break;
            case 'blog':
                return "Welcome to the FetishMegaStore Blog, your ultimate source for fetish news, tips, and insights. Explore a wide range of articles covering everything from BDSM and role play to latex and kink lifestyles. Stay updated with the latest trends, read fascinating stories, and gain valuable advice from experts and enthusiasts in the fetish community. Whether you're a seasoned practitioner or new to the world of fetish, our blog offers a wealth of information to enhance your knowledge and experience. Dive into our comprehensive guides, interviews, and reviews to stay connected and informed.";
                break;

            default:
                return 'Fetish Videos Online Streaming';
                break;
        }
    }
}

if (!function_exists('get_page_keywords')) {
    function get_page_keywords()
    {
        $getRoute = request()->route()->uri();
        switch ($getRoute) {
            case '/':
                return 'fetish video streaming, online fetish content, premium fetish videos, fetish entertainment, BDSM videos, latex fetish clips, role play videos, fetish video library, high-quality fetish content, fetish video categories, exclusive fetish content, fetish film collection, kink videos online, fetish video updates, discreet fetish streaming, fetish video portal, fetish video site, adult fetish content, fetish video platform, fetish streaming service, fetish video catalog, new fetish videos, fetish video marketplace, top fetish videos, diverse fetish content, popular fetish videos, trending fetish clips, fetish video selection, fetish video subscription, exclusive fetish scenes, fetish video database, fetish video archives, comprehensive fetish videos, fetish video collections, fetish video exploration, fetish video variety, fetish video hub, fetish video access, fetish video enjoyment, unlimited fetish videos, fetish video experience, personalized fetish videos, curated fetish content, fetish video favorites, fetish video picks, fetish video recommendations, ultimate fetish videos, fetish video discovery, premium fetish scenes, quality fetish videos';
                break;
            case 'browse-categories':
                return 'fetish categories, BDSM categories, latex categories, role play categories, fetish genres, fetish themes, fetish video categories, kink categories, fetish niches, fetish category list, fetish subcategories, fetish video genres, BDSM video categories, role play video categories, latex video categories, diverse fetish categories, fetish video themes, specialized fetish categories, unique fetish categories, fetish category exploration, fetish category browsing, exclusive fetish categories, premium fetish categories, fetish category selection, fetish category updates, trending fetish categories, popular fetish categories, new fetish categories, fetish category options, fetish category guide, comprehensive fetish categories, extensive fetish categories, fetish category library, niche fetish categories, fetish category variety, fetish category collection, fetish category discovery, curated fetish categories, personalized fetish categories, fetish category experience, fetish category portal, fetish category access, fetish category favorites, top fetish categories, best fetish categories, quality fetish categories, detailed fetish categories, diverse fetish video categories, fetish category search';
                break;
            case 'browse-videos/{videocategory?}{slug?}':
                return 'browse fetish videos, explore fetish videos, discover fetish videos, fetish video library, high-quality fetish videos, new fetish videos, popular fetish videos, trending fetish videos, premium fetish videos, exclusive fetish videos, fetish video collection, diverse fetish videos, curated fetish videos, personalized fetish videos, fetish video updates, fetish video streaming, fetish video access, fetish video selection, fetish video exploration, fetish video browsing, top fetish videos, best fetish videos, niche fetish videos, fetish video categories, fetish video themes, kink videos, BDSM videos, latex videos, role play videos, fetish video portal, comprehensive fetish videos, extensive fetish videos, fetish video catalog, quality fetish videos, unlimited fetish videos, fetish video favorites, fetish video recommendations, fetish video search, fetish video hub, fetish video enjoyment, fetish video experience, new fetish releases, trending fetish clips, fetish movie browsing, fetish film browsing';
                break;
            case 'browse-models':
                return 'browse fetish models, explore fetish models, discover fetish models, fetish model profiles, top fetish models, popular fetish models, trending fetish models, new fetish models, exclusive fetish models, fetish model gallery, fetish model directory, high-quality fetish models, premium fetish models, diverse fetish models, curated fetish models, personalized fetish models, fetish model updates, fetish model collection, fetish model exploration, fetish model browsing, favorite fetish models, best fetish models, fetish model search, fetish model selection, fetish model portal, fetish model catalog, fetish model database, kink models, BDSM models, latex models, role play models, fetish performer profiles, meet fetish models, featured fetish models, niche fetish models, fetish model variety, comprehensive fetish models, fetish model hub, fetish model access, fetish model connection, fetish model discovery, exclusive fetish performer profiles, top-rated fetish models, premium fetish performer directory';
                break;
            case 'browse-channels/{category?}{slug?}':
                return 'browse fetish channels, explore fetish channels, discover fetish channels, fetish video channels, exclusive fetish channels, premium fetish channels, top fetish channels, popular fetish channels, trending fetish channels, new fetish channels, fetish channel collection, diverse fetish channels, curated fetish channels, personalized fetish channels, fetish channel updates, fetish channel streaming, fetish channel access, fetish channel selection, fetish channel exploration, fetish channel browsing, high-quality fetish channels, fetish channel directory, fetish channel library, fetish channel guide, fetish channel search, niche fetish channels, BDSM channels, latex channels, role play channels, fetish content channels, comprehensive fetish channels, extensive fetish channels, fetish channel variety, fetish channel experience, fetish channel hub, best fetish channels, favorite fetish channels, quality fetish channels, unique fetish channels, exclusive fetish content channels, fetish channel discovery, premium fetish content channels';
                break;
            case 'browse-tags':
                return 'browse fetish tags, explore fetish tags, discover fetish tags, fetish video tags, top fetish tags, popular fetish tags, trending fetish tags, new fetish tags, exclusive fetish tags, premium fetish tags, diverse fetish tags, curated fetish tags, personalized fetish tags, fetish tag library, fetish tag search, niche fetish tags, BDSM tags, latex tags, role play tags, kink tags, fetish tag collection, fetish tag browsing, fetish tag exploration, fetish tag selection, high-quality fetish tags, comprehensive fetish tags, extensive fetish tags, fetish tag directory, fetish tag guide, fetish tag updates, fetish tag catalog, fetish tag variety, unique fetish tags, fetish tag experience, fetish tag access, fetish tag hub, best fetish tags, favorite fetish tags, quality fetish tags, detailed fetish tags, specialized fetish tags, trending kink tags';
                break;
            case 'get-tokens':
                return 'buy fetish tokens, purchase fetish tokens, get tokens, fetish video tokens, premium tokens, token packages, exclusive content tokens, fetish token purchase, fetish token sale, token access, token purchase options, buy video tokens, token for fetish videos, high-quality fetish tokens, secure token purchase, token packages for sale, premium fetish access, token deals, discount fetish tokens, token bundles, best token deals, token payment, fetish token shop, purchase video tokens, buy premium tokens, token sales, token store, token offers, exclusive token offers, token packages available, token purchase guide, token pricing, get fetish tokens, buy fetish content tokens, token options, token buying guide, secure fetish tokens, buy tokens online, token transaction, premium video tokens, token store online, tokens for fetish content, token packages purchase, token discounts, token access to premium content, fetish token deals';
                break;
            case 'login':
                return 'login to Fetish Megastore, Fetish Megastore login, access fetish account, fetish account login, fetish video login, sign in to fetish site, fetish member login, fetish video account, secure fetish login, fetish site access, member login, fetish user login, fetish login page, fetish account access, fetish video sign in, fetish site login, login to fetish content, login to fetish videos, member access, fetish video member login, user login, sign in to fetish videos, fetish account sign in, fetish video platform login, login to view fetish content, access premium fetish videos, sign in to fetish Megastore, fetish video account access, login to fetish streaming, fetish login portal, fetish video site login, fetish membership login, secure access to fetish videos, fetish user access, member sign in, access fetish video library, login to watch fetish videos, fetish video service login, fetish video access, premium fetish login, fetish video membership, login to your fetish account, login for fetish content, sign in for fetish videos, access your fetish profile, secure fetish account access';
                break;
            case 'signup':
                return 'sign up for Fetish Megastore, Fetish Megastore signup, create fetish account, join fetish site, register for fetish videos, fetish video signup, fetish member signup, sign up for fetish content, create fetish profile, join fetish video platform, fetish account registration, fetish video account signup, register for fetish content, new fetish account, sign up for fetish streaming, join fetish community, create account for fetish videos, fetish membership signup, register for premium fetish videos, sign up for exclusive fetish content, join fetish Megastore, fetish site registration, create account for fetish site, sign up for fetish video library, join fetish streaming service, register for fetish access, sign up for fetish video service, create fetish member account, join premium fetish site, register for fetish videos, sign up to watch fetish videos, join fetish video site, create fetish user account, sign up for fetish entertainment, join fetish video community, register for fetish streaming, sign up for fetish membership, create fetish video account, join fetish content site, register for fetish profile, sign up for fetish video access, join fetish video portal, create account for fetish content, sign up for fetish video service, register for fetish video membership, sign up for fetish videos online';
                break;
            case 'blog':
                return 'fetish blog, fetish articles, fetish tips, fetish guides, kink blog, BDSM blog, fetish news, fetish trends, fetish lifestyle, fetish experiences, fetish stories, kink stories, fetish advice, fetish community, fetish updates, fetish education, fetish insights, fetish tutorials, fetish interviews, fetish events, fetish reviews, fetish information, fetish resources, fetish knowledge, fetish practices, fetish techniques, kink education, fetish discussions, fetish forums, BDSM articles, latex blog, role play blog, fetish exploration, kink experiences, fetish culture, fetish enthusiasts';
                break;

            default:
                return 'fetish video streaming, online fetish content, premium fetish videos, fetish entertainment, BDSM videos, latex fetish clips, role play videos, fetish video library, high-quality fetish content, fetish video categories, exclusive fetish content, fetish film collection, kink videos online, fetish video updates, discreet fetish streaming, fetish video portal, fetish video site, adult fetish content, fetish video platform, fetish streaming service, fetish video catalog, new fetish videos, fetish video marketplace, top fetish videos, diverse fetish content, popular fetish videos, trending fetish clips, fetish video selection, fetish video subscription, exclusive fetish scenes, fetish video database, fetish video archives, comprehensive fetish videos, fetish video collections, fetish video exploration, fetish video variety, fetish video hub, fetish video access, fetish video enjoyment, unlimited fetish videos, fetish video experience, personalized fetish videos, curated fetish content, fetish video favorites, fetish video picks, fetish video recommendations, ultimate fetish videos, fetish video discovery, premium fetish scenes, quality fetish videos';
                break;
        }
    }
}

if (!function_exists('get_seo_h2_tag')) {
    function get_seo_h2_tag()
    {
        $getRoute = request()->route()->uri();
        //        dd($getRoute);
        switch ($getRoute) {
            case 'category/{id}':
                $fetchSeo = \App\Models\VideoCategories::whereSlug(request('id'))->first();
                return $fetchSeo->seo_h2 ?? 'Fetish Videos Online Streaming';
                break;
            case 'tag/{id}':
                $fetchSeo = \App\Models\Tag::whereSlug(request('id'))->first();
                $decodedValue = $fetchSeo->seo ? json_decode($fetchSeo->seo) : null;
                return $decodedValue->h2 ?? 'Fetish Videos Online Streaming';
                break;
            case 'blog/{slug}':
                $fetchSeo = \App\Models\Blog::where('slug', request('slug'))->first();
                $decodedValue = $fetchSeo->seo ? json_decode($fetchSeo->seo) : null;
                return $decodedValue->h2 ?? 'Fetish Videos Online Streaming';
                break;
            default:
                return 'Fetish Videos Online Streaming';
                break;
        }
    }
}

if (!function_exists('set_user_meta')) {
    function set_user_meta($key, $value, $replace = true, $user_id = 'self')
    {
        if ($user_id == 'self') {
            $user_id = auth()->id();
        }

        if ($replace) {
            $meta = UserMeta::firstOrCreate(
                ['user_id' => $user_id, 'meta_key' => $key],
                ['meta_value' => $value]
            );

            $meta->meta_value = $value;
            $meta->save();
        } else {
            $meta = new UserMeta();
            $meta->user_id = $user_id;
            $meta->meta_key = $key;
            $meta->meta_value = $value;
            $meta->save();
        }
    }
}


if (!function_exists('delopt')) {
    function delopt($option_name)
    {
        return Options::delete_option($option_name);
    }
}

if (!function_exists('turnLinksIntoAtags')) {
    // links in
    function turnLinksIntoAtags($string)
    {
        //The Regular Expression filter
        $reg_exUrl = "/(?i)\b((?:https?:\/\/|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'\".,<>?«»“”‘’]))/";

        // Check if there is a url in the text
        if (preg_match_all($reg_exUrl, $string, $url)) {
            // Loop through all matches
            foreach ($url[0] as $newLinks) {
                // if youtube/vimeo link
                if (stristr($newLinks, 'youtube.com') || stristr($newLinks, 'vimeo.com')) {
                    continue;
                }

                if (strstr($newLinks, ":") === false) {
                    $link = 'http://' . $newLinks;
                } else {
                    $link = $newLinks;
                }

                // Create Search and Replace strings
                $search = $newLinks;
                $replace = '<a href="' . route('external-url', ['url' => $link]) . '" target="_blank" rel="nofollow">' . $link . '</a>';
                $string = str_replace($search, $replace, $string);
            }
        }

        // replace youtube links with embedded codes
        $string = preg_replace("/\s*[a-zA-Z\/\/:\.]*youtube.com\/watch\?v=([a-zA-Z0-9\-_]+)([a-zA-Z0-9\/\*\-\_\?\&\;\%\=\.]*)/i", "<iframe class=\"w-full mt-2 mb-2\" height=\"450\" src=\"//www.youtube.com/embed/$1\" frameborder=\"0\" allowfullscreen></iframe>", $string);

        // replace vimeo link with embedded codes
        $string = preg_replace('#https?://(www\.)?vimeo\.com/(\d+)#', '<div class="embed-container mt-2 mb-2"><iframe class="w-full mt-2 mb-2" height="450" src="//player.vimeo.com/video/$2" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowfullscreen></iframe></div>', $string);

        return $string;
    }
}

function secure_image($image, $w, $h)
{
    return Storage::disk('public')->url($image);
}

function encrypt_decrypt($action, $string)
{
    $output = false;
    $encrypt_method = "AES-256-CBC";
    //This is my secret key
    $secret_key = '5b7cfd2937f2681f1d9139e5963312a39266ce52df93ded48f93d0f10b3c35ba29wdp';
    //This is my secret iv
    $secret_iv = '566ce52df93ded48f93d0f10b3c35bab7cfd2937f2681f1d9139e5963312a392technology';
    // hash
    $key = hash('sha256', $secret_key);

    // iv - encrypt method AES-256-CBC expects 16 bytes - else you will get a warning
    $iv = substr(hash('sha256', $secret_iv), 0, 16);
    if ($action == 'encrypt') {
        $output = openssl_encrypt("$string", $encrypt_method, $key, 0, $iv);
        $output = base64_encode($output);
    } else if ($action == 'decrypt') {
        $output = openssl_decrypt(base64_decode($string), $encrypt_method, $key, 0, $iv);
    }
    return $output;
}
function pr($value)
{
    echo "<pre>";
    print_r($value);
}
function prd($value)
{
    echo "<pre>";
    print_r($value);
    die;
}
function getPaypalDetails()
{
    $paymentMethod = PaymentMethod::where('name', 'PayPal')
        ->where('status', 1)
        ->first();
    if (!empty($paymentMethod)) {
        return $paymentMethod;
    } else {
        return array();
    }
}

//new code 
if (!function_exists('generateAlphaNumericCode')) {
    function generateAlphaNumericCode($length = 6)
    {
        $characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        do {
            $code = '';
            for ($i = 0; $i < $length; $i++) {
                $index = random_int(0, strlen($characters) - 1);
                $code .= $characters[$index];
            }
        } while (User::where('affiliate_code', $code)->exists());
        return $code;
    }
}



// function handleAffiliateCommissionForVideo($buyer, $video)
// {

//     if (!session()->has('affiliate_ref')) return;

//     $affiliate = session('affiliate_ref');

//     $refUser = User::find($affiliate['user_id']);
//     //dd($refUser);
//     // Self-referral protection
//     if (!$refUser || $refUser->id === $buyer->id) return;

//     $commissionAmount = floor($video->price * 0.5);

//     // Transfer tokens
//     $refUser->increment('tokens', $commissionAmount);

//     // Save affiliate commission
//     AffiliateCommission::create([
//         'user_id' => $refUser->id,
//         'buyer_id' => $buyer->id,
//         'type' => 'video',
//         'item_id' => $video->id,
//         'token' => $commissionAmount,
//         'status' => 1,
//     ]);

//     // Clear session to avoid duplicate credit
//     session()->forget('affiliate_ref');
// }


if (!function_exists('handleAffiliateCommissionForTokens')) {
    function handleAffiliateCommissionForTokens($order)
    {
        if (!empty($order)) {
            $buyerID = $order->user_id ?? '0';
            if (!empty($buyerID)) {
                $checkAff = User::where('id', $buyerID)
                        ->whereNotNull('affiliate_code')
                        ->whereNotNull('affiliate_user')
                        ->first();

                if(!empty($checkAff)){
                    $referrer = User::select('id', 'affiliate_user')->where('id', $buyerID)->first();

                    if ($referrer) {
                        $commissionAmount = $order->amount * 0.5;

                        $affiliateCommission = AffiliateCommission::create([
                            'user_id'  => $referrer->affiliate_user,
                            'buyer_id' => $buyerID,
                            'type'     => 'token',
                            'item_id'  => '0',
                            'token'    => $commissionAmount,
                            'status'   => 1,
                        ]);

                        if ($affiliateCommission) {
                            $lastTransaction = AffiliateTransactions::where('user_id', $referrer->affiliate_user)
                                ->orderBy('id', 'desc')
                                ->first();

                            $previousBalance = $lastTransaction ? $lastTransaction->balance : 0;
                            $newBalance = $previousBalance + $commissionAmount;

                            AffiliateTransactions::create([
                                'user_id'                => $referrer->affiliate_user,
                                'affiliate_commission_id' => $affiliateCommission->id,
                                'amount'                 => $commissionAmount,
                                'type'                   => 'cr',
                                'balance'                => $newBalance,
                                'status'                 => 1,
                            ]);
                        }
                    }
                }
            }
        }
    }
}



if (!function_exists('affilaiteCommissionGenrate')) {
    function affilaiteCommissionGenrate($buyer, $video)
    {

        $referrerId = $buyer->affiliate_user ?? null;

        if (!empty($referrerId)) {
            $referrer = User::where('id', $referrerId)
                ->where('is_affiliate_vendor', 1)
                ->where('affiliate_vendor_verifiy', 1)
                ->first();

            if ($referrer) {
                $commissionAmount = floor($video->price * 0.5);
                $referrer->increment('tokens', $commissionAmount);

                AffiliateCommission::create([
                    'user_id' => $referrer->id,
                    'buyer_id' => $buyer->id,
                    'type' => 'video',
                    'item_id' => $video->id,
                    'token' => $commissionAmount,
                    'status' => 1,
                ]);
            }
        }
    }
}


//affilaite Tracks User

if (!function_exists('affiliateTracksUser')) {
    function affiliateTracksUser()
    {
        $affiliateCode = request()->query('affiliate_code');
        if (!$affiliateCode) {
            return;
        }
        $affiliateUser = User::where('affiliate_code', $affiliateCode)->first();

        if (!$affiliateUser) {
            return;
        }
        $userId =  auth()->id();
        $ipAddress = request()->ip();
        $fullUrl = request()->fullUrl();

        if ($userId && $userId === $affiliateUser->id) {
            return;
        }
        $query = AffiliateTracks::where('affiliate_user_id', $affiliateUser->id)
            ->where('affiliate_code', $affiliateCode)
            ->where('ip_address', $ipAddress);

        if ($userId) {
            $query->where('user_id', $userId);
        } else {
            $query->whereNull('user_id');
        }
        if ($query->exists()) {
            return;
        }
        AffiliateTracks::create([
            'user_id' => $userId,
            'affiliate_user_id' => $affiliateUser->id,
            'ip_address' => $ipAddress,
            'url' => $fullUrl,
            'affiliate_code' => $affiliateCode,
        ]);
    }
}



if (!function_exists('getSupportedLocales')) {
    function getSupportedLocales()
    {
        return [
            ['lang_value' => 'de', 'lang_name' => 'German'],
            ['lang_value' => 'it', 'lang_name' => 'Italian'],
            ['lang_value' => 'fr', 'lang_name' => 'French'],
            ['lang_value' => 'es', 'lang_name' => 'Spanish'],
            ['lang_value' => 'ru', 'lang_name' => 'Russian'],
            ['lang_value' => 'zh', 'lang_name' => 'Chinese'],
            ['lang_value' => 'jp', 'lang_name' => 'Japanese'],
            ['lang_value' => 'pt', 'lang_name' => 'Portuguese'],
            ['lang_value' => 'pl', 'lang_name' => 'Polish'],
            ['lang_value' => 'tr', 'lang_name' => 'Turkish'],
        ];
    }
}

if (!function_exists('createGif')) {
  function createGif($id)
    {
        Log::info('STARTED');

        $getNotConvertedVideos = Video::where('id', $id)->where('is_gif', 0)->orderBy('id','desc')->get();

        $getNotConvertedVideos->map(function ($videoDetails) {
            Log::info('Processing video: ' . $videoDetails->video);
            
            try {
                // Fix 1: Use the actual file path, not asset() for local files
                $input_video = public_path($videoDetails->video);
                
                // Fix 2: Better path handling
                $videoPathInfo = pathinfo($videoDetails->video);
                $output_gif = public_path('videos/GIF/') . $videoPathInfo['filename'] . '.gif';
                
                // Fix 3: Create GIF directory if it doesn't exist
                $gifDir = public_path('videos/GIF/');
                if (!file_exists($gifDir)) {
                    mkdir($gifDir, 0755, true);
                }

                Log::info("Input video path: " . $input_video);
                Log::info("Output GIF path: " . $output_gif);

                // Fix 4: Check if input file exists
                if (!file_exists($input_video)) {
                    Log::warning("Input video file not found: " . $input_video);
                    
                    // Try using videoUrl if local file doesn't exist
                    if (!empty($videoDetails->videoUrl)) {
                        $input_video = $videoDetails->videoUrl;
                        Log::info("Using videoUrl instead: " . $input_video);
                    } else {
                        Log::error("No valid video source found for video ID: " . $videoDetails->id);
                        return;
                    }
                }

                $segments = [
                    ['start' => 10, 'duration' => 2],
                    ['start' => 45, 'duration' => 2],
                    ['start' => 61, 'duration' => 1]
                ];

                $tempFiles = [];

                // Fix 5: Create segments with better error handling
                foreach ($segments as $index => $segment) {
                    $segment_file = "segment{$index}.mp4";
                    $tempFiles[] = $segment_file;
                    
                    $command = sprintf(
                        'ffmpeg -ss %d -t %d -i %s -c copy -an %s 2>&1',
                        $segment['start'],
                        $segment['duration'],
                        escapeshellarg($input_video),
                        escapeshellarg($segment_file)
                    );
                    
                    Log::info("Executing segment command: " . $command);
                    $output = [];
                    exec($command, $output, $returnCode);
                    
                    if ($returnCode !== 0) {
                        Log::error("FFmpeg segment creation failed: " . implode("\n", $output));
                        throw new \Exception("Failed to create segment {$index}");
                    }
                    
                    // Check if segment file was created
                    if (!file_exists($segment_file)) {
                        throw new \Exception("Segment file not created: {$segment_file}");
                    }
                }

                // Fix 6: Create concat list
                $concat_list = "concat_list.txt";
                $tempFiles[] = $concat_list;
                
                $concat_content = implode("\n", array_map(function ($index) {
                    return "file 'segment{$index}.mp4'";
                }, array_keys($segments)));
                
                file_put_contents($concat_list, $concat_content);

                // Fix 7: Concatenate segments
                $concatenated_file = 'concatenated.mp4';
                $tempFiles[] = $concatenated_file;
                
                $command = sprintf(
                    'ffmpeg -f concat -safe 0 -i %s -c copy %s 2>&1',
                    escapeshellarg($concat_list),
                    escapeshellarg($concatenated_file)
                );
                
                Log::info("Executing concat command: " . $command);
                $output = [];
                exec($command, $output, $returnCode);
                
                if ($returnCode !== 0) {
                    Log::error("FFmpeg concatenation failed: " . implode("\n", $output));
                    throw new \Exception("Failed to concatenate segments");
                }

                // Fix 8: Create GIF with better parameters
                $command = sprintf(
                    'ffmpeg -i %s -vf "fps=10,scale=320:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" -loop 0 -y %s 2>&1',
                    escapeshellarg($concatenated_file),
                    escapeshellarg($output_gif)
                );
                
                Log::info("Executing GIF command: " . $command);
                $output = [];
                exec($command, $output, $returnCode);
                
                if ($returnCode !== 0) {
                    Log::error("FFmpeg GIF creation failed: " . implode("\n", $output));
                    throw new \Exception("Failed to create GIF");
                }

                // Fix 9: Verify GIF was created
                if (!file_exists($output_gif)) {
                    throw new \Exception("GIF file was not created: " . $output_gif);
                }

                $gifSize = filesize($output_gif);
                if ($gifSize === 0) {
                    throw new \Exception("GIF file is empty: " . $output_gif);
                }

                Log::info("GIF created successfully! Size: " . $gifSize . " bytes");

                // Fix 10: Clean up temporary files
                foreach ($tempFiles as $tempFile) {
                    if (file_exists($tempFile)) {
                        unlink($tempFile);
                    }
                }

                $videoDetails->update(['is_gif' => 1]);
                Log::info('GIF created and database updated successfully!');

            } catch (\Exception $exception) {
                Log::error('ERROR processing video ID ' . $videoDetails->id . ': ' . $exception->getMessage());
                
                // Clean up any temporary files that might have been created
                $tempFiles = ['segment0.mp4', 'segment1.mp4', 'segment2.mp4', 'concat_list.txt', 'concatenated.mp4'];
                foreach ($tempFiles as $tempFile) {
                    if (file_exists($tempFile)) {
                        unlink($tempFile);
                    }
                }
            }
        });
        
        Log::info('FINISHED');
        
        return response()->json([
            'message' => 'GIF creation process completed',
            'processed_count' => $getNotConvertedVideos->count()
        ]);
    }
}


if (!function_exists('createGifShort')) {
  function createGifShort($id)
    {
        Log::info('STARTED');

        $getNotConvertedVideos = ShortVideo::where('id', $id)->where('is_gif', 0)->orderBy('id','desc')->get();

        $getNotConvertedVideos->map(function ($videoDetails) {
            Log::info('Processing video: ' . $videoDetails->video);
            
            try {
                // Fix 1: Use the actual file path, not asset() for local files
                $input_video = public_path($videoDetails->video);
                
                // Fix 2: Better path handling
                $videoPathInfo = pathinfo($videoDetails->video);
                $output_gif = public_path('videos/GIF/') . $videoPathInfo['filename'] . '.gif';
                
                // Fix 3: Create GIF directory if it doesn't exist
                $gifDir = public_path('videos/GIF/');
                if (!file_exists($gifDir)) {
                    mkdir($gifDir, 0755, true);
                }

                Log::info("Input video path: " . $input_video);
                Log::info("Output GIF path: " . $output_gif);

                // Fix 4: Check if input file exists
                if (!file_exists($input_video)) {
                    Log::warning("Input video file not found: " . $input_video);
                    
                    // Try using videoUrl if local file doesn't exist
                    if (!empty($videoDetails->videoUrl)) {
                        $input_video = $videoDetails->videoUrl;
                        Log::info("Using videoUrl instead: " . $input_video);
                    } else {
                        Log::error("No valid video source found for video ID: " . $videoDetails->id);
                        return;
                    }
                }

                $segments = [
                    ['start' => 10, 'duration' => 2],
                    ['start' => 45, 'duration' => 2],
                    ['start' => 61, 'duration' => 1]
                ];

                $tempFiles = [];

                // Fix 5: Create segments with better error handling
                foreach ($segments as $index => $segment) {
                    $segment_file = "segment{$index}.mp4";
                    $tempFiles[] = $segment_file;
                    
                    $command = sprintf(
                        'ffmpeg -ss %d -t %d -i %s -c copy -an %s 2>&1',
                        $segment['start'],
                        $segment['duration'],
                        escapeshellarg($input_video),
                        escapeshellarg($segment_file)
                    );
                    
                    Log::info("Executing segment command: " . $command);
                    $output = [];
                    exec($command, $output, $returnCode);
                    
                    if ($returnCode !== 0) {
                        Log::error("FFmpeg segment creation failed: " . implode("\n", $output));
                        throw new \Exception("Failed to create segment {$index}");
                    }
                    
                    // Check if segment file was created
                    if (!file_exists($segment_file)) {
                        throw new \Exception("Segment file not created: {$segment_file}");
                    }
                }

                // Fix 6: Create concat list
                $concat_list = "concat_list.txt";
                $tempFiles[] = $concat_list;
                
                $concat_content = implode("\n", array_map(function ($index) {
                    return "file 'segment{$index}.mp4'";
                }, array_keys($segments)));
                
                file_put_contents($concat_list, $concat_content);

                // Fix 7: Concatenate segments
                $concatenated_file = 'concatenated.mp4';
                $tempFiles[] = $concatenated_file;
                
                $command = sprintf(
                    'ffmpeg -f concat -safe 0 -i %s -c copy %s 2>&1',
                    escapeshellarg($concat_list),
                    escapeshellarg($concatenated_file)
                );
                
                Log::info("Executing concat command: " . $command);
                $output = [];
                exec($command, $output, $returnCode);
                
                if ($returnCode !== 0) {
                    Log::error("FFmpeg concatenation failed: " . implode("\n", $output));
                    throw new \Exception("Failed to concatenate segments");
                }

                // Fix 8: Create GIF with better parameters
                $command = sprintf(
                    'ffmpeg -i %s -vf "fps=10,scale=320:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" -loop 0 -y %s 2>&1',
                    escapeshellarg($concatenated_file),
                    escapeshellarg($output_gif)
                );
                
                Log::info("Executing GIF command: " . $command);
                $output = [];
                exec($command, $output, $returnCode);
                
                if ($returnCode !== 0) {
                    Log::error("FFmpeg GIF creation failed: " . implode("\n", $output));
                    throw new \Exception("Failed to create GIF");
                }

                // Fix 9: Verify GIF was created
                if (!file_exists($output_gif)) {
                    throw new \Exception("GIF file was not created: " . $output_gif);
                }

                $gifSize = filesize($output_gif);
                if ($gifSize === 0) {
                    throw new \Exception("GIF file is empty: " . $output_gif);
                }

                Log::info("GIF created successfully! Size: " . $gifSize . " bytes");

                // Fix 10: Clean up temporary files
                foreach ($tempFiles as $tempFile) {
                    if (file_exists($tempFile)) {
                        unlink($tempFile);
                    }
                }

                $videoDetails->update(['is_gif' => 1]);
                Log::info('GIF created and database updated successfully!');

            } catch (\Exception $exception) {
                Log::error('ERROR processing video ID ' . $videoDetails->id . ': ' . $exception->getMessage());
                
                // Clean up any temporary files that might have been created
                $tempFiles = ['segment0.mp4', 'segment1.mp4', 'segment2.mp4', 'concat_list.txt', 'concatenated.mp4'];
                foreach ($tempFiles as $tempFile) {
                    if (file_exists($tempFile)) {
                        unlink($tempFile);
                    }
                }
            }
        });
        
        Log::info('FINISHED');
        
        return response()->json([
            'message' => 'GIF creation process completed',
            'processed_count' => $getNotConvertedVideos->count()
        ]);
    }
}




