<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AffiliateTransactions extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'affiliate_commission_id',
        'amount',
        'type',
        'balance',
        'status',
        'payment_type',
    ];

    protected $dates = ['deleted_at'];

}
