<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserFavVideo extends Model
{
    use HasFactory;
    protected $table = 'user_favorite_videos';
}
