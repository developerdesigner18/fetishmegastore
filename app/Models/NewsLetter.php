<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class NewsLetter extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'newsletters';
    protected $fillable = ['title', 'description'];

    //protected $appends = [ 'imageUrl','title_en','title_de','description_en','description_de','categoryNames','tagNames','categoryDetails','tagsDetails'];
    

    protected $dates = ['deleted_at'];

}
