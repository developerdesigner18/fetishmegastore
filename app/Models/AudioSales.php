<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AudioSales extends Model
{
    use HasFactory;

    public $table = 'audio_sales';

    public $appends = ['created_at_human'];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function streamer()
    {
        return $this->belongsTo(User::class, 'streamer_id');
    }

    public function audio()
    {
        return $this->belongsTo(Audio::class);
    }


    public function getCreatedAtHumanAttribute()
    {
        return $this->created_at->format('Y-m-d');
    }
}
