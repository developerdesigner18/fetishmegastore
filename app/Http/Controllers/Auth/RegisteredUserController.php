<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\TokenSale;
use App\Providers\RouteServiceProvider;
use App\Rules\UniqueUsernameOnSignup;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Session;
use Illuminate\Validation\Rules;
use Illuminate\Support\Str;
use Inertia\Inertia;

class RegisteredUserController extends Controller
{
    // show user type selection page
    public function signup()
    {
        return Inertia::render('Auth/Signup',[
            'logoIcon' => asset(opt('site_logo')),
            'streamerIcon' => asset('streamerIcon.jpeg')
        ]);
    }

    public function applyNow()
    {
        return Inertia::render('Auth/applyNow',[
            'logoIcon' => asset(opt('site_logo')),
            'pillowImage' => asset('Pillowfight.jpg'),
            'streamerIcon' => asset('streamerIcon.jpeg')
        ]);
    }

    /**
     * Display the registration view.
     *
     * @return \Inertia\Response
     */
    public function create()
    {   
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request)
    {
        $isAffiliate = $request->boolean('is_affiliate'); 
        $request->validate([
            'username' => ['required', new UniqueUsernameOnSignup(), 'regex:/^[\w-]*$/'],
//            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'is_streamer' => ['required', 'in:yes,no']
        ]);

        

//        if($request->is_streamer == 'yes' && $request->is_mail_verified == false){
//            session()->flash('message', __("Please verify the email first!"));
//
//            return to_route('streamer.signup');
//        }


        $sign_up_bonus_limit = (int) opt('sign_up_bonus') ?? 0;

        // user data
        $userData = [
            'username' => $request->username,
            'name' => $request->name ?? $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'is_streamer' => $request->is_streamer,
            'tokens' => $sign_up_bonus_limit,
        ];

        // Add affiliate-related
        if ($isAffiliate) {
            $userData = array_merge($userData, [
                'is_affiliate_vendor' => 1,
                'affiliate_vendor_verifiy' => 1,
                'affiliate_vendor_verifiy_at' => now(),
                'affiliate_code' => $this->generateAlphaNumericCode(),
            ]);
        }

        // $user = User::create([
        //     'username' => $request->username,
        //     'name' => $request->name ?? $request->username,
        //     'email' => $request->email,
        //     'password' => Hash::make($request->password),
        //     'is_streamer' => $request->is_streamer,
        //     'tokens' => $sign_up_bonus_limit,
        // ]);

        $user = User::create($userData);   

        // if category
        if ($request->filled('category')) {
            $user->categories()->attach($request->category);
        }

        // if streamer identity verification is required
        if (opt('streamersIdentityRequired') == 'No' && $request->is_streamer == 'yes') {
            $user->is_streamer_verified = 'yes';
            $user->streamer_verification_sent = 'yes';
            $user->save();
        }

    
        // 1 free token on registration
        TokenSale::create([
        'user_id' => $user->id,
        'tokens' => $sign_up_bonus_limit,
        'amount' => 0,
        'gateway' => 'Signup Bonus',
        'status' => 'paid',
        ]);

        event(new Registered($user));

        Auth::login($user);

        return redirect(RouteServiceProvider::HOME);
    }

    public function sendEmail(Request $request){
        try {

            $otp = rand(1111,9999);

            $mail = $request->email;

            Mail::send('emails.otp', ['otp' => $otp], function ($m) use ($mail) {
//                $m->from(env('MAIL_FROM_ADDRESS'));
                $m->to($mail);
                $m->subject('Email Verification');
            });

            Session::put('SESSION_OTP',$otp);

            return response()->json(['status' => true , 'message' => 'success'],200);
        }catch (\Exception $exception){
            return response()->json(['status' => false , 'message' => $exception->getMessage()],500);
        }
    }

    public function verifyEmail(Request $request){
        if($request->code == Session::get('SESSION_OTP')){
            return response()->json(['status' => true , 'message' => 'success']);
        }else{
            return response()->json(['status' => false , 'message' => "code doesn't match"],500);
        }
    }

    private function generateAlphaNumericCode($length = 6)
{
    return strtoupper(Str::random($length));
}

}
