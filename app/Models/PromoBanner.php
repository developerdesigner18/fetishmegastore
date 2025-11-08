<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class PromoBanner extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'promo_banners';
    protected $fillable = ['name','slug' , 'description','category_ids','thumbnail','banner_image','status'];

    //protected $appends = [ 'imageUrl','title_en','title_de','description_en','description_de','categoryNames','tagNames','categoryDetails','tagsDetails'];
    

    protected $dates = ['deleted_at'];

    public function getCategoryNamesAttribute()
{
    if (!$this->category_ids) {
        return '-';
    }

    $ids = explode(',', $this->category_ids);

    $category = \App\Models\VideoCategories::whereIn('id', $ids)->pluck('category')->toArray();

    return implode(', ', $category);
}

}
