<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PurchaseHistory extends Model
{
    use HasFactory;
    protected $table = 'purchase_history';
    protected $fillable = ['user_id','ip','video_id','type','tier_id'];
}
