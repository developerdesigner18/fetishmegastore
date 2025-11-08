<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    // no timestamps, please
    public $timestamps = false;

    protected $appends = ['expires_human'];

    protected $fillable = ['tier_id','streamer_id','subscriber_id','subscription_date','subscription_expires','paypal_subscription_id','payment_method','payment_data','status','is_recurring','subscription_tokens','type','payment_data'];

    protected $casts = [
            'subscription_date' => 'datetime',
            'subscription_expires' => 'datetime'
        ];

    public function getExpiresHumanAttribute()
    {
        return $this->subscription_expires->format('jS F Y');
    }

    public function streamer()
    {
        return $this->belongsTo(User::class, 'streamer_id', 'id');
    }

    public function subscriber()
    {
        return $this->belongsTo(User::class, 'subscriber_id', 'id');
    }

    public function tier()
    {
        return $this->belongsTo(Tier::class);
    }
}
