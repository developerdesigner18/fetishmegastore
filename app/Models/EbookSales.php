<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EbookSales extends Model
{
    use HasFactory;

    public $table = 'ebook_sales';

    public $appends = ['created_at_human'];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function streamer()
    {
        return $this->belongsTo(User::class, 'streamer_id');
    }

    public function ebook()
    {
        return $this->belongsTo(Ebook::class);
    }

    public function getCreatedAtHumanAttribute()
    {
        return $this->created_at->format('Y-m-d');
    }
}