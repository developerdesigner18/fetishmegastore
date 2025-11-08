<?php

namespace App\Http\Controllers;

use App\Models\TokenPack;
use App\Models\TokenSale;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class PayPalController extends Controller
{
    // auth
    public function __construct()
    {
        $this->middleware('auth')->except(['ipn', 'redirect']);
    }

    // purchase
    public function purchase(TokenPack $tokenPack, Request $request)
    {
        $sale = TokenSale::create([
                    'user_id' => $request->user()->id,
                    'tokens' => $tokenPack->tokens,
                    'amount' => $tokenPack->price,
                    'status' => 'pending',
                    'gateway' => 'PayPal'
                ]);

        $paypalEmail = opt('paypal_email');
//        $paypalEmail = 'test.dds0001@gmail.com';
//        dd($paypalEmail);
        $paypalUrl = env('PAYPAL_URL');

        $currencySymbol = $request->get('currency_symbol'); 
        $currencyCode = $request->get('currency_code'); 
        $encryptId = encrypt_decrypt('encrypt', $sale->id);
       
        $redirectURL = route('paypal.redirect-to-processing', ['trx_id'=> $encryptId]);

        //return Inertia::render('Tokens/Paypal', compact('tokenPack', 'paypalEmail', 'sale', 'paypalUrl'));
        return view('paypal', compact('tokenPack', 'paypalEmail', 'sale', 'paypalUrl', 'currencySymbol', 'currencyCode','redirectURL'));
    }

    // redirect to processing
    /* public function redirect()
    {
        return redirect(route('paypal.processing'));
    } */
    // public function redirect(Request $request)
    // {
    //     if(!empty($request->trx_id) && !empty($request->PayerID)){
            
    //         $encryptId = encrypt_decrypt('decrypt', $request->trx_id);
    //         $order = TokenSale::findOrFail($encryptId);
    //         $order->status = 'paid';
    //         $order->save();
    //         $order->user->increment('tokens', $order->tokens);

           

    //        /*  return redirect()->route('profile.myTokens')->withSuccess('Token purchase successfully.');
    //         session()->flash('izitost', [
    //             'type' => 'success',   // or 'alert' based on izitost config
    //             'title' => 'Success!',
    //             'message' => 'Token purchase successfully'
    //         ]);
    //         return redirect()->route('profile.myTokens'); */
    //         return Redirect::route('profile.myTokens')->with('message', __('Token purchase successfully.'));
    //     }else{
    //         return redirect(route('paypal.processing'));
    //     }
    // }



  public function redirect(Request $request)
    {
        if (!empty($request->trx_id) && !empty($request->PayerID)) {
            
            $encryptId = encrypt_decrypt('decrypt', $request->trx_id);
            $order = TokenSale::findOrFail($encryptId);
            $order->status = 'paid';
            $order->save();
            $order->user->increment('tokens', $order->tokens);
            if ($order->status === 'paid') {
                handleAffiliateCommissionForTokens($order);
            }

            return Redirect::route('profile.myTokens')->with('message', __('Token purchase successfully.'));
        } else {
            return redirect(route('paypal.processing'));
        }
    }



    // processing
    public function processing()
    {
        $paypalImg = asset('images/paypal-btn.png');
        return Inertia::render('Tokens/PayPalProcessing', compact('paypalImg'));
    }

    // ipn processing
    public function ipn(Request $r)
    {
        \Log::info('PAYPAL RESPONSE');
        \Log::info($r);
        $r->validate(['custom' => 'required|exists:token_sales,id']);

        // STEP 1: read POST data
        $raw_post_data = file_get_contents('php://input');
        $raw_post_array = explode('&', $raw_post_data);

        $myPost = [];

        foreach ($raw_post_array as $keyval) {
            $keyval = explode('=', $keyval);
            if (count($keyval) == 2) {
                $myPost[$keyval[0]] = urldecode($keyval[1]);
            }
        }

        // read the IPN message sent from PayPal and prepend 'cmd=_notify-validate'
        $req = 'cmd=_notify-validate';

        // build req
        foreach ($myPost as $key => $value) {
            $value = urlencode($value);
            $req .= '& ' . trim(strip_tags($key)) . '=' . trim(strip_tags($value));
        }

        // STEP 2: POST IPN data back to PayPal to validate
        $ch = curl_init(env('PAYPAL_IPN_URL'));
        curl_setopt($ch, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $req);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 1);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
        curl_setopt($ch, CURLOPT_FORBID_REUSE, 1);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Connection: Close']);

        // error?
        if (!($res = curl_exec($ch))) {
            Log::info('route(paypal.ipn)');
            Log::error('Got ' . curl_error($ch) . ' when processing IPN data');
            curl_close($ch);
            exit();
        } else {
            Log::info('IPN_POSTED_SUCCESSFULLY');
        }
        curl_close($ch);


        // STEP 3: Inspect IPN validation result and act accordingly
        if (preg_match('/VERIFIED/i', $res)) {
            // check if payment status is completed
            if ($r->payment_status != 'Completed') {
                exit();
            }

            // find this order
            $order = TokenSale::findOrFail($r->custom);

            switch ($r->txn_type) {
                case 'web_accept':
                    // update order status
                    $order->status = 'paid';
                    $order->save();

                    // increase user balance
                    $order->user->increment('tokens', $order->tokens);

                    break;
            }
        }
    }
}
