<style>
    .proceed-to-pay {
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 25px 40px 0px 60px;
    }
    button.paypal-submit {
        width: 160px;
        padding: 15px;
        background: #360000cf;
        color: #fff;
        border-radius: 10px;
        border: none;
        font-size: 16px;
    }
    button.paypal-submit:hover {
        background: #fff;
        color: #360000cf;
        border: 1px solid #360000cf;
    }  
    .proceed-img img {
        width: 300px;
    }
    #loader-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5); /* Semi-transparent dark background */
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 9999; /* Ensure it is on top of everything */
    }

    /* Loader container */
    .loader-container {
        text-align: center;
        color: white;
    }

    /* Spinner styling (centered within loader) */
    .spinner {
        width: 50px;
        height: 50px;
        margin-bottom: 20px;
    }

    /* Optional: Adjust the text below the spinner */
    #loader-overlay p {
        font-size: 20px;
        color: white;
        margin-top: 10px;
    } 
    
        @media only screen and (max-width: 767px) {
            .proceed-to-pay {
	display: grid;
	justify-content: unset;
	align-items: center;
	padding: 0;
	font-size: 10px;
	padding: 25px 0px 0px 10px;
}
.proceed-img img {
	width: 150px;
}
.proceed-img {
	padding: 20px 0px 0px 10px;
}
button.paypal-submit {
	width: 110px;
	padding: 6px;
	font-size: 14px;
}
}
</style>   
<div class="proceed-to-pay">
    <div class="pay-section">
        <div class="flex justify-center items-center">
            <div class="mr-2">
            </div>
            <div>
                <h3 class="text-3xl font-semibold dark:text-white text-center">
                    {{ __('PayPal') }}
                </h3>
            </div>
        </div>
        <h3 class="mt-5 text-2xl font-semibold dark:text-white text-center">
            {{ __('You are purchasing :tokensAmount tokens for :moneyAmount', [
                'tokensAmount' => $tokenPack->tokensFormatted,
                'moneyAmount' => "{$currencySymbol}{$tokenPack->price}",
            ]) }}
        </h3>
        <div class="mx-auto justify-center text-center"></div>
        <div class="mt-5 justify-center mx-auto text-center">
            <form action="{{ $paypalUrl }}" method="POST" id="paypalForm">
                <input type="hidden" name="business" value="{{ $paypalEmail }}">
                <input type="hidden" name="return" value="{{ $redirectURL }}">
                <input type="hidden" name="cancel_return" value="{{ route('token.packages') }}">
                <input type="hidden" name="notify_url" value="{{ route('paypal.ipn') }}">
                <input type="hidden" name="currency_code" value="{{ $currencyCode }}">
                <input type="hidden" name="amount" value="{{ $sale->amount }}">
                <input type="hidden" name="item_name" value="{{ $sale->tokens }} tokens">
                <input type="hidden" name="custom" value="{{ $sale->id }}">
                <input type="hidden" name="cmd" value="_xclick">
                <input type="hidden" name="rm" value="2">

                <!-- Button and loader -->
                <button class="paypal-submit" type="button" id="paypalSubmitBtn">Proceed to Pay</button>

                <!-- Loader Overlay (initially hidden) -->
                <div id="loader-overlay" style="display:none;">
                    <div class="loader-container">
                        <img src="{{asset('images/loader.gif')}}" alt="Loading..." class="spinner">
                        <p>Please wait...</p>
                    </div>
                </div>
            </form>
        </div>
    </div>
    <div class="w-75 proceed-img">
        <img src="{{asset('images/2050291934669e45796c22d.jpg')}}" />
    </div>
</div>
<script>
    document.getElementById('paypalSubmitBtn').addEventListener('click', function(event) {
        event.preventDefault(); // Prevent form submission

        // Show the loader overlay
        document.getElementById('loader-overlay').style.display = 'flex';

        // Disable the button to prevent multiple clicks
        document.getElementById('paypalSubmitBtn').disabled = true;

        // Submit the form after a short delay to ensure the spinner is visible
        setTimeout(function() {
            document.getElementById('paypalForm').submit();
        }, 1000); // Adjust delay as needed (1000ms = 1 second)
    });
</script>
