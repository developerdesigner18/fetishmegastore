<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class Story extends Model
{
    use HasFactory;
    protected $table = 'stories';
    protected $fillable = ['title', 'description', 'image','slug'];

    protected $appends = [ 'imageUrl','title_en','title_de','description_en','description_de','categoryNames','tagNames','categoryDetails','tagsDetails'];

    public function getimageUrlAttribute()
    {
        return Storage::url($this->image);
    }

    public function gettitleAttribute($title)
    {
        $isJson = Str::isJson($title);

        if (!$isJson) {
            return $title;
        }

        $decodedValue = json_decode($title);

        $currentLocale = App::currentLocale();

        return $decodedValue->$currentLocale ?? $decodedValue->en;
    }

    public function getdescriptionAttribute($description)
    {
        $isJson = Str::isJson($description);

        if (!$isJson) {
            return $description;
        }

        $decodedValue = json_decode($description);

        $currentLocale = App::currentLocale();

        return $decodedValue->$currentLocale ?? $decodedValue->en;
    }

    public function gettitleEnAttribute(){
        $ogValue = DB::table('stories')->find($this->id);
        $isJson = Str::isJson($ogValue->title);

        if(!$isJson){
            return $ogValue->title;
        }

        $decodedValue = json_decode($ogValue->title);

        return $decodedValue->en;

    }
    public function gettitleDeAttribute(){
        $ogValue = DB::table('stories')->find($this->id);
        $isJson = Str::isJson($ogValue->title);

        if(!$isJson){
            return $ogValue->title;
        }

        $decodedValue = json_decode($ogValue->title);

        return $decodedValue->de;
    }

    public function getdescriptionEnAttribute(){
        $ogValue = DB::table('stories')->find($this->id);

        $isJson = Str::isJson($ogValue->description);

        if(!$isJson){
            return $ogValue->description;
        }

        $decodedValue = json_decode($ogValue->description);

        return $decodedValue->en;
    }

    public function getdescriptionDeAttribute(){
        $ogValue = DB::table('stories')->find($this->id);
        $isJson = Str::isJson($ogValue->description);

        if(!$isJson){
            return $ogValue->description;
        }

        $decodedValue = json_decode($ogValue->description);

        return $decodedValue->de;
    }

    public function getCategoryNamesAttribute(){
        if(!$this->category_id){
            return null;
        }

        $categoryIds = explode(',',$this->category_id);

        $category = VideoCategories::whereIn('id',$categoryIds)->pluck('category')->toArray();



        return implode(', ',$category);
    }

    public function getTagNamesAttribute(){
        if(!$this->tag_id){
            return null;
        }

        $categoryIds = explode(',',$this->tag_id);

        $category = Tag::whereIn('id',$categoryIds)->pluck('name')->toArray();

        return implode(', ',$category);
    }

    public function getCategoryDetailsAttribute()
    {
        $categoryIds = explode(',',$this->category_id);
        $tag = VideoCategories::select('slug', 'id', 'category')->whereIn('id', $categoryIds)->get()->toArray();
        return $tag;
    }

    public function getTagsDetailsAttribute()
    {
        $categoryIds = explode(',',$this->tag_id);
        $tag = Tag::select('slug', 'id', 'name')->whereIn('id', $categoryIds)->get()->toArray();
        return $tag;
    }
}
