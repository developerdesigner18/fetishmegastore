<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContentWatchHistory extends Model
{
    use HasFactory;

    protected $table = 'content_watch_histories';
    protected $fillable = [
        'user_id', 'IP', 'type', 'video_id', 'date',
    ];

    public function video()
    {
        return $this->belongsTo(Video::class, 'video_id');
    }
}
