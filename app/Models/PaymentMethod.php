<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PaymentMethod extends Model
{
    use HasFactory;

    protected $table = 'payment_methods';
    protected $fillable = ['name', 'environment','is_recurring', 'sandbox_credentials','live_credentials','sandbox_url','live_url','status'];
        
    protected $casts = [
        'sandbox_credentials' => 'array',
        'live_credentials' => 'array',
    ];
    
}
