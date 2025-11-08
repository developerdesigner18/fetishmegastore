<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

/**
 * App\Event
 * @property mixed $slug
 * @method static \Illuminate\Database\Eloquent\Builder|Event whereSlug($value)
 */

class Models extends Model
{
    use HasFactory;

    protected $table = 'models';
    protected $fillable = ['name','photo','popularity','description','photos'];
    protected $appends = ['imageUrl','galleryUrl'];

//    public function videos()
//    {
//        return $this->hasMany(Video::class, 'model_id');
//    }

    public function getimageUrlAttribute(){

//        https://fetishmegastore.com/coverPics/default-cover-pic.png

            return env('BUNNY_CDN').$this->photo;

    }

    public function getgalleryUrlAttribute(){

//        https://fetishmegastore.com/coverPics/default-cover-pic.png

        $urls = [];

        if(!$this->photos){
            return null;
        }

        $getGallary = explode(',',$this->photos);

        foreach ($getGallary as $paths){

            if($paths == ''){
                continue;
            }
            $urls[] = ['link' => env('BUNNY_CDN').$paths , 'path' => $paths];
        }


        return $urls;

    }

       public function shortVideos()
    {
        return $this->hasMany(ShortVideo::class, 'model_id');
    }

       public function galleries()
    {
        return $this->hasMany(Gallery::class, 'model_id', 'id');
    }

   

}
