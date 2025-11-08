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

class VideoCategories extends Model
{
    use HasFactory;

    public $table = 'video_categories';
    protected $fillable = ['slug'];
    public $appends = ['imageUrl'];
    public $timestamps = false;

    public function videos()
    {
        return $this->hasMany(Video::class, 'category_id');
    }

    public function getimageUrlAttribute()
    {
        //  https://fetishmegastore.com/coverPics/default-cover-pic.png

        if (!$this->image) {
            return Storage::disk('public')->url('coverPics/default-cover-pic.png');
        }
        return env('BUNNY_CDN') . $this->image;
    }

    public function getcategoryAttribute($category)
    {
        $isJson = Str::isJson($category);

        if (!$isJson) {
            return $category;
        }

        $decodedValue = json_decode($category);

        $currentLocale = App::currentLocale();

        //  return $decodedValue->$currentLocale ?? $category;
        return $isJson === true ? $decodedValue->$currentLocale ?? $decodedValue->en : $category;
    }
}
