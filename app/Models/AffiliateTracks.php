<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AffiliateTracks extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'affiliate_user_id',
        'ip_address',
        'url',
        'affiliate_code',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

}
