<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RecommendedVideo extends Model
{
    use HasFactory;
    protected $table = 'recommended_videos';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'video_id',
    ];

    public function video()
    {
        return $this->belongsTo(Video::class);
    }
}
