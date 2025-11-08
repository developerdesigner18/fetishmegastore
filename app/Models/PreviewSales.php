<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PreviewSales extends Model
{
    use HasFactory;

    public $table = 'preview_sales';

    public $appends = ['created_at_human'];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function video()
    {
        return $this->belongsTo(ShortVideo::class,'video_id');
    }


    public function getCreatedAtHumanAttribute()
    {
        return $this->created_at->format('Y-m-d');
    }
}
