<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Faq extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'faqs';
    protected $fillable = ['question', 'question_de', 'answer','answer_de','status'];

    //protected $appends = [ 'imageUrl','title_en','title_de','description_en','description_de','categoryNames','tagNames','categoryDetails','tagsDetails'];
    

    protected $dates = ['deleted_at'];

}
