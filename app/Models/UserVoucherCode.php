<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserVoucherCode extends Model
{
    use HasFactory;
    protected $table = 'user_voucher_codes';
    protected $fillable = ['user_id','type','code','token_id','status'];

    public function user(){
        return $this->belongsTo(User::class,'user_id','id');
    }

    public function token(){
        return $this->belongsTo(TokenPack::class,'token_id','id');
    }
}
