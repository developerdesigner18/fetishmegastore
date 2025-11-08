<?php
namespace App\Http\Controllers;

use App\Models\Subscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class PayPalWebhookController extends Controller
{
    public function handleWebhook(Request $request)
    {
        $payload                = $request->getContent();
        $payload                = '{
  "id": "WH-0RD44774E41721427-487281337V896051W",
  "create_time": "2016-04-28T11:37:14Z",
  "resource_type": "Agreement",
  "event_type": "BILLING.SUBSCRIPTION.SUSPENDED",
  "summary": "A billing subscription was suspended",
  "resource": {
    "agreement_details": {
      "outstanding_balance": {
        "value": "0.00"
      },
      "num_cycles_remaining": "5",
      "num_cycles_completed": "0",
      "last_payment_date": "2016-04-28T11:29:54Z",
      "last_payment_amount": {
        "value": "1.00"
      },
      "final_payment_due_date": "1971-07-30T10:00:00Z",
      "failed_payment_count": "0"
    },
    "description": "desc",
    "links": [
      {
        "href": "https://api.paypal.com/v1/payments/billing-agreements/I-PE7JWXKGVN0R",
        "rel": "self",
        "method": "GET"
      }
    ],
    "id": "I-PE7JWXKGVN0R",
    "shipping_address": {
      "recipient_name": "Cool Buyer",
      "line1": "3rd st",
      "line2": "cool",
      "city": "San Jose",
      "state": "CA",
      "postal_code": "95112",
      "country_code": "US"
    },
    "state": "Suspended",
    "plan": {
      "curr_code": "USD",
      "links": [],
      "payment_definitions": [
        {
          "type": "TRIAL",
          "frequency": "Month",
          "frequency_interval": "1",
          "amount": {
            "value": "5.00"
          },
          "cycles": "5",
          "charge_models": [
            {
              "type": "TAX",
              "amount": {
                "value": "1.00"
              }
            },
            {
              "type": "SHIPPING",
              "amount": {
                "value": "1.00"
              }
            }
          ]
        },
        {
          "type": "REGULAR",
          "frequency": "Month",
          "frequency_interval": "1",
          "amount": {
            "value": "10.00"
          },
          "cycles": "15",
          "charge_models": [
            {
              "type": "TAX",
              "amount": {
                "value": "2.00"
              }
            },
            {
              "type": "SHIPPING",
              "amount": {
                "value": "1.00"
              }
            }
          ]
        }
      ],
      "merchant_preferences": {
        "setup_fee": {
          "value": "0.00"
        },
        "auto_bill_amount": "YES",
        "max_fail_attempts": "21"
      }
    },
    "payer": {
      "payment_method": "paypal",
      "status": "verified",
      "payer_info": {
        "email": "coolbuyer@example.com",
        "first_name": "Cool",
        "last_name": "Buyer",
        "payer_id": "XLHKRXRA4H7QY",
        "shipping_address": {
          "recipient_name": "Cool Buyer",
          "line1": "3rd st",
          "line2": "cool",
          "city": "San Jose",
          "state": "CA",
          "postal_code": "95112",
          "country_code": "US"
        }
      }
    },
    "start_date": "2016-04-30T07:00:00Z"
  },
  "links": [
    {
      "href": "https://api.paypal.com/v1/notifications/webhooks-events/WH-0RD44774E41721427-487281337V896051W",
      "rel": "self",
      "method": "GET",
      "encType": "application/json"
    },
    {
      "href": "https://api.paypal.com/v1/notifications/webhooks-events/WH-0RD44774E41721427-487281337V896051W/resend",
      "rel": "resend",
      "method": "POST",
      "encType": "application/json"
    }
  ],
  "event_version": "1.0"
}';
                                       
           // Process the webhook event
           $event = json_decode($payload);
           //prd($event->event_type);
        switch ($event->event_type) {
            case 'BILLING.SUBSCRIPTION.RE-ACTIVATED':
                $this->handleSubscriptionUpdated($event);
                break;

            case 'BILLING.SUBSCRIPTION.CANCELLED':
                $this->handleSubscriptionCancelled($event);
                break;

            case 'BILLING.SUBSCRIPTION.SUSPENDED':
                $this->handleSubscriptionSuspended($event);
                break;

            default:
                Log::info("Unhandled PayPal event: " . $event->event_type);
                break;
        }
        return response('OK', 200);
    }

    private function handleSubscriptionUpdated($event)
    {
        $paypal_subscription_id = $event->resource->id;
        //$paypal_subscription_id = 'I-XW5TNWU28HSW';
        $subscriptionData = Subscription::where('paypal_subscription_id',$paypal_subscription_id)->first(); 
        $expiration = $event->resource->agreement_details->next_billing_date;
        $order          = Subscription::findOrFail($subscriptionData->id);
        $order->status  = 'Active';
        $order->subscription_expires  = $expiration;
        $order->save();
        Log::info('Subscription Created: ', (array) $event);
    }

    private function handleSubscriptionCancelled($event)
    {
        $paypal_subscription_id     = $event->resource->id;
        $paypal_subscription_id     = 'I-XW5TNWU28HSW';
        $subscriptionData           = Subscription::where('paypal_subscription_id',$paypal_subscription_id)->first(); 
        $order                      = Subscription::findOrFail($subscriptionData->id);
        $order->status              = 'Canceled';
        $order->save();
        Log::info('Subscription Cancelled: ', (array) $event);
    }

    private function handleSubscriptionSuspended($event)
    {
        $paypal_subscription_id     = $event->resource->id;
        $paypal_subscription_id     = 'I-XW5TNWU28HSW';
        $subscriptionData           = Subscription::where('paypal_subscription_id',$paypal_subscription_id)->first(); 
        $order                      = Subscription::findOrFail($subscriptionData->id);
        $order->status              = 'Canceled';
        $order->save();
        Log::info('Subscription Suspended: ', (array) $event);
        // Your logic here, e.g., update subscription status
    }
}
