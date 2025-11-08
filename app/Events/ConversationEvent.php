<?php

namespace App\Events;

use Illuminate\Support\Facades\Http;

class ConversationEvent
{

//    HOW TO USE
//$subscriptionEvent = new ConversationEvent($trackingId, $conversionValue);
//$response = $subscriptionEvent->callApi('subscription');
    public $forSite = 'bc18ba484b85fa412cecec6d0a098343';
//    public $forSite = '664e3f6733938c1abc603655ceed3f79';

    public $baseUrl = 'http://syndication.exoclick.com/tag.php';

    public $forLeads = '79b11dd4bda90dca0aa8eff1094c7a59';

    public $forSubscription = '664e3f6733938c1abc603655ceed3f79';

    public $tracking;

    public $value;


    public function __construct($tracking, $value = null)
    {
        $this->tracking = $tracking;
        $this->value = $value;
    }

    public function callApi($type)
    {
        $goal = '';
        $url = $this->baseUrl;

        switch ($type) {
            case 'subscription':
                $goal = $this->forSubscription;
                $url .= "?goal={$goal}&tag={$this->tracking}&value={$this->value}";
                break;

            case 'leads':
                $goal = $this->forLeads;
                $url .= "?goal={$goal}&tag={$this->tracking}";
                break;

            case 'site':
                $goal = $this->forSite;
                $url .= "?goal={$goal}&tag={$this->tracking}";
                break;

            default:
                throw new \Exception("Invalid conversion type: {$type}");

        }

        $response = Http::get($url);
//        return $url;
        return $response->successful() ? $response->body() : null;
    }

}
