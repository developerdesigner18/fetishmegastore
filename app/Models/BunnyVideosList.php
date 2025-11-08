<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BunnyVideosList extends Model
{
    use HasFactory;
    protected $table = 'bunny_videos_list';

    protected $fillable = ['name', 'label'];
}
