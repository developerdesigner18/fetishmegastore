<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Request;

class Video extends Model
{
    use HasFactory;

    public $appends = ['videoUrl', 'videoUrl360p', 'canBePlayed', 'canDownload', 'isCurrentSubscriber', 'isCurrentPurchased','isUserFavorite', 'categoryNames', 'selectedCategory', 'selectedModel', 'modelNames', 'videoGIF', 'Str360', 'StrGIF', 'videoName', 'fullVideoLink', 'selectedTags', 'seoDetails'];
    // public $with = ['category'];
    protected $fillable = [
        'title',
        'price',
        'free_for_subs',
        'thumbnail',
        'video',
        'disk',
        'category_id',
        'model_id',
        'is_converted',
        'is_gif',
        'is_from_ftp',
        'tags',
        'type',
        'slug',
        'description',
        'seo'
    ];

    // protected $casts = [
    //     'title' => 'array',
    //     'description' => 'array',
    // ];

    public function streamer()
    {
        return $this->belongsTo(User::class, 'user_id');
    }


    public function isPurchasedBy($userId)
    {
        return DB::table('video_sales')
            ->where('video_id', $this->id)
            ->where('user_id', $userId)
            ->exists();
    }

    protected function thumbnail(): Attribute
    {
        return Attribute::make(
            get: function ($value) {
                // If value is empty, return null or a default image
                if (empty($value)) {
                    return null;
                }

                // If it's already a full URL, return as is
                if (Str::startsWith($value, ['http://', 'https://'])) {
                    return $value;
                }

                // Check if file exists in local storage
                $localPath = public_path($value);
                if (File::exists($localPath)) {
                    return asset($value);
                }



                // If not found locally, return the CDN URL
                return env('BUNNY_CDN') . $value;
            }
        );
    }



    protected function getVideoNameAttribute()
    {
        $og = DB::table('videos')->where('id', $this->id)->first();
        if ($og->video == null) {
            $video = public_path('/videos/default/dummy.mp4'); 
        } else {
            $video = $og->video; 
        }
        return explode('/', $video)[1];
    }

    protected function getVideoUrlAttribute()
    {
        // If video path is empty, return null
        if (empty($this->video)) {
            return null;
        }

        // Check if file exists in local storage
        $localPath = public_path(basename(asset($this->video)));
        if (File::exists($localPath)) {
            return asset($this->video);
        }

        // If not found locally, return the signed Bunny CDN URL
        return $this->sign_bcdn_url(
            env('BUNNY_CDN') . $this->video, // Url to sign
            "bbfa5578-3c9e-4d90-a455d9751d95-2c6c-44d4", // Token Key
            10800, // Expiration time in seconds
            request()->ip(), // Place user IP here
            false, // Directory token
            "/"
        );
    }

    protected function getvideoUrl360pAttribute()
    {

        $videoName = explode('/', $this->video)[1] ?? explode('/', $this->video)[0];
//
//        $checkFIleExist = File::exists(public_path('videos/360/'.$videoName));
//
//        if($checkFIleExist){
//            return asset('videos/360/'.$videoName);
//        }else{
//            return asset('videos/'.$videoName);
//        }

//        return env('BUNNY_CDN').'videos/360/'.$videoName;

//        PROTECT BY GENERATING BUNNY AUTH

        return $this->sign_bcdn_url(
            env('BUNNY_CDN') . 'videos/360/' . $videoName, // Url to sign
            "bbfa5578-3c9e-4d90-a455d9751d95-2c6c-44d4", // Token Key
            10800, // Expiration time in seconds
            request()->ip(), // Place user IP here
            false, // Directory token
            "/");
    }

    function sign_bcdn_url($url, $securityKey, $expiration_time = 10800, $user_ip = NULL, $is_directory_token = false, $path_allowed = NULL, $countries_allowed = NULL, $countries_blocked = NULL, $referers_allowed = NULL)
    {
        if (!is_null($countries_allowed)) {
            $url .= (parse_url($url, PHP_URL_QUERY) == "") ? "?" : "&";
            $url .= "token_countries={$countries_allowed}";
        }
        if (!is_null($countries_blocked)) {
            $url .= (parse_url($url, PHP_URL_QUERY) == "") ? "?" : "&";
            $url .= "token_countries_blocked={$countries_blocked}";
        }
        if (!is_null($referers_allowed)) {
            $url .= (parse_url($url, PHP_URL_QUERY) == "") ? "?" : "&";
            $url .= "token_referer={$referers_allowed}";
        }

        $url_scheme = parse_url($url, PHP_URL_SCHEME);
        $url_host = parse_url($url, PHP_URL_HOST);
        $url_path = parse_url($url, PHP_URL_PATH);
        $url_query = parse_url($url, PHP_URL_QUERY);


        $parameters = array();
        parse_str($url_query, $parameters);

        // Check if the path is specified and ovewrite the default
        $signature_path = $url_path;

        if (!is_null($path_allowed)) {
            $signature_path = $path_allowed;
            $parameters["token_path"] = $signature_path;
        }

        // Expiration time
        $expires = time() + $expiration_time; // IN SECONDS

        // Construct the parameter data
        ksort($parameters); // Sort alphabetically, very important
        $parameter_data = "";
        $parameter_data_url = "";
        if (sizeof($parameters) > 0) {
            foreach ($parameters as $key => $value) {
                if (strlen($parameter_data) > 0)
                    $parameter_data .= "&";

                $parameter_data_url .= "&";

                $parameter_data .= "{$key}=" . $value;
                $parameter_data_url .= "{$key}=" . urlencode($value); // URL encode everything but slashes for the URL data
            }
        }

        // Generate the toke
        $hashableBase = $securityKey . $signature_path . $expires;

        // If using IP validation
        if (!is_null($user_ip)) {
            $hashableBase .= $user_ip;
        }

        $hashableBase .= $parameter_data;

        // Generate the token
        $token = hash('sha256', $hashableBase, true);
        $token = base64_encode($token);
        $token = strtr($token, '+/', '-_');
        $token = str_replace('=', '', $token);

        if ($is_directory_token) {
            return "{$url_scheme}://{$url_host}/bcdn_token={$token}&expires={$expires}{$parameter_data_url}{$url_path}";
        } else {
            return "{$url_scheme}://{$url_host}{$url_path}?token={$token}{$parameter_data_url}&expires={$expires}";
        }
    }

    protected function getvideoGIFAttribute()
    {
        // If video path is empty, return null
        if (empty($this->video)) {
            return null;
        }

        // Get the original video path
        $videoPath = $this->video;
        
        // Remove query parameters if present (signed URLs)
        if (str_contains($videoPath, '?')) {
            $videoPath = strtok($videoPath, '?');
        }
        
        // Extract base filename and change extension to .gif
        $videoName = basename($videoPath);
        $gifName = pathinfo($videoName, PATHINFO_FILENAME) . '.gif';
        
        // First check if GIF exists locally
        $localGifPath = public_path('videos/GIF/' . $gifName);
        if (File::exists($localGifPath)) {
            return asset('videos/GIF/' . $gifName);
        }
        
        // Fallback to Bunny CDN
        $bunnyGifUrl = env('BUNNY_CDN') . 'videos/GIF/' . $gifName;
        
        // Optional: Check if file exists on Bunny CDN (you might want to remove this in production)
        // as it can be slow. For now, we'll return the URL and let frontend handle missing files.
        
        return $bunnyGifUrl;
    }



//   protected function getVideoGIFAttribute()
// {
//     if ($this->is_gif != 1) {
//         return null;
//     }

//     if (empty($this->video)) {
//         return null;
//     }

//     $rawVideo = $this->getRawOriginal('video');

//     if (str_contains($rawVideo, '?')) {
//         $rawVideo = strtok($rawVideo, '?');
//     }

//     $bunnyPrefix = rtrim(env('BUNNY_CDN'), '/');
//     if (str_starts_with($rawVideo, $bunnyPrefix)) {
//         $rawVideo = str_replace($bunnyPrefix, '', $rawVideo);
//     }

//     $filename = pathinfo($rawVideo, PATHINFO_FILENAME);
//     return rtrim(env('BUNNY_CDN'), '/') . '/videos/GIF/' . $filename . '.gif';
// }



    protected function getStr360Attribute()
    {
        $videoName = explode('/', $this->video)[1] ?? explode('/', $this->video)[0];

        return 'videos/360/' . $videoName;

    }

    protected function getStrGIFAttribute()
    {
        $videoName = explode('.', explode('/', $this->video)[1] ?? explode('/', $this->video)[0])[0] . '.gif';

        return 'videos/GIF/' . $videoName;
    }

//    // slug attribute
//    public function getSlugAttribute($slug)
//    {
//        return $slug;
////        return DB::table('videos')->find($this->id)->slug;
////        return Str::slug($this->title);
//    }

    public function sales()
    {
        return $this->hasMany(VideoSales::class);
    }

//    public function category()
//    {
//        return $this->belongsTo(VideoCategories::class);
//    }

    public function model()
    {
        return $this->belongsTo(Models::class);
    }


    public function getCanBePlayedAttribute()
    {
        // if video is free, allow anyone to view
        if ($this->price === 0) {
            return true;
        }

        // if video owner, allow to view his own vid
        if (auth()->id() == $this->user_id) {
            return true;
        }

        // if it's free for subscribers and current user is one of them
        if (auth()->check() && $this->free_for_subs == "yes" && auth()->user()->hasSubscriptionTo($this->streamer)) {
            return true;
        }

        // if there's an order for this video
        if (auth()->check()) {
            return $this->sales()
                ->where('video_id', $this->id)
                ->where('user_id', auth()->id())
                ->exists();
        }


        return false;
    }

    public function getCanDownloadAttribute()
    {
        // if video is free, allow anyone to view
        if ($this->price === 0) {
            return true;
        }

        // if video owner, allow to view his own vid
        if (auth()->id() == $this->user_id) {
            return true;
        }

        // if it's free for subscribers and current user is one of them
//         no need for subscription
//        if (auth()->check() && $this->free_for_subs == "yes" && auth()->user()->hasSubscriptionTo($this->streamer)) {
//            return true;
//        }

        // if there's an order for this video
        if (auth()->check()) {
            return $this->sales()
                ->where('video_id', $this->id)
                ->where('user_id', auth()->id())
                ->exists();
        }


        return false;
    }

    public function gettitleEnAttribute()
    {
        $ogValue = DB::table('videos')->find($this->id);
        $isJson = Str::isJson($ogValue->title);

        if (!$isJson) {
            return $ogValue->title;
        }

        if (Request::segment(1) === 'en' && Request::segment(2) === 'edit-video' || Request::segment(1) === 'edit-video') {
            // Agar yeh Edit Page hai, toh poora array wapas bhejo
            return $ogValue->title;
        }

        if (Request::segment(2) === 'videos' && Request::segment(3) === 'edit') {
            // Admin Edit Page: poora array waapis bhejo
            return $ogValue->title;
        }

        $decodedValue = json_decode($ogValue->title);

        return $decodedValue->en;
    }

    public function getTitleDeAttribute()
    {
        $title = $this->attributes['title'] ?? null;

        if (!$title) {
            return null;
        }

        if (Request::segment(1) === 'en' && Request::segment(2) === 'edit-video' || Request::segment(1) === 'edit-video') {
            // Agar yeh Edit Page hai, toh poora array wapas bhejo
            return $title;
        }

        if (Request::segment(2) === 'videos' && Request::segment(3) === 'edit') {
            // Admin Edit Page: poora array waapis bhejo
            return $title;
        }

        if (!Str::isJson($title)) {
            return $title;
        }

        $decodedValue = json_decode($title, true);

        return $decodedValue['de'] ?? null;
    }


    public function getcategoryNamesAttribute()
    {

        if (!$this->category_id) {
            return '';
        }

        $category = VideoCategories::whereIn('id', $this->category_id)->pluck('category')->toArray();

        return implode(',', $category);
    }

    public function getmodelNamesAttribute()
    {

        if (!$this->model_id) {
            return '';
        }

        $category = Models::whereIn('id', $this->model_id)->pluck('name')->toArray();


        return implode(',', $category);
    }

    public function getdescriptionEnAttribute()
    {
        $ogValue = DB::table('videos')->find($this->id);

        // $isJson = Str::isJson($ogValue->description);

        // if (!$isJson) {
        //     return $ogValue->description;
        // }

        // $decodedValue = json_decode($ogValue->description);

        // return $decodedValue->en;
        $isJson = Str::isJson($ogValue->description);

        if (!$isJson) {
            return $ogValue->description;
        }
        if (Request::segment(1) === 'en' && Request::segment(2) === 'edit-video' || Request::segment(1) === 'edit-video') {
            // Agar yeh Edit Page hai, toh poora array wapas bhejo
            return $ogValue->description;
        }

        if (Request::segment(2) === 'videos' && Request::segment(3) === 'edit') {
            // Admin Edit Page: poora array waapis bhejo
            return $ogValue->description;
        }

        $decodedValue = json_decode($ogValue->description);

        return $decodedValue->en;
    }

    public function getdescriptionDeAttribute()
    {
        $ogValue = DB::table('videos')->find($this->id);
        $isJson = Str::isJson($ogValue->description);

        if (!$isJson) {
            return $ogValue->description;
        }

       $decodedValue = json_decode($ogValue->description, true);

       return $decodedValue['de'] ?? null;
    }

    public function getisCurrentSubscriberAttribute()
    {

        // if it's free for subscribers and current user is one of them
        if (auth()->check() && auth()->user()->hasSubscriptionTo($this->streamer)) {
            return true;
        }

        return false;
    }

    public function getisUserFavoriteAttribute()
    {

        if (auth()->check()) {
            $isFavorite = UserFavVideo::where('user_id', auth()->user()->id)->where('video_id', $this->id)->exists();

            return $isFavorite;
        }

        return false;


    }

    public function getisCurrentPurchasedAttribute()
    {

        // if it's free for subscribers and current user is one of them
        if (auth()->check() && auth()->user()->hasSubscriptionTo($this->streamer)) {
            return true;
        }

        return false;
    }

    public function getTagsAttribute($tags)
    {
        if (is_array($tags)) return $tags;
        if (!$tags) {
            return [];
        }
        return explode(',', $tags);
    }

    public function getCategoryIdAttribute($category_id)
    {
        if (!$category_id) {
            return null;
        }
        return explode(',', $category_id);
    }

    public function getModelIdAttribute($model_id)
    {
        if (!$model_id) {
            return [];
        }
        return explode(',', $model_id);
    }

    public function getselectedCategoryAttribute()
    {
        if (!$this->category_id) {
            return [];
        }

        $category = VideoCategories::whereIn('id', $this->category_id)->get();

        $array = [];
        foreach ($category as $categoryDetails) {
            $array[] = ['label' => $categoryDetails->category, 'value' => $categoryDetails->id];
        }

        return $array;
    }

    public function getselectedModelAttribute()
    {
        if (!$this->model_id) {
            return [];
        }

        $category = Models::whereIn('id', $this->model_id)->get();

        $array = [];
        foreach ($category as $categoryDetails) {
            $array[] = ['label' => $categoryDetails->name, 'value' => $categoryDetails->id];
        }

        return $array;
    }

    public function gettitleAttribute($title)
    {
        if (Request::segment(1) === 'en' && Request::segment(2) === 'edit-video' || Request::segment(1) === 'edit-video') {
            // Agar yeh Edit Page hai, toh poora array wapas bhejo
            return $title;
        }

        if (Request::segment(2) === 'videos' && Request::segment(3) === 'edit') {
            // Admin Edit Page: poora array waapis bhejo
            return $title;
        }

        // $isJson = Str::isJson($title);

        // if (!$isJson) {
        //     return $title;
        // }

        // $decodedValue = json_decode($title);

        // $decodedValue1 = json_decode($decodedValue);
        // prd(gettype($decodedValue));


        // $currentLocale = App::currentLocale();
        // // prd($currentLocale);

        // // return $isJson === true ? $decodedValue1->$currentLocale ?? $decodedValue1->en : $title;
        // return $decodedValue1->$currentLocale ?? $decodedValue1->en;
              if (is_string($title) && Str::isJson($title)) {
            $title = json_decode($title, true); // `true` se array banega
        }


        // Step 3: Agar value abhi bhi array nahi hai, to fallback
        // if (!is_array($title)) {
        //     return $title;
        // }

        // Step 4: Current language (locale) ke hisaab se value nikalo
        $currentLocale = App::currentLocale();
        // prd($title);
        return $title[$currentLocale] ?? $title['en'] ?? $title;

    }
    // public function gettitleAttribute($title)
    // {
    //     if (Request::segment(1) === 'en' && Request::segment(2) === 'edit-video' || Request::segment(1) === 'edit-video') {
    //         // Agar yeh Edit Page hai, toh poora array wapas bhejo
    //         return $title;
    //     }

    //     if (Request::segment(2) === 'videos' && Request::segment(3) === 'edit') {
    //         // Admin Edit Page: poora array waapis bhejo
    //         return $title;
    //     }

    //     $isJson = Str::isJson($title);

    //     if (!$isJson) {
    //         return $title;
    //     }

    //     $decodedValue = json_decode($title);

    //     $currentLocale = App::currentLocale();
    //     // dd($decodedValue->$currentLocale, $currentLocale );

    //     return $isJson === true ? $decodedValue->$currentLocale ?? $decodedValue->en : $title;

    // }

    public function getdescriptionAttribute($description)
    {


        $isJson = Str::isJson($description);

        if (!$isJson) {
            return $description;
        }

        if (Request::segment(1) === 'en' && Request::segment(2) === 'edit-video' || Request::segment(1) === 'edit-video' ) {
            // Agar yeh Edit Page hai, toh poora array wapas bhejo
            return $description;
        }

        if (Request::segment(2) === 'videos' && Request::segment(3) === 'edit') {
            // Admin Edit Page: poora array waapis bhejo
            return $description;
        }

        $decodedValue = json_decode($description);

        $currentLocale = App::currentLocale();

        //  return $decodedValue->$currentLocale ?? $description;
        return $decodedValue->$currentLocale ?? '';
    }

    public function getDurationAttribute()
    {
        // $videoUrl = explode('?', $this->videoUrl)[0];  // Bunny CDN URL
        if ($this->videoUrl == null) {
            $videoUrl = public_path('/videos/default/dummy.mp4'); 
        } else {
            $videoUrl = strtok($this->videoUrl[0], ''); 
        }

        // Fetch metadata via FFmpeg command
        $ffmpegCommand = "ffmpeg -i $videoUrl 2>&1";
        // dd($ffmpegCommand);
        if (function_exists('shell_exec')) {
            $output = shell_exec($ffmpegCommand);
        } else {
            $output = '';
        }

        // Extracting metadata from the output
        if (preg_match('/Duration: (\d{2}):(\d{2}):(\d{2})\.\d{2}/', $output, $matches)) {
            $hours = $matches[1];
            $minutes = $matches[2];
            $seconds = $matches[3];
            $duration_seconds = $hours * 3600 + $minutes * 60 + $seconds;
        } else {
            $duration_seconds = 'N/A';
        }

        // Extracting resolution
        if (preg_match('/, (\d{3,4})x(\d{3,4})/', $output, $matches)) {
            $xResolution = $matches[1];
            $yResolution = $matches[2];
        } else {
            $xResolution = 'N/A';
            $yResolution = 'N/A';
        }

        // Get resolution name based on extracted dimensions
        $resolution = $this->getResolutionName($xResolution, $yResolution);

        $data = [
            'minute' => $duration_seconds != 'N/A' ? gmdate("H:i:s", $duration_seconds) : 'N/A',
            'seconds' => $duration_seconds,
            'x' => $xResolution,
            'y' => $yResolution,
            'resolution' => $resolution
        ];

        return $data;

    }

    function getResolutionName($x, $y)
    {
        // Define the aspect ratios and resolutions for different resolutions
        $resolutions = [
            '720p' => [
                '0.80 (4:5)' => ['width' => 576, 'height' => 720],
                '1.25 (5:4)' => ['width' => 900, 'height' => 720],
                '1.33 (4:3)' => ['width' => 960, 'height' => 720],
                '1.66 (5:3)' => ['width' => 1200, 'height' => 720],
                '1.78 (16:9)' => ['width' => 1280, 'height' => 720],
                '1.85' => ['width' => 1280, 'height' => 692],
                '1.90' => ['width' => 1280, 'height' => 674],
                '2.00' => ['width' => 1280, 'height' => 640],
                '2.35' => ['width' => 1280, 'height' => 544],
                '2.37' => ['width' => 1280, 'height' => 540],
                '2.39' => ['width' => 1280, 'height' => 536],
                '2.40' => ['width' => 1280, 'height' => 532],
                '2.44' => ['width' => 1280, 'height' => 524],
            ],
            '1080p' => [
                '0.80 (4:5)' => ['width' => 864, 'height' => 1080],
                '1.25 (5:4)' => ['width' => 1350, 'height' => 1080],
                '1.33 (4:3)' => ['width' => 1440, 'height' => 1080],
                '1.66 (5:3)' => ['width' => 1800, 'height' => 1080],
                '1.78 (16:9)' => ['width' => 1920, 'height' => 1080],
                '1.85' => ['width' => 1920, 'height' => 1038],
                '1.90' => ['width' => 1920, 'height' => 1010],
                '2.00' => ['width' => 1920, 'height' => 960],
                '2.35' => ['width' => 1920, 'height' => 816],
                '2.37' => ['width' => 1920, 'height' => 810],
                '2.39' => ['width' => 1920, 'height' => 802],
                '2.40' => ['width' => 1920, 'height' => 800],
                '2.44' => ['width' => 1920, 'height' => 786],
            ],
            // Add more resolutions here if needed
        ];

        // Check if the input resolution matches any of the defined resolutions
        foreach ($resolutions as $resolution_name => $resolution) {
            foreach ($resolution as $aspect_ratio => $details) {
                if ($details['width'] == $x && $details['height'] == $y) {
                    return $resolution_name;
                }
            }
        }

        return "$x X $y";
    }

    public function getfullVideoLinkAttribute()
    {
        if (!$this->id) {
            return [];
        }

        $category = Video::select('id', 'title')->where('id', $this->id)->first();

        $array = [];

        return ['label' => $category->title, 'value' => $category->id];

    }

    public function getselectedTagsAttribute()
    {
        if (!$this->tags) {
            return [];
        }
        return array_values($this->tags);
//        $category = Tag::whereRaw("JSON_UNQUOTE(JSON_EXTRACT(name, '$.en')) IN (?)", [implode(',', array_values($this->tags))])->get();
//
//        $array = [];
//        foreach ($category as $categoryDetails) {
//            $array[] = ['label' => $categoryDetails->name, 'value' => $categoryDetails->name];
//        }
//
//        return $array;
    }

    public function getseoDetailsAttribute()
    {
        if (!$this->seo) {
            return [];
        }

        return json_decode($this->seo);

    }

    public static function RandomViews()
    {
        $min = 2500;
        $max = 4000;
        $newRandomViews = mt_rand($min, $max);
        return $newRandomViews;
    }
}
