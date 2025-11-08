<?php

namespace App\Http\Controllers;

use App\Models\TokenPack;
use App\Models\User;
use App\Models\UserVoucherCode;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class TokensController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth')->except(['getTokens']);
    }
    public function getTokens()
    {
        $packs = TokenPack::orderBy('price')->get();
        return Inertia::render('Tokens/Packages', compact('packs'));
    }

    public function selectGateway(TokenPack $tokenPack)
    {

//        $checkUserEmailVerified = User::where('id',Auth::user()->id)->first();
//
//        if(!$checkUserEmailVerified->email_verified_at){
//            request()->session()->flash('message', __("Please verify your email address, and then you will be able to purchase the tokens."));
//            return to_route('profile.edit');
//        }

        $paypalEnabled = opt('paypalEnable');
        $stripeEnabled = opt('stripeEnable');
        $bankEnabled = opt('bankEnable');
        $ccbillEnabled = opt('ccbillEnable');

        $paypalImg = asset('images/paypal-btn.png');
        $stripeImg = asset('images/stripe-cards.png');
        $ccbillImg = asset('images/ccbill-pay.png');
        $bankImg = asset('images/bank-transfer.png');
        $bitImg = asset('images/bitcoin.png');

        return Inertia::render(
            'Tokens/Select-Gateway',
            compact(
                'tokenPack',
                'paypalEnabled',
                'stripeEnabled',
                'bankEnabled',
                'ccbillEnabled',
                'paypalImg',
                'stripeImg',
                'bankImg',
                'ccbillImg',
                'bankImg',
                'bitImg'
            )
        );
    }

//     public function submitVoucher(Request $request){

// //        dd($request->all());

// //        $request->validate([
// //            'voucher_type' => 'required|in:AMAZON,PAYSAFE',
// //            'code' => 'required',
// //            'selected_token' => 'required|exist:token_packs,id'
// //        ]);


//         $user = new UserVoucherCode();
//         $user->user_id = auth()->user()->id;
//         $user->type = $request->voucher_type;
//         $user->code = $request->code;
//         $user->token_id = $request->selected_token;
//         $user->save();

//         $request->session()->flash('message', __("Voucher Submitted successfully!"));
//         return to_route('home');

//     }


    public function submitVoucher(Request $request)
    {
        $request->validate([
            'voucher_type'   => 'required|in:AMAZON,PAYSAFE',
            'code'           => 'required',
            'selected_token' => 'required|exists:token_packs,id',
        ]);

        $buyer = auth()->user();
        $tokenPack = TokenPack::findOrFail($request->selected_token);

        $voucher = new UserVoucherCode();
        $voucher->user_id = $buyer->id;
        $voucher->type = $request->voucher_type;
        $voucher->code = $request->code;
        $voucher->token_id = $tokenPack->id;
        $voucher->save();

        $buyer->increment('tokens', $tokenPack->tokens);

        handleAffiliateCommissionForTokens($buyer, $tokenPack);

        $request->session()->flash('message', __("Voucher redeemed successfully! Tokens credited."));
        return to_route('home');
    }
}    
