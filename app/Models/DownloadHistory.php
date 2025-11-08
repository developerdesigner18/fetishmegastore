<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DownloadHistory extends Model
{
    use HasFactory;
    protected $table = 'download_history';
    protected $fillable = ['user_id','ip','video_id'];
}
