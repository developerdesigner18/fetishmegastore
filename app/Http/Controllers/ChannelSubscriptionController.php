<?php

namespace App\Http\Controllers;

use App\Models\PurchaseHistory;
use App\Models\Subscription;
use App\Models\Tier;
use App\Models\User;
use App\Mail\SubscriptionPurchasedMail;
use App\Notifications\NewSubscriber;
use App\Notifications\ThanksNotification;
use Carbon\Carbon;
use Illuminate\Broadcasting\Channel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use App\Models\TokenPack;
use App\Models\UserVoucherCode;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Models\TokenSale;
use Illuminate\Support\Facades\Redirect;



class ChannelSubscriptionController extends Controller
{
    

    public function __construct()
    {
        $this->middleware('auth')->except(['getTokens']);
        $this->middleware('auth')->except(['ipn', 'redirect']);
    }

    public function purchase(User $user, Tier $tier, Request $request){   
        if ($user->is_streamer !== 'yes') {
            abort(403, __("User is not a streamer"));
        } elseif ($tier->user_id !== $user->id) {
            abort(403, __("Tier is not owned by this streamer"));
        } elseif (!$request->has('plan')) {
            abort(403, __("Plan is required in order to subscribe"));
        }
        $paymentMethod = getPaypalDetails();
        // check plan legitimacy
        $plan = $request->plan;
    
        if (!in_array($plan, ['Monthly', '6 Months', 'Yearly'])) {
            abort(403, __("Plan not recognized"));
        }
    
        // compute price for this channel & tier + plan combo
        $price = match ($plan) {
            'Monthly' => $tier->price,
            '6 Months' => $tier->six_months_price,
            'Yearly' => $tier->yearly_price,
        };
        $expiration = match ($plan) {
            'Monthly' => strtotime("+1 Month"),
            '6 Months' => strtotime("+6 Months"),
            'Yearly' => strtotime("+1 Year"),
        };

        $exa = $expiration;
        //dd($exa);
    
        // Check if the user has already purchased the same tier
        $checkHistory = PurchaseHistory::where(function ($query) use ($request, $tier) {
            $query->where('user_id', auth()->user()->id)
                  ->orWhere('ip', $request->ip());
        })
        ->where('type', 'tier')
        ->where('tier_id', $tier->id)
        ->count();
    
        /* if ($checkHistory >= 3) {
            return back()->with('message', __('You are not allowed to purchase the subscription more than 3 times.'));
        } */
        
        // Create the subscription record
        $subscription = new Subscription();
        $subscription->tier_id = $tier->id;
        $subscription->streamer_id = $user->id;
        $subscription->subscriber_id = $request->user()->id;
        $subscription->subscription_date = now();
        $subscription->subscription_expires = $expiration;
        $subscription->type = $plan;
        $subscription->status = 'Pending';
        $subscription->payment_method = 'PAYPAL';
        $subscription->subscription_tokens = $price;
        $subscription->is_recurring = !empty($paymentMethod) && !empty($paymentMethod->is_recurring) ? '1' : '0';
        $subscription->save();
        if ($subscription) {
            $addpurchasehistory = new PurchaseHistory();
            $addpurchasehistory->type = 'tier';
            $addpurchasehistory->tier_id = $tier->id;
            $addpurchasehistory->user_id = auth()->user()->id;
            $addpurchasehistory->ip = $request->ip();
            $addpurchasehistory->save();
        }
    
        $sale           = $subscription;
        $paypalEmail    = opt('paypal_email');
        $paypalUrl      = env('PAYPAL_URL');
        $currencySymbol = $request->get('currency_symbol'); 
        $currencyCode   = $request->get('currency_code'); 
        $encryptId      = encrypt_decrypt('encrypt', $sale->id);
    
        $returnUrl = route('paypal.subscription.redirect-to-processing', ['id' => $encryptId]);
        $redirectURL = route('paypal.subscription.redirect-to-processing', ['id' => $encryptId]);
        $cancleURL = url('/subscribe/channel/'.$user->username.'/tier/'.$tier->id);
        
        if (!empty($paymentMethod) && !empty($paymentMethod->is_recurring)) {
			
			
			if($paymentMethod->environment == 'Sandbox'){
				 $decoded_credentials = json_decode($paymentMethod->sandbox_credentials, true);
			}else if($paymentMethod->environment == 'Live'){
				 $decoded_credentials = json_decode($paymentMethod->live_credentials, true);
			}
           
            $clientId = $secretKey = $paypalUrl = '';
            // Parse PayPal credentials
            foreach ($decoded_credentials as $credential) {
                switch ($credential['key']) {
                    case 'CLIENT_ID':
                        $clientId = $credential['value'];
                        break;
                    case 'SECRET_KEY':
                        $secretKey = $credential['value'];
                        break;
                    case 'URL':
                        $paypalUrl = rtrim($credential['value'], '/');
                        break;
                }
            }
			
            // Validate credentials
            if (empty($clientId) || empty($secretKey) || empty($paypalUrl)) {
                return back()->with('error', __('PayPal credentials are not configured properly.'));
            }
            //Get Access token For payment
            $accessToken = $this->generateToken($clientId,$secretKey, $paypalUrl);
			//prd($accessToken);
            //Generate Paypal Plan ID
            $paypalPlanID = $this->generatePaypalPlanId($plan, $sale, $accessToken, $paypalUrl);
            //prd($paypalPlanID);
            
            $subscriptionData = [
                'plan_id'       => $paypalPlanID,
                'start_time'    => gmdate('Y-m-d\TH:i:s\Z', strtotime("+1 minute")),
                'subscriber'    => [
                                        'email_address' => $request->user()->email,
                                    ],
                'application_context'   => [
                                                'brand_name'        => config('app.name'),
                                                'locale' => 'en-US',
                                                'shipping_preference' => 'NO_SHIPPING',
                                                'user_action' => 'SUBSCRIBE_NOW',
                                                'return_url' => $returnUrl,
                                                'cancel_url' => $cancleURL,
                                            ],
            ];
           
            $subscriptionUrl = $paypalUrl.'/v1/billing/subscriptions';
            $ch = curl_init();
            curl_setopt_array( $ch, [
                CURLOPT_URL => $subscriptionUrl,
                CURLOPT_HTTPHEADER => [
                    "Content-Type: application/json",
                    "Authorization: Bearer $accessToken",
                ],
                CURLOPT_SSL_VERIFYHOST => false,
                CURLOPT_SSL_VERIFYPEER => false,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_POST => true,
                CURLOPT_POSTFIELDS => json_encode($subscriptionData),  // Pass request body
            ]);
            $response = curl_exec( $ch);
            $error = curl_error($ch);
            curl_close($ch);
            if ($error || !$response) {
                return back()->with('error', __('Unable to create PayPal subscription. Please try again.'));
            }
            $subscriptionResponse = json_decode($response, true);
            if (isset($subscriptionResponse['id']) && isset($subscriptionResponse['links'])) {
                $subscription->paypal_subscription_id = $subscriptionResponse['id'];
                $subscription->save();
                foreach ($subscriptionResponse['links'] as $link) {
                    if ($link['rel'] === 'approve') {
                        //return redirect()->to($link['href']);
                        return view('frontend/subscription/redirect')->with('paypalApprovalUrl', $link['href']);
                    }
                }
            } else {
                return back()->with('error', __('Unable to create PayPal subscription. Please try again.'));
            }
            return view('frontend/subscription/paypal', compact('user','plan','price', 'paypalEmail', 'sale', 'paypalUrl', 'currencySymbol', 'currencyCode','redirectURL'));
        }else{
        return view('frontend.subscription.paypal', compact('user', 'plan', 'price', 'sale', 'paypalUrl', 'currencySymbol', 'currencyCode', 'redirectURL'));
    }
 }

    public function generateToken($clientId,$secretKey,$paypalUrl){
        $authUrl = $paypalUrl.'/v1/oauth2/token';
        $curl = curl_init();
        curl_setopt_array($curl, [
            CURLOPT_URL => $authUrl,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => "grant_type=client_credentials",
            CURLOPT_HTTPHEADER => [
                "Authorization: Basic " . base64_encode("$clientId:$secretKey"),
                "Accept: application/json",
                "Accept-Language: en_US",
                "Content-Type: application/x-www-form-urlencoded",
            ],
            CURLOPT_SSL_VERIFYHOST => false,
            CURLOPT_SSL_VERIFYPEER => false,
        ]);
        $response = curl_exec($curl);
        //prd($response);
		
		$error = curl_error($curl);
        curl_close($curl);
        if ($error || !$response) {
            return back()->with('error', __('Unable to authenticate with PayPal. Please check your credentials.'));
        }
        $responseData = json_decode($response, true);
        if (!isset($responseData['access_token'])) {
            return back()->with('error', __('Unable to retrieve access token from PayPal.'));
        }
        $accessToken = $responseData['access_token'];
        return $accessToken;
    }
    

    public function getProductID($accessToken, $paypalUrl){
        $data = [
                "name" => "Video Streaming Service",
                "type" => "DIGITAL",
                "description" => "Video streaming service",
                "category" => "ADULT",
                "image_url" => "https://fetishmegastore.com/images/2050291934669e45796c22d.jpg",
                "home_url" => "https://fetishmegastore.com/"
            ];
        $subscriptionUrl = $paypalUrl.'/v1/catalogs/products';
        $ch = curl_init();
        curl_setopt_array( $ch, [
            CURLOPT_URL => $subscriptionUrl,
            CURLOPT_HTTPHEADER => [
                "Content-Type: application/json",
                "Authorization: Bearer $accessToken",
            ],
            CURLOPT_SSL_VERIFYHOST => false,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode($data),  // Pass request body
        ]);
        $response = curl_exec( $ch);
        $error = curl_error($ch);
        curl_close($ch);
        if ($error || !$response) {
            return back()->with('error', __('Unable to create PayPal subscription. Please try again.'));
        }
        $responseData = json_decode($response, true);
        $productId = $responseData['id']; 
        return $productId;
    }


    public function generatePaypalPlanId($plan, $trx, $accessToken, $paypalUrl){
        $productID = $this->getProductID($accessToken,$paypalUrl);
        if($plan == 'Monthly' || $plan == '6 Months'){
            $interval_unit = 'MONTH';
        }else if($plan == 'Yearly'){
            $interval_unit = 'YEAR';
        }
        if($plan == 'Monthly'){
            $interval_count = 1;
        }else if($plan == 'Yearly'){
            $interval_count = 1;
        }else if($plan == '6 Months'){
            $interval_count = 6;
        }
             
        
        $data = [
            "product_id" => $productID,
            "name" => config('app.name'),
            "billing_cycles" => [
                [
                    "tenure_type" => "REGULAR",
                    "sequence" => 1,
                    "frequency" => [
                        "interval_unit" => $interval_unit,
                        "interval_count" => $interval_count
                    ],
                    "total_cycles" => 2,
                    "pricing_scheme" => [
                        "fixed_price" => [
                            "value" => $trx->subscription_tokens,
                            "currency_code" => "USD"
                        ]
                    ]
                ]
            ],
            "payment_preferences" => [
                "auto_bill_outstanding" => true,
                "setup_fee" => [
                    "value" => $trx->subscription_tokens,
                    "currency_code" => "USD"
                ],
                "setup_fee_failure_action" => "CONTINUE",
                "payment_failure_threshold" => 3
            ],
            "status" => "ACTIVE"
        ];
        //prd($data);
        $subscriptionUrl = $paypalUrl.'/v1/billing/plans';
        $ch = curl_init();
        curl_setopt_array( $ch, [
            CURLOPT_URL => $subscriptionUrl,
            CURLOPT_HTTPHEADER => [
                "Content-Type: application/json",
                "Authorization: Bearer $accessToken",
            ],
            CURLOPT_SSL_VERIFYHOST => false,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode($data),  // Pass request body
        ]);
        $response = curl_exec( $ch);
        $error = curl_error($ch);
        curl_close($ch);
        if ($error || !$response) {
            return back()->with('error', __('Unable to create PayPal subscription. Please try again.'));
        }
        $responseData = json_decode($response, true);
        $productId = $responseData['id']; 
        return $productId;
    }
    

    public function redirect(Request $request)
    {   
        $paypalResponse         = json_encode($request->all());
        if (!empty($request['id']) && !empty($request['subscription_id'])) {
            $encryptId          = encrypt_decrypt('decrypt', $request['id']);
            if ($encryptId && is_numeric($encryptId)) {
                $order          = Subscription::findOrFail($encryptId);
                $order->status  = 'Active';
                $order->payment_data  = $paypalResponse;
                $order->save();
                return redirect()->route('mySubscriptions')->with('message', __('Channel subscription purchase successfully.'));
            } else {
                return redirect()->route('paypal.processing')->with('error', __('Invalid transaction.'));
            }
        } else {
            return redirect()->route('paypal.processing')->with('error', __('Missing transaction details.'));
        }
        
    }

    // processing
    public function processing()
    {  
      
        $paypalImg = asset('images/paypal-btn.png');
        return Inertia::render('Tokens/PayPalProcessing', compact('paypalImg'));
    }

}
