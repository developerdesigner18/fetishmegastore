<?php

namespace App\Http\Controllers;


use App\Mail\SubscriptionPurchasedMail;
use App\Models\PurchaseHistory;
use App\Models\Subscription;
use App\Models\Tier;
use App\Models\User;
use App\Notifications\NewSubscriber;
use App\Notifications\ThanksNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Stripe\Stripe;
use Stripe\SetupIntent;

class ReccuringPaymentController extends Controller
{
    
//    NEED TO MANAGE THIs IN PURCHASE HISTORY AND THE SUBSCRIPITON TABLE WHEN THE PAYMENT IS RECCURED
    
    public function createSetupIntent(Request $request)
    {
//        dd(opt('STRIPE_SECRET_KEY'));

        Stripe::setApiKey(opt('STRIPE_SECRET_KEY'));



        $user = Auth::user();

        // If the user doesn't already have a Stripe customer ID, create it
        if (!$user->stripe_customer_id) {
            $customer = \Stripe\Customer::create([
                'email' => $user->email,
            ]);
            $user->update(['stripe_customer_id' => $customer->id]);
        }

        // Create a Setup Intent to save the payment method
        $intent = SetupIntent::create([
            'customer' => $user->stripe_customer_id,
        ]);

        return response()->json(['clientSecret' => $intent->client_secret]);
    }

    public function savePaymentMethod(Request $request)
    {
        Stripe::setApiKey(opt('STRIPE_SECRET_KEY'));

        $user = Auth::user();
        $paymentMethodId = $request->payment_method;

        // Retrieve the payment method instance
        $paymentMethod = \Stripe\PaymentMethod::retrieve($paymentMethodId);

        // Attach the payment method to the customer
        $paymentMethod->attach(['customer' => $user->stripe_customer_id]);

        // Update the default payment method
        $stripeCustomer = \Stripe\Customer::retrieve($user->stripe_customer_id);
        $stripeCustomer->invoice_settings->default_payment_method = $paymentMethodId;
        $stripeCustomer->save();

        // Optionally store the payment method in your database for reference
        $user->update(['default_payment_method' => $paymentMethodId]);

//        $charge = $this->charge();

        return response()->json(['success' => true]);
    }

    public function charge($amount)
    {
        Stripe::setApiKey(opt('STRIPE_SECRET_KEY'));

        $user = Auth::user();
//        $amount = $request->amount*100; // Amount in cents, e.g., $10.00 = 1000
        $amount = $amount*100; // Amount in cents, e.g., $10.00 = 1000

        // Create a PaymentIntent to charge the card
        $paymentIntent = \Stripe\PaymentIntent::create([
            'amount' => $amount,
            'currency' => opt('payment-settings.currency_code'),
            'customer' => $user->stripe_customer_id,
            'payment_method' => $user->default_payment_method,
            'off_session' => true,
            'confirm' => true,
        ]);

        return response()->json(['paymentIntent' => $paymentIntent]);
    }

    public function confirmSubscription(User $user, Tier $tier, Request $request)
    {

        // basic validations
        if ($user->is_streamer !== 'yes') {
            abort(403, __("User is not a streamer"));
        } elseif ($tier->user_id !== $user->id) {
            abort(403, __("Tier is not owned by this streamer"));
        } elseif (!$request->has('plan')) {
            abort(403, __("Plan is required in order to subscribe"));
        }

        // check plan legitimacy
        $plan = $request->plan;

        if (!in_array($plan, ['Monthly', '6 Months', 'Yearly'])) {
            abort(403, __("Plan not reckognized"));
        }

        // compute price for this channel & tier + plan combo
        $price = match ($plan) {
            'Monthly' => $tier->price,
            '6 Months' => $tier->six_months_price,
            'Yearly' => $tier->yearly_price,
        };

        // check authenticated user balance against price
//        if ($request->user()->tokens < $price) {
//            abort(403, __("Your balance of :balance tokens is not enough to buy a plan for :planPrice tokens", ['balance' => $request->user()->tokens, 'planPrice' => $price]));
//        }

        if(!Auth::user()->stripe_customer_id || !Auth::user()->default_payment_method){
            abort(403, __("Please connect your card"));
        }

        // compute expiration
        $expiration = match ($plan) {
            'Monthly' => strtotime("+1 Month"),
            '6 Months' => strtotime("+6 Months"),
            'Yearly' => strtotime("+1 Year"),
        };


        $checkHistory = PurchaseHistory::where(function ($query) use ($request, $tier) {
            $query->where('user_id', auth()->user()->id)
                ->orWhere('ip', $request->ip());
        })
            ->where('type', 'tier')
            ->where('tier_id', $tier->id)
            ->count();

        if ($checkHistory >= 3) {
            return back()->with('message', __('You are not allow to purchase subscription more then 3 times'));
        }

        $charge = $this->charge($price);

        if($charge->getData()->paymentIntent->status != 'succeeded'){
            return back()->with('message', __('Something went wrong status: '.$charge->getData()->paymentIntent->status));
        }

        // create subscription and subtract balance
        $subscription = new Subscription();
        $subscription->tier_id = $tier->id;
        $subscription->streamer_id = $user->id;
        $subscription->subscriber_id = $request->user()->id;
        $subscription->subscription_date = now();
        $subscription->subscription_expires = $expiration;
        $subscription->status = 'Active';
        $subscription->subscription_tokens = $price;
        $subscription->type = $plan;
        $subscription->payment_data = json_encode($charge->getData());
        $subscription->save();

        if ($subscription) {
            $addpurchasehistory = new PurchaseHistory();
            $addpurchasehistory->type = 'tier';
            $addpurchasehistory->tier_id = $tier->id;
            $addpurchasehistory->user_id = auth()->user()->id;
            $addpurchasehistory->ip = $request->ip();
            $addpurchasehistory->save();
        }


        // subtract from user balance
//        $request->user()->decrement('tokens', $price);

        // increase popularity by 10
        $user->increment('popularity', 10);

        try {
            // notify creator
            $user->notify(new NewSubscriber($subscription));

            // notify the subscribe with thanks message if any
            if ($thanksMessage = user_meta('thanks_message', true, $user->id)) {
                $request->user()->notify(new ThanksNotification($subscription, $thanksMessage));
            }

            Mail::to($request->user()->email)->send(new SubscriptionPurchasedMail($subscription));


        } catch (\Exception $e) {
            \Log::error($e->getMessage());
        }


        return to_route('channel', ['user' => $user->username])->with('message', __("Thank you, Your subscription is now Active"));
    }


    public function cancelSubscription(Request $request,$id){
        $subscription = Subscription::find($id);
        if(!$subscription){
            return response()->json(['status' => 0, 'message' => 'subscription not found']);
        }

        if($subscription->subscriber_id != Auth::user()->id){
            return response()->json(['status' => 0, 'message' => 'You cannot perform this action!']);
        }
        
        if($subscription->payment_method == 'PAYPAL'){
            $paypalID = $subscription->paypal_subscription_id;
            $paymentMethod = getPaypalDetails();
            $decoded_credentials = json_decode($paymentMethod->sandbox_credentials, true);
            $clientId = $secretKey = $paypalUrl = '';
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
            
            $subscriptionUrl = $paypalUrl.'/v1/billing/subscriptions/'.$paypalID.'/cancel';
            $accessToken = $this->generateToken($clientId,$secretKey, $paypalUrl);
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
                //CURLOPT_POSTFIELDS => json_encode($subscriptionData),  // Pass request body
            ]);
            $response = curl_exec( $ch);
            $error = curl_error($ch);
            //prd($error);
            curl_close($ch);
            //if($response == ''){   
                //die('ffff');
                $subscription->status = 'Canceled';
                $subscription->save();
            //}
            //die('123');
        }else{   
            $subscription->status = 'Canceled';
            $subscription->save();
        }

        return response()->json(['status' => 1, 'message' => 'Membership cancelled successfully!']);

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
//    CRON CODE
//        function demo(){


//            $subscriptions = Subscription::where('next_payment_date', '<=', now())->get();
//
//            foreach ($subscriptions as $subscription) {
//                $user = $subscription->user;
//                $amount = $subscription->amount;
//
//                try {
//                    // Perform the recurring payment
//                    \Stripe\PaymentIntent::create([
//                        'amount' => $amount,
//                        'currency' => 'usd',
//                        'customer' => $user->stripe_customer_id,
//                        'payment_method' => $user->default_payment_method,
//                        'off_session' => true,
//                        'confirm' => true,
//                    ]);
//
// UPDATE ONLY WHEN PAYMENT STATUS IS "status": "succeeded",

//OTHER STATUS
//The customer completed payment on your checkout page =>	succeeded
//The customer didn’t complete the checkout	=> requires_action
//The customer’s payment failed on your checkout page	=> requires_payment_method

//                    // Update the next payment date
//                    $subscription->update([
//                        'next_payment_date' => $subscription->calculateNextPaymentDate(),
//                    ]);
//                } catch (\Exception $e) {
//                    // Handle payment failure (e.g., send a notification to the user)
//                }
//            }
//        }
}
