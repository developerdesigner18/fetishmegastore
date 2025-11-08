<?php

namespace App\Console\Commands;

use App\Models\Subscription;
use App\Models\Tier;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Console\Command;
use App\Notifications\SubscriptionStatus;
use Stripe\Stripe;

class ReccuringPayment extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'reccur-payment';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $today = Carbon::now();
        $getsubcritions = Subscription::where('status','Active')->where('type','!=',null)->where('subscription_expires','<=',$today)->get();

        foreach ($getsubcritions as $subscriptionDetails){
            $plan = $subscriptionDetails->type;

            $tier = Tier::where('id',$subscriptionDetails->tier_id)->first();

            $user = User::where('id',$subscriptionDetails->subscriber_id)->first();

            $streamer = User::where('id',$subscriptionDetails->streamer_id)->first();

            if(!$user){
                $subscriptionDetails->update(['status' => 'Canceled']);
                continue;
            }

            if(!$tier || !$streamer){
                $user->notify(new SubscriptionStatus("Plan can't be continue because streamer or membership plan is not available"));
                continue;
            }

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


            $charge = $this->charge($price,$user);

            if($charge->getData()->paymentIntent->status != 'succeeded'){
//            NEED TO SEND NOTIFICATION TO USER ABOUT THE UPDATE;
                $user->notify(new SubscriptionStatus("Unable to charge",$charge->getData()));
                continue;
            }

            $subscriptionDetails->update(['subscription_expires' => $expiration , 'payment_data' => json_encode($charge->getData())]);

//            NEED TO SEND NOTIFICATION TO USER ABOUT THE UPDATE;
            $user->notify(new SubscriptionStatus("Your membership ".$tier->tier_name." of channel ".$streamer->username." has been renewed successfully!",$charge->getData()));

//            dd($price,$expiration);
        }

        return Command::SUCCESS;
    }

    public function charge($amount,$userDetails)
    {
        Stripe::setApiKey(env('STRIPE_SECRET'));

        $user = $userDetails;
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
}
