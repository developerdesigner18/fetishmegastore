<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Request;

class Gallery extends Model
{
    use HasFactory;
    protected $table = 'gallery';
    // protected $fillable = ['images','is_promo_video','video_id','price'];
    protected $fillable = [
        'user_id',
        'title',
        'description',
        'title_lang',
        'description_lang',
        'slug',
        'category_id',
        'model_id',
        'tags',
        'video_id',
        'thumbnail',
        'images',
        'seo',
        'is_promo_video',
        'price',
    ];

    protected $appends = ['categoryNames','tagNames','modelNames','galleryUrl','imageGallery','tagsDetails','categoryDetails','modelDetails','canBePlayed', 'title_en', 'title_de', 'selectedCategory', 'selectedModel', 'selectedTags', 'fullVideoLink','seoDeatils'];

    protected $casts = [
        'title' => 'array',
        'description' => 'array',
    ];

    protected function thumbnail(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => Storage::disk('public')->url($value),
        );
    }


    public function gettitleAttribute($title){

        if (Request::segment(1) === 'en' && Request::segment(2) === 'gallery-edit' || Request::segment(1) === 'gallery-edit') {
            // Agar yeh Edit Page hai, toh poora array wapas bhejo
            return $title;
        }
        $isJson = Str::isJson($title);

        if(!$isJson){
            return $title;
        }


        $decodedValue = json_decode($title);

        $currentLocale = App::currentLocale();
        // dd($decodedValue->en, $decodedValue->$currentLocale, $currentLocale);

        return $isJson === true ? $decodedValue->$currentLocale ?? $decodedValue->en : $title;

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
        return $this->hasMany(GallerySales::class,'video_id','id');
    }

    public function getTagsAttribute($tags){
        if(is_array($tags)) return $tags;
        if(!$tags){
            return [];
        }
        return explode(',',$tags);
    }

    public function getTagsDetailsAttribute(){
        $tag = Tag::select('slug','id','name')->whereIn('id',$this->tags)->get()->toArray();
        return $tag;
    }

    public function getCategoryIdAttribute($category_id){
        if(!$category_id){
            return null;
        }
        return explode(',',$category_id);
    }

    // public function getCategoryDetailsAttribute($category_id){
    //     $tag = VideoCategories::select('slug','id','category')->whereIn('id',$this->category_id)->get()->toArray();
    //     return $tag;
    // }

    public function getdescriptionAttribute($description){

        if (Request::segment(1) === 'en' && Request::segment(2) === 'gallery-edit' || Request::segment(1) === 'gallery-edit') {
            // Agar yeh Edit Page hai, toh poora array wapas bhejo
            return $description;
        }
        $isJson = Str::isJson($description);

        if(!$isJson){
            return $description;
        }

        $decodedValue = json_decode($description);

        $currentLocale = App::currentLocale();

        //  return $decodedValue->$currentLocale ?? $description;
        return $decodedValue->$currentLocale ?? '';
    }


    public function getCategoryDetailsAttribute() {
        if (empty($this->category_id)) {
            return [];
        }
    
        $categoryIds = is_array($this->category_id) ? $this->category_id : [$this->category_id];
    
        $tag = VideoCategories::select('slug', 'id', 'category')
                    ->whereIn('id', $categoryIds)
                    ->get()
                    ->toArray();
    
        return $tag;
    }
    

    public function getModelIdAttribute($model_id){
        if(!$model_id){
            return [];
        }
        return explode(',',$model_id);
    }
    public function getModelDetailsAttribute($category_id)
    {
        $tag = Models::select('slug', 'id', 'name')->whereIn('id', $this->model_id)->get()->toArray();
        return $tag;
    }

    public function getcategoryNamesAttribute(){

        if(!$this->category_id){
            return '';
        }

        $category = VideoCategories::whereIn('id',$this->category_id)->pluck('category')->toArray();

        return implode(',',$category);
    }

    public function getTagNamesAttribute(){

        if(!$this->tags){
            return '';
        }

        $category = Tag::whereIn('id',$this->tags)->pluck('name')->toArray();

        return implode(',',$category);
    }

    public function getModelNamesAttribute(){

        if(!$this->model_id){
            return '';
        }

        $category = Models::whereIn('id',$this->model_id)->pluck('name')->toArray();

        return implode(',',$category);
    }


    public function getgalleryUrlAttribute(){

        // https://fetishmegastore.com/coverPics/default-cover-pic.png

        $urls = [];

        if(!$this->images){
            return null;
        }

        $getGallary = explode(',',$this->images);

        foreach ($getGallary as $paths){

            if($paths == ''){
                continue;
            }
            $urls[] = ['link' => asset($paths) , 'path' => $paths];
        }


        return $urls;

    }

    public function getImageGalleryAttribute(){

        //  https://fetishmegastore.com/coverPics/default-cover-pic.png

        $urls = [];

        if(!$this->images){
            return null;
        }

        $getGallary = explode(',',$this->images);

        foreach ($getGallary as $paths){

            if($paths == ''){
                continue;
            }
            $urls[] = ['original' => asset($paths) , 'thumbnail' => asset($paths)];
        }


        return $urls;

    }

    
    public function streamer()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function gettitleEnAttribute()
    {
        $ogValue = DB::table('gallery')->find($this->id);
        $isJson = Str::isJson($ogValue->title);

        if (!$isJson) {
            return $ogValue->title;
        }

        $decodedValue = json_decode($ogValue->title);

        return $decodedValue->en;

    }

    public function gettitleDeAttribute()
    {
        $ogValue = DB::table('gallery')->find($this->id);
        // $isJson = Str::isJson($ogValue->title);

        // if (!$isJson) {
        //     return $ogValue->title;
        // }

        // $decodedValue = json_decode($ogValue->title);

        if (Request::segment(1) === 'en' && Request::segment(2) === 'gallery-edit' || Request::segment(1) === 'gallery-edit') {
            // Agar yeh Edit Page hai, toh poora array wapas bhejo
            return $ogValue->title;
        }

        // return $decodedValue->de;
        if (empty($ogValue->title) || !Str::isJson($ogValue->title)) {
            return '';
        }

        $decodedValue = json_decode($ogValue->title, true);

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

        $category = Video::select('id', 'title')->where('id',$this->video_id)->first();

        $array = [];

        return ['label' => $category->title, 'value' => $category->id];

    }

    public function getseoDeatilsAttribute()
    {
        if(!$this->seo){
            return [];
        }

        return json_decode($this->seo);

    }

    public function model()
    {
        return $this->belongsTo(Model::class, 'model_id', 'id');
    }

    public static function RandomViews()
    {
        $min = 2500;
        $max = 4000;
        $newRandomViews = mt_rand($min, $max);
        return $newRandomViews;
    }
}
