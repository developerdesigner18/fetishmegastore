<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\HasApiTokens;
use Overtrue\LaravelFollow\Traits\Follower;
use Overtrue\LaravelFollow\Traits\Followable;

class User extends Authenticatable
{
    use HasApiTokens;
    use HasFactory;
    use Notifiable;
    use Follower;
    use Followable;

    protected $fillable = ['username','email','name','password','stripe_customer_id','default_payment_method','policy','tokens','is_featured_verified','is_affiliate_vendor','affiliate_vendor_verifiy','affiliate_vendor_verifiy_at','affiliate_code','affiliate_user','is_subscribe','unsubscribe_reason','unsubscribe_at'];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public $appends = ['firstCategory', 'moneyBalance', 'isBanned', 'firstName','meta'];

    protected function profilePicture(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => is_null($value) ? Storage::disk('public')->url('profilePics/default-profile-pic.png') : Storage::disk('public')->url($value),
        );
    }

    public function getFirstNameAttribute()
    {
        $fullname = explode(" ", $this->name);
        return isset($fullname[0]) ? $fullname[0] : __('Me');
    }

    protected function coverPicture(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => is_null($value) ? Storage::disk('public')->url('coverPics/default-cover-pic.png') : Storage::disk('public')->url($value),
        );
    }

    public function tokenPurchases()
    {
        return $this->hasMany(TokenSale::class);
    }

    public function categories()
    {
        return $this->belongsToMany(Category::class);
    }

    protected function getFirstCategoryAttribute()
    {
        return $this->categories()->firstOr(function () {
            return (object)['id' => null, 'category' => null, 'slug' => null];
        });
    }

    public function scopeIsStreamer($query)
    {
        return $query->where('is_streamer', 'yes')->where('is_streamer_verified', 'yes');
    }

    public function getIsBannedAttribute()
    {
        return Banned::where('ip', $this->ip)->exists();
    }

    protected function getMoneyBalanceAttribute()
    {
        if (is_int($this->tokens)) {
            return opt('token_value') * $this->tokens;
        }

        return;
    }

    public function withdrawals()
    {
        return $this->hasMany(Withdrawal::class);
    }

    public function tiers()
    {
        return $this->hasMany(Tier::class);
    }

    public function hasSubscriptionTo(User $streamer = null)
    {
        if(!$streamer){
            return false;
        }
        
        return $this->subscriptions()->where('subscription_expires', '>=', now())
            ->where('streamer_id', $streamer->id)
            ->where('subscriber_id', auth()->user()->id)
            ->where('status', '!=', 'Pending')
            ->exists();
    }

    public function streamerBans()
    {
        return $this->hasMany(RoomBans::class, 'streamer_id');
    }

    public function bannedFromRooms()
    {
        return $this->hasMany(RoomBans::class, 'user_id');
    }

    public function subscriptions()
    {
        return $this->hasMany(Subscription::class, 'subscriber_id', 'id')->orderBy('id','desc');
    }

    public function subscribers()
    {
        return $this->hasMany(Subscription::class, 'streamer_id', 'id')->where('subscription_expires', '>=', now());
    }

    public function videos()
    {
        return $this->hasMany(Video::class);
    }

    public function audio()
    {
        return $this->hasMany(Audio::class);
    }

    public function ebooks()
    {
        return $this->hasMany(Ebook::class, 'user_id');
    }

    public function gallery()
    {
        return $this->hasMany(Gallery::class);
    }

    public function preview()
    {
        return $this->hasMany(ShortVideo::class,'user_id','id');
    }

    public function textFile()
    {
        return $this->hasMany(TextFile::class);
    }

    public function purchasedVideos()
    {
        return $this->hasManyThrough(Video::class, VideoSales::class, 'user_id', 'id', 'id', 'video_id');
    }

    public function watchedVideos()
    {
        return $this->hasManyThrough(Video::class, ContentWatchHistory::class, 'user_id', 'id', 'id', 'video_id');
    }

    public function purchasedAudio()
    {
        return $this->hasManyThrough(Audio::class, AudioSales::class, 'user_id', 'id', 'id', 'audio_id');
    }

    // public function purchasedEbook()
    // {
    //     return $this->hasManyThrough(Ebook::class, EbookSales::class, 'user_id', 'id', 'id', 'audio_id');
    // }

    public function purchasedEbook()
    {
        return $this->belongsToMany(Ebook::class, 'ebook_sales', 'user_id', 'ebook_id');   // `ebook_sales` table mein ebook ki ID (Not 'audio_id')
    }

    public function chats()
    {
        return $this->hasMany(Chat::class);
    }

    public function tipsGiven()
    {
        return $this->hasMany(Tips::class, 'user_id', 'id');
    }

    public function tipsReceived()
    {
        return $this->hasMany(Tips::class, 'streamer_id', 'id');
    }

    public function tokenOrders()
    {
        return $this->hasMany(TokenSale::class);
    }

    // Relationship to UserMeta
    public function metas()
    {
        return $this->hasMany(UserMeta::class);
    }

    // Function to get user meta as attributes
    public function getMetaAttribute()
    {
        $metaArray = [];
        foreach ($this->metas as $meta) {
            $metaArray[$meta->meta_key] = $meta->meta_value;
        }
        return $metaArray;
    }

    public static function boot()
    {
        parent::boot();

        static::deleting(function ($user) {
            DB::transaction(function () use ($user) {
                $user->purchasedVideos()->delete();
                $user->purchasedAudio()->delete();
                $user->videos()->delete();
                $user->subscriptions()->delete();
                $user->tiers()->delete();
                $user->categories()->delete();
                $user->notifications()->delete();
                $user->chats()->delete();
                $user->tipsGiven()->delete();
                $user->tipsReceived()->delete();
                $user->withdrawals()->delete();

                DB::statement('DELETE FROM followables WHERE user_id = ? OR followable_id = ?', [$user->id, $user->id]);
            }, 3);
        });
    }
}
