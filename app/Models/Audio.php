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

/**
 * App\Event
 * @property mixed $slug
 * @method static \Illuminate\Database\Eloquent\Builder|Event whereSlug($value)
 */

class Audio extends Model
{
    use HasFactory;

    public $appends = ['categoryNames','audioUrl','videoUrl360p', 'slug', 'canBePlayed','canDownload','isCurrentSubscriber','isCurrentPurchased','title_en','description_en','seoDeatils'];
    // public $with = ['category'];

    protected $fillable = [
        'title',
        'title_en',
        'price',
        'audio_file',
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
        'slug',
        'description',
        'seo'
    ];

    protected $casts = [
        'title' => 'array',
        'description' => 'array',
    ];

    public function getseoDeatilsAttribute()
    {
        if (!$this->seo) {
            return [];
        }

        return json_decode($this->seo);

    }

    public function streamer()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function sales()
    {
        return $this->hasMany(AudioSales::class);
    }

    public function getSelectedCategoryAttribute()
    {
        if (!$this->category_id) {
            return [];
        }

        if (Request::segment(1) === 'en' && Request::segment(2) === 'edit-audio' || Request::segment(1) === 'edit-audio' ) {
            // Agar yeh Edit Page hai, toh poora array wapas bhejo
            return $this->category_id;
        }
        $categories = VideoCategories::whereIn('id', $this->category_id)->get();
    
        return $categories->map(function($category) {
            return ['label' => $category->category, 'value' => $category->id];
        });
    }

    public function getSelectedModelAttribute()
    {
        if (!$this->model_id) {
            return [];
        }
  
        if (Request::segment(1) === 'en' && Request::segment(2) === 'edit-audio' || Request::segment(1) === 'edit-audio' ) {
            // Agar yeh Edit Page hai, toh poora array wapas bhejo
            return $this->model_id;
        }

        $models = Models::whereIn('id', $this->model_id)->get();

        return $models->map(function($model) {
            return ['label' => $model->name, 'value' => $model->id];
        });
    }

    function sign_bcdn_url($url, $securityKey, $expiration_time = 10800, $user_ip = NULL, $is_directory_token = false, $path_allowed = NULL, $countries_allowed = NULL, $countries_blocked = NULL, $referers_allowed = NULL)
    {
        if(!is_null($countries_allowed))
        {
            $url .= (parse_url($url, PHP_URL_QUERY) == "") ? "?" : "&";
            $url .= "token_countries={$countries_allowed}";
        }
        if(!is_null($countries_blocked))
        {
            $url .= (parse_url($url, PHP_URL_QUERY) == "") ? "?" : "&";
            $url .= "token_countries_blocked={$countries_blocked}";
        }
        if(!is_null($referers_allowed))
        {
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

        if(!is_null($path_allowed))
        {
            $signature_path = $path_allowed;
            $parameters["token_path"] = $signature_path;
        }

        // Expiration time
        $expires = time() + $expiration_time; // IN SECONDS

        // Construct the parameter data
        ksort($parameters); // Sort alphabetically, very important
        $parameter_data = "";
        $parameter_data_url = "";
        if(sizeof($parameters) > 0)
        {
            foreach ($parameters as $key => $value)
            {
                if(strlen($parameter_data) > 0)
                    $parameter_data .= "&";

                $parameter_data_url .= "&";

                $parameter_data .= "{$key}=" . $value;
                $parameter_data_url .= "{$key}=" . urlencode($value); // URL encode everything but slashes for the URL data
            }
        }

        // Generate the toke
        $hashableBase = $securityKey.$signature_path.$expires;

        // If using IP validation
        if(!is_null($user_ip))
        {
            $hashableBase .= $user_ip;
        }

        $hashableBase .= $parameter_data;

        // Generate the token
        $token = hash('sha256', $hashableBase, true);
        $token = base64_encode($token);
        $token = strtr($token, '+/', '-_');
        $token = str_replace('=', '', $token);

        if($is_directory_token)
        {
            return "{$url_scheme}://{$url_host}/bcdn_token={$token}&expires={$expires}{$parameter_data_url}{$url_path}";
        }
        else
        {
            return "{$url_scheme}://{$url_host}{$url_path}?token={$token}{$parameter_data_url}&expires={$expires}";
        }
    }

    protected function getvideoUrl360pAttribute()
    {
        $originalAudioPath = $this->getOriginal('audio');

        // HINGLISH COMMENT: Yahan bhi safety check lagao
        if (empty($originalAudioPath)) {
            return null;
        }

        // $videoName = explode('/',$this->audio)[1] ?? explode('/',$this->audio)[0];

        // $checkFIleExist = File::exists(public_path('videos/360/'.$videoName));

        //  if($checkFIleExist){
        //      return asset('videos/360/'.$videoName);
        //  }else{
        //      return asset('videos/'.$videoName);
        //  }

        //  return env('BUNNY_CDN').'videos/360/'.$videoName;

        //  PROTECT BY GENERATING BUNNY AUTH

        $videoName = last(explode('/', $originalAudioPath));

        return $this->sign_bcdn_url(
            env('BUNNY_CDN').'videos/360/'.$videoName,
            "bbfa5578-3c9e-4d90-a455d9751d95-2c6c-44d4",
            10800,
            request()->ip(),
            false,
            "/"
        );
        // return $this->sign_bcdn_url(
        //     env('BUNNY_CDN').'videos/360/'.$videoName, // Url to sign
        //     "bbfa5578-3c9e-4d90-a455d9751d95-2c6c-44d4", // Token Key
        //     10800, // Expiration time in seconds
        //     request()->ip(), // Place user IP here
        //     false, // Directory token
        //     "/");
    }

    public function getSlugAttribute()
    {
        return Str::slug($this->title);
    }

    public function getCanBePlayedAttribute()
    {
        if ($this->price === 0) {
            return true;
        }
        if (auth()->id() == $this->user_id) {
            return true;
        }
        if (auth()->check() && $this->free_for_subs == "yes" && auth()->user()->hasSubscriptionTo($this->streamer)) {
            return true;
        }
        if (auth()->check() && $this->sales()->where('audio_id', $this->id)->where('user_id', auth()->id())->exists()) {
            return true;
        }
        return false;
    }

    public function getCanDownloadAttribute()
    {
        // Check if the video is free for everyone
        if ($this->price === 0) {
            return true;
        }

        // Check if the video owner can download
        if (auth()->id() == $this->user_id) {
            return true;
        }

        // Check if the current user has purchased the video/audio
        if (auth()->check() && $this->sales()->where('audio_id', $this->id)->where('user_id', auth()->id())->exists()) {
            return true;
        }

        return false;
    }

    public function getisCurrentSubscriberAttribute()
    {
        // if it's free for subscribers and current user is one of them
        if (auth()->check() && auth()->user()->hasSubscriptionTo($this->streamer)) {
            return true;
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

    public function gettitleEnAttribute(){
        $ogValue = DB::table('audio')->find($this->id);

        // Agar title hi null hai, toh khaali string bhejein
        if (empty($ogValue->title) || !Str::isJson($ogValue->title)) {
            return $ogValue->title ?? ''; // Agar JSON nahi hai, toh jaisa hai waisa bhejein
        }

        // HINGLISH COMMENT: `true` add karne se yeh hamesha ek array banega
        $decodedValue = json_decode($ogValue->title, true);

        // HINGLISH COMMENT: Ab `?? ''` se check karein ki 'en' key hai ya nahi
        return $decodedValue['en'] ?? '';
    }

    public function gettitleDeAttribute(){
        $ogValue = DB::table('audio')->find($this->id);

        if (empty($ogValue->title) || !Str::isJson($ogValue->title)) {
            return ''; // Agar JSON nahi hai, toh German title hamesha khaali hoga
        }

        $decodedValue = json_decode($ogValue->title, true);

        return $decodedValue['de'] ?? ''; // Agar 'de' key nahi hai, toh khaali string bhejein
    }

    public function gettitleAttribute($title){
        $isJson = Str::isJson($title);

        if(!$isJson){
            return $title;
        }

        if (Request::segment(1) === 'en' && Request::segment(2) === 'edit-audio' || Request::segment(1) === 'edit-audio' ) {
            // Agar yeh Edit Page hai, toh poora array wapas bhejo
            return $title;
        }

        $decodedValue = json_decode($title);

        $currentLocale = App::currentLocale();

        return $isJson === true ? $decodedValue->$currentLocale ?? $decodedValue->en : $title;

    }

    public function getdescriptionEnAttribute(){
        $ogValue = DB::table('audio')->find($this->id);

        if (empty($ogValue->description) || !Str::isJson($ogValue->description)) {
            return $ogValue->description ?? '';
        }

        $decodedValue = json_decode($ogValue->description, true);

        return $decodedValue['en'] ?? '';
    }

    public function getdescriptionAttribute($description){
        $isJson = Str::isJson($description);

        if (Request::segment(1) === 'en' && Request::segment(2) === 'edit-audio' || Request::segment(1) === 'edit-audio' ) {
            // Agar yeh Edit Page hai, toh poora array wapas bhejo
            return $description;
        }

        if(!$isJson){
            return $description;
        }

        $decodedValue = json_decode($description);

        $currentLocale = App::currentLocale();

        // return $decodedValue->$currentLocale ?? $description;
        return $decodedValue->$currentLocale ?? '';
    }

    public function getdescriptionDeAttribute(){
        $ogValue = DB::table('audio')->find($this->id);

        if (empty($ogValue->description) || !Str::isJson($ogValue->description)) {
            return '';
        }

        $decodedValue = json_decode($ogValue->description, true);

        return $decodedValue['de'] ?? '';
    }

    private function getTitleTranslation($lang)
    {
        $ogValue = DB::table('audio')->find($this->id);

        if (!Str::isJson($ogValue->title)) {
            return $ogValue->title;  // Return original if it's not JSON
        }

        $decodedValue = json_decode($ogValue->title);
        return $decodedValue->$lang ?? $ogValue->title;
    }

    private function getDescriptionTranslation($lang)
    {
        $ogValue = DB::table('audio')->find($this->id);
        if (!Str::isJson($ogValue->description)) {
            return $ogValue->description;  // Return original if it's not JSON
        }

        $decodedValue = json_decode($ogValue->description);
        return $decodedValue->$lang ?? $ogValue->description;
    }

    // public function getcategoryNamesAttribute(){

    //     if(!$this->category_id){
    //         return '';
    //     }
    //     $category_id = explode(',', $this->category_id);
    //     $category = VideoCategories::whereIn('id',$category_id)->pluck('category')->toArray();

    //     return implode(',',$category);
    // }

    public function getcategoryNamesAttribute()
    {
        // HINGLISH COMMENT: `$this->getOriginal('category_id')` ka istemal karein
        // Yeh hamesha database se aayi hui original string value dega, 
        // chahe aapne koi aur accessor ya cast lagaya ho.
        $originalCategoryId = $this->getOriginal('category_id');

        if (empty($originalCategoryId)) {
            return '';
        }

        // Ab original value ke upar explode chalayein
        $category_id_array = explode(',', $originalCategoryId);

        $category = VideoCategories::whereIn('id', $category_id_array)->pluck('category')->toArray();

        return implode(',', $category);
    }

    protected function getAudioUrlAttribute()
    {
        $originalAudioPath = $this->getOriginal('audio');

        // HINGLISH COMMENT: Yahi hai safety check. Agar path hi nahi hai, toh aage mat badho.
        if (empty($originalAudioPath)) {
            return null;
        }

        // Agar path hai, tab hi URL generate karo
        return $this->sign_bcdn_url(
            env('BUNNY_CDN') . $originalAudioPath,
            "bbfa5578-3c9e-4d90-a455d9751d95-2c6c-44d4",
            10800,
            request()->ip(),
            false,
            "/"
        );
        // return $this->sign_bcdn_url(
        //     env('BUNNY_CDN').$this->audio, 
        //     "bbfa5578-3c9e-4d90-a455d9751d95-2c6c-44d4", // Token Key
        //     10800, // Expiration time in seconds
        //     request()->ip(), 
        //     false, 
        //     "/");
    }

    public function getDurationAttribute(){
        if ($this->audioUrl == null) {
            $audioUrl = public_path('/audio/default/abc-test-title.mp3'); 
        } else {
            $audioUrl = strtok($this->audioUrl[0], ''); 
        }
        // prd($this->audioUrl, $audioUrl);
        $ffmpegCommand = "ffmpeg -i $audioUrl 2>&1";
        if(function_exists('shell_exec')){
            $output = shell_exec($ffmpegCommand);
        }else{
            $output ='';
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

    public static function RandomViews()
    {
        $min = 2500;
        $max = 4000;
        $newRandomViews = mt_rand($min, $max);
        return $newRandomViews;
    }
}
