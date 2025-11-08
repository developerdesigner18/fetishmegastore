<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RequestedVideo extends Model
{
    use HasFactory;
    protected $table = 'requested_videos';
    protected $fillable = ['video_id','user_id','description','status'];


    public function video(){
        return $this->hasOne(Video::class,'id','video_id');
    }

    public function user(){
        return $this->hasOne(User::class,'id','user_id');
    }


}
