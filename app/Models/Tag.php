<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * App\Event
 * @property mixed $slug
 * @method static \Illuminate\Database\Eloquent\Builder|Event whereSlug($value)
 */

class Tag extends Model
{
    use HasFactory;
    protected $table = 'tags';
    protected $fillable = ['name','image','slug'];
    protected $appends = ['imageUrl'];

    public function getimageUrlAttribute()
    {
//        https://fetishmegastore.com/coverPics/default-cover-pic.png

        if(!$this->image){
            return Storage::disk('public')->url('coverPics/default-cover-pic.png');
        }
        return env('BUNNY_CDN').$this->image;
//        return Storage::disk('public')->url($this->image);
    }


    public function getnameAttribute($name){
        $isJson = Str::isJson($name);

        if(!$isJson){
            return $name;
        }

        $decodedValue = json_decode($name);

        $currentLocale = App::currentLocale();

//        return $decodedValue->$currentLocale ?? $name;
        return $isJson === true ? $decodedValue->$currentLocale ?? $decodedValue->en : $name;
    }



    function videos(){
        return Video::with('streamer')->where('tags','LIKE',"%{$this->name}%")->paginate(12);
    }
}
