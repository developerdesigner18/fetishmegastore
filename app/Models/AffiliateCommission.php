<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AffiliateCommission extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'buyer_id',
        'type',
        'item_id',
        'token',
        'status',
    ];

   public function buyer()
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }
}
