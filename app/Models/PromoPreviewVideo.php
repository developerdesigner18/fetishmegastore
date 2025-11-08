<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class PromoPreviewVideo extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'promo_preview_videos';
    protected $fillable = ['name', 'description','category_ids','thumbnail','preview_videos','status'];

    //protected $appends = [ 'imageUrl','title_en','title_de','description_en','description_de','categoryNames','tagNames','categoryDetails','tagsDetails'];
    

    protected $dates = ['deleted_at'];

   public function getCategoryNamesAttribute()
    {
        if (!$this->category_ids) {
            return '-';
        }

        $ids = explode(',', $this->category_ids);

        $categories = \App\Models\VideoCategories::whereIn('id', $ids)->pluck('category')->toArray();

        return implode(', ', $categories);
    }

    public function getThumbnailAttribute($value)
    {
        return $value ? asset($value) : null;
    }

    public function getPreviewVideosAttribute($value)
    {
        return $value ? asset($value) : null;
    }

    



}
