<?php

namespace App\Http\Controllers;

use App\Models\TokenPack;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class CryptoController extends Controller
{
    private $sign;

    private $publicKey = 'ced69bcb-4276-48be-a49e-dfeb7f804c8e';

    private $privateKey = 'ba16eeac-9d41-495f-9806-fdaeca41c1ed';

    private $apiUrl = 'https://app.spcr.re/api/cpma/';

    private $merchantId = 326;

    private $wallets;

    public function __construct()
    {
        $this->middleware('auth')->except(['getTokens']);
        $time = time();
        $publicKey = $this->publicKey;
        $privateKey = $this->privateKey;
        $sign = hash_hmac('sha256', "publicKey=$publicKey&timesstamp=$time", $privateKey);
        $this->sign = $sign;

        $this->wallets = [
            'BNB' => [
                'wallet_id' => 677463,
                'name' => 'Binance',
                'img' => asset('images/bnb.png')
            ],
            'TRX' => [
                'wallet_id' => 677462,
                'name' => 'Tronix',
                'img' => asset('images/trx.png')
            ],
            'USDT_BEP20' => [
                'wallet_id' => 677460,
                'name' => 'USDT (BEP20)',
                'img' => asset('images/USDT_BEP20.png')
            ],
            'USDT_TRC20' => [
                'wallet_id' => 677456,
                'name' => 'USDT (TRC20)',
                'img' => asset('images/USDT_TRC20.svg')
            ],
            'LTC' => [
                'wallet_id' => 677455,
                'name' => 'Litecoin',
                'img' => asset('images/LTC.png')
            ],
            'BTC' => [
                'wallet_id' => 677453,
                'name' => 'Bitcoin',
                'img' => asset('images/bitcoin.png')
            ],
        ];
    }

    public function index()
    {
        $data = [
            "merchant_id" => $this->merchantId,
            "service_id" => 1214,
            "currency" => "TRX",
            "amount" => 25000000,
            "fields" => [
            ],
            "original_amount" => [
                "amount" => 6,
                "currency" => "EUR"
            ],
            "source" => "API",
            "wallet_to_id" => 677462,
            "callback_url" => "https://fetishmegastore.com/",
            "confirm_url" => "https://fetishmegastore.com/",
            "locale" => "en",
            "wallet_address" => "TVtddEDJJUiui3ykap2gLuoFxH1t5Y4d8T"
        ];

        $apiResponse = $this->callTheAPI($data, 'transactions/charge');

//        dd($data, $apiResponse);
    }

    public function callTheAPI($payload, $endpoint, $method = 'post')
    {
        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'Accept' => 'application/json',
            'timestamp' => time(),
            'signature' => $this->sign,
            'publicKey' => $this->publicKey,
        ])->$method("$this->apiUrl$endpoint", $payload);

        return $response->json();
    }

    public function purchaseView(Request $request, TokenPack $tokenPack)
    {
        $wallets = $this->wallets;
        return Inertia::render('Tokens/CryptoTransfer', compact('tokenPack','wallets'));
    }

    public function getWalletAddress(Request $request)
    {
        // Define precision for each supported cryptocurrency
        $precisionMap = [
            'BTC' => 8,
            'LTC' => 8,
            'BCH' => 8,
            'TRX' => 6,
            'USDT_TRC20' => 6,
            'USDT_ETH' => 6,
            'ETH' => 18,
            'DOGE' => 8,
            'XRP' => 6,
            'USDT_BEP20' => 6,
            'BNB' => 18,
        ];

        // Get the wallet ID from the request
        $walletId = $request->wallet['wallet_id'];

        // Find the corresponding wallet from the predefined wallets array
        $selectedWallet = null;
        foreach ($this->wallets as $key => $wallet) {
            if ($wallet['wallet_id'] == $walletId) {
                $selectedWallet = $key;
                break;
            }
        }

        // If the wallet is found, proceed with the calculation
        if ($selectedWallet && isset($precisionMap[$selectedWallet])) {
            // Get the amount in USD/Euro from the request
            $amountInUSD = $request->token['price']; // This is the amount to be converted

            // Get the precision for the selected cryptocurrency
            $precision = $precisionMap[$selectedWallet];

            // Calculate the transferable amount in the cryptocurrency
            $transferableAmount = $amountInUSD * pow(10, $precision);
        } else {
            return response()->json(['address' => 'Invalid wallet or precision not found']);
        }

        // Prepare the data for the API call
        $data = [
            "merchant_id" => $this->merchantId,
            "wallet_id" => $walletId,
        ];

        // Call the API to get the wallet address
        $apiResponse = $this->callTheAPI($data, 'wallets/list_addresses');

        // Extract the wallet address from the API response
        $walletAddress = $apiResponse['result']['data']['addresses'][0] ?? 'No Address Found';

        // Return the wallet address and the calculated transferable amount
        return response()->json(['address' => $walletAddress, 'amount' => $transferableAmount]);
    }



}
