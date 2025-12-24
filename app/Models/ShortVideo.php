<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Request;

/**
 * App\Event
 * @property mixed $slug
 * @method static \Illuminate\Database\Eloquent\Builder|Event whereSlug($value)
*/
class ShortVideo extends Model
{
    use HasFactory;

    protected $table = 'short_videos';

    protected $appends = ['categoryNames', 'tagNames', 'modelNames', 'tagsDetails', 'categoryDetails', 'videoName', 'modelDetails', 'canBePlayed', 'title_en', 'title_de', 'description_en', 'description_de', 'selectedCategory', 'selectedModel', 'selectedTags', 'fullVideoLink', 'seoDeatils', 'videoGIF'];

    protected $fillable = [
        'user_id',
        'title',
        'price',
        'slug',
        'thumbnail',
        'video',
        'category_id',
        'model_id',
        'type',
        'video_id',
        'tags',
        'description',
        'seo'
    ];

    // protected $casts = [
    //     'title' => 'array',
    //     'description' => 'array',
    // ];


    protected function getvideoGIFAttribute()
{
    if (empty($this->video)) {
        return null;
    }

    // Get raw video path from database
    $rawVideo = $this->getRawOriginal('video');
    
    // Remove Bunny CDN prefix if present to get just the filename
    $bunnyPrefix = env('BUNNY_CDN');
    if (str_starts_with($rawVideo, $bunnyPrefix)) {
        $rawVideo = str_replace($bunnyPrefix, '', $rawVideo);
    }
    
    // Extract filename
    $filename = pathinfo($rawVideo, PATHINFO_FILENAME);
    $gifName = $filename . '.gif';
    
    $bunnyBase = rtrim(env('BUNNY_CDN', 'https://storage.fetishmegastore.com/'), '/');
    $bunnyGifUrl = $bunnyBase . '/videos/GIF/' . $gifName;
    
    return $bunnyGifUrl;
}


    public function getPreviewVideosAttribute($value)
    {
        return Str::startsWith($value, 'http') ? $value : asset($value);
    }

    public function getPromoCategoryNamesAttribute()
    {
        if (empty($this->category_id)) {
            return '';
        }
        $categoryIds = $this->category_id;
        if (is_string($categoryIds) && Str::startsWith($categoryIds, '[')) {
            $categoryIds = json_decode($categoryIds, true);
        }
        if (!is_array($categoryIds)) {
            $categoryIds = explode(',', $categoryIds);
        }
        $categories = VideoCategories::whereIn('id', $categoryIds)->pluck('category')->toArray();
        return implode(', ', $categories);
    }

    public function streamer()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    protected function thumbnail(): Attribute
    {
        return Attribute::make(
            get: fn($value) => Storage::disk('public')->url($value),
        );
    }

    protected function getVideoNameAttribute()
    {
        $og = DB::table('short_videos')->where('id', $this->id)->first();

        return explode('/', $og->video)[1] ?? $og->video;
    }

    protected function video(): Attribute
    {
        // TODO : need to make wit with the bunny direct
        return Attribute::make(
            get: fn($value) => env('BUNNY_CDN') . $value,
        );
        //  return Attribute::make(
        //      get: fn($value) => Storage::disk('public')->url($value),
        //  );
    }

    public function getCanBePlayedAttribute()
    {
        //  return true;
        //  dd($this->sales());

        // if video is free, allow anyone to view
        if ($this->price === 0) {
            return true;
        }

        // if video owner, allow to view his own vid
        if (auth()->id() == $this->user_id) {
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

    public function sales()
    {
        return $this->hasMany(PreviewSales::class, 'video_id', 'id');
    }

    public function gettitleAttribute($title)
    {
        if (Request::segment(1) === 'en' && Request::segment(2) === 'preview-edit' || Request::segment(1) === 'preview-edit') {
            // Agar yeh Edit Page hai, toh poora array wapas bhejo
            return $title;
        }

        if (Request::is('admin/edit-short-videos/*') || Request::is('*/preview-edit/*')) {
            // Admin Edit Page: poora array waapis bhejo
            return $title;
        }

        $isJson = Str::isJson($title);

        if (!$isJson) {
            return $title;
        }

        $decodedValue = json_decode($title);

        $currentLocale = App::currentLocale();

        return $isJson === true ? $decodedValue->$currentLocale ?? $decodedValue->en : $title;
    }

    public function getdescriptionAttribute($description)
    {
        $isJson = Str::isJson($description);

        if (!$isJson) {
            return $description;
        }
        if (Request::segment(1) === 'en' && Request::segment(2) === 'preview-edit' || Request::segment(1) === 'preview-edit') {
            // Agar yeh Edit Page hai, toh poora array wapas bhejo
            return $description;
        }

        if (Request::is('admin/edit-short-videos/*') || Request::is('*/preview-edit/*')) {
            // Admin Edit Page: poora array waapis bhejo
            return $description;
        }
        $decodedValue = json_decode($description);

        $currentLocale = App::currentLocale();

        //  return $decodedValue->$currentLocale ?? $description;
        return $isJson === true ? $decodedValue->$currentLocale ?? $decodedValue->en : $description;
    }

    public function getTagsAttribute($tags)
    {
        $table = DB::table('short_videos')->find($this->id);
        $tags = $table->tags;
        return $tags ? explode(',', $tags) : [];
    }

    public function getTagsDetailsAttribute()
    {
        $tag = Tag::select('slug', 'id', 'name')->whereIn('id', $this->tags)->get()->toArray();
        return $tag;
    }

    public function getCategoryIdAttribute($category_id)
    {
        if (!$category_id) {
            return null;
        }
        return explode(',', $category_id);
    }

    public function getCategoryDetailsAttribute()
    {
        $tag = VideoCategories::select('slug', 'id', 'category')->whereIn('id', $this->category_id)->get()->toArray();
        return $tag;
    }

    public function getModelIdAttribute($model_id)
    {
        if (!$model_id) {
            return [];
        }
        return explode(',', $model_id);
    }

    public function getModelDetailsAttribute($category_id)
    {
        $tag = Models::select('slug', 'id', 'name')->whereIn('id', $this->model_id)->get()->toArray();
        return $tag;
    }

    public function getcategoryNamesAttribute()
    {
        if (!$this->category_id) {
            return '';
        }

        $category = VideoCategories::whereIn('id', $this->category_id)->pluck('category')->toArray();

        return implode(',', $category);
    }

    public function getTagNamesAttribute()
    {
        if (!$this->tags) {
            return '';
        }

        $category = Tag::whereIn('id', $this->tags)->pluck('name')->toArray();

        return implode(',', $category);
    }

    public function getModelNamesAttribute()
    {
        if (!$this->model_id) {
            return '';
        }

        $category = Models::whereIn('id', $this->model_id)->pluck('name')->toArray();

        return implode(',', $category);
    }

    public function gettitleEnAttribute()
    {
        $ogValue = DB::table('short_videos')->find($this->id);
        $isJson = Str::isJson($ogValue->title);

        if (!$isJson) {
            return $ogValue->title;
        }
        if (Request::segment(1) === 'en' && Request::segment(2) === 'preview-edit' || Request::segment(1) === 'preview-edit') {
            // Agar yeh Edit Page hai, toh poora array wapas bhejo
            return $ogValue->title;
        }

        if (Request::is('admin/edit-short-videos/*') || Request::is('*/preview-edit/*')) {
            // Admin Edit Page: poora array waapis bhejo
            return $ogValue->title;
        }

        $decodedValue = json_decode($ogValue->title);

        return $decodedValue->en;
    }

    public function getPromotitleEnAttribute()
    {
        $title = $this->attributes['title'] ?? null;

        if (is_null($title)) {
            return null;
        }
        if (Request::segment(1) === 'en' && Request::segment(2) === 'preview-edit' || Request::segment(1) === 'preview-edit') {
            // Agar yeh Edit Page hai, toh poora array wapas bhejo
            return $title;
        }
        if (Request::is('admin/edit-short-videos/*') || Request::is('*/preview-edit/*')) {
            // Admin Edit Page: poora array waapis bhejo
            return $title;
        }
        $decoded = json_decode($title);
        if (json_last_error() === JSON_ERROR_NONE && isset($decoded->en)) {
            return $decoded->en;
        }
        return $title;
    }

    public function gettitleDeAttribute()
    {
        $ogValue = DB::table('short_videos')->find($this->id);
        // $isJson = Str::isJson($ogValue->title);

        // if (!$isJson) {
        //     return $ogValue->title;
        // }

        // $decodedValue = json_decode($ogValue->title);

        // return $decodedValue->de;
        if (empty($ogValue->title) || !Str::isJson($ogValue->title)) {
            return '';
        }

        $decodedValue = json_decode($ogValue->title, true);

        return $decodedValue['de'] ?? '';
    }

    public function getdescriptionEnAttribute()
    {
        $ogValue = DB::table('short_videos')->find($this->id);

        $isJson = Str::isJson($ogValue->description);

        if (!$isJson) {
            return $ogValue->description;
        }
        if (Request::segment(1) === 'en' && Request::segment(2) === 'preview-edit' || Request::segment(1) === 'preview-edit') {
            // Agar yeh Edit Page hai, toh poora array wapas bhejo
            return $ogValue->description;
        }
        if (Request::is('admin/edit-short-videos/*') || Request::is('*/preview-edit/*')) {
            // Admin Edit Page: poora array waapis bhejo
            return $ogValue->description;
        }
        $decodedValue = json_decode($ogValue->description);

        return $decodedValue->en;
    }

    public function getdescriptionDeAttribute()
    {
        $ogValue = DB::table('short_videos')->find($this->id);
        // $isJson = Str::isJson($ogValue->description);

        // if (!$isJson) {
        //     return $ogValue->description;
        // }

        // $decodedValue = json_decode($ogValue->description);

        // return $decodedValue->de;
        if (empty($ogValue->description) || !Str::isJson($ogValue->description)) {
            return '';
        }

        $decodedValue = json_decode($ogValue->description, true);

        return $decodedValue['de'] ?? '';
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

    public function getselectedTagsAttribute()
    {
        if (!$this->tags) {
            return [];
        }

        $category = Tag::whereIn('id', $this->tags)->get();

        $array = [];
        foreach ($category as $categoryDetails) {
            $array[] = ['label' => $categoryDetails->name, 'value' => $categoryDetails->id];
        }

        return $array;
    }

    public function getfullVideoLinkAttribute()
    {
        if (!$this->video_id) {
            return [];
        }

        $category = Video::select('id', 'title')->where('id', $this->video_id)->first();

        $array = [];

        // return ['label' => $category->title, 'value' => $category->id];
        return ['label' => $category->title ?? '', 'value' => $category->id ?? ''];
    }

    public function getseoDeatilsAttribute()
    {
        if (!$this->seo) {
            return [];
        }
        return json_decode($this->seo);
    }

    public function model()
    {
        return $this->belongsTo(Models::class, 'model_id'); // adjust foreign key if different
    }

    public static function RandomViews()
    {
        $min = 2500;
        $max = 4000;
        $newRandomViews = mt_rand($min, $max);
        return $newRandomViews;
    }
}
