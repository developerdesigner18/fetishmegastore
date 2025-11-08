<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AffiliateAccounts extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'type',
        'name',
        'address',
        'tax_id',
        'company_name',
        'reg_no',
        'status',
    ];

    protected $dates = ['deleted_at'];

}
