<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Models\User;
use App\Models\Video;
use Mcamara\LaravelLocalization\Facades\LaravelLocalization;

class HomeController extends Controller
{
    // index
    public function index()
    {
        // get channel lists
        $channels = User::isStreamer()
                        ->with('categories')
                        ->withCount(['followers', 'subscribers', 'videos'])
                        ->orderByDesc('popularity')
                        ->take(6)
                        ->get();

        // get live now
        $livenow = User::isStreamer()
                        ->where('live_status', 'online')
                        ->with('categories')
                        ->withCount(['followers', 'subscribers', 'videos'])
                        ->orderByDesc('popularity')
                        ->take(6)
                        ->get();

        // latest videos
        $videos = Video::with(['category', 'streamer'])
                            ->latest()
                            ->take(12)
                            ->get();

        $meta_title = opt('seo_title');
        $meta_description = opt('seo_desc');
        $meta_keys = opt('seo_keys');
        $hide_live_channels = opt('hide_live_channels');

        return Inertia::render('Homepage', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'channels' => $channels,
            'livenow' => $livenow,
            'meta_title' => $meta_title,
            'meta_description' => $meta_description,
            'meta_keys' => $meta_keys,
            'videos' => $videos,
            'hide_live_channels' => $hide_live_channels
        ]);
    }

    public function redirectToDashboard(Request $request)
    {
        $request->session()->flash('message', __('Welcome back, :name', ['name' => $request->user()->name]));

        if ($request->user()->is_streamer == 'yes') {
            return to_route('channel', ['user' => $request->user()->username]);
        } else {
            return to_route('home');
        }
    }

   public function changeLang($lang, Request $request)
    {
        $supported = ['en','de','it','fr','es','ru','zh','jp','pt','pl','tr'];

        if (!in_array($lang, $supported)) {
            $lang = 'en';
        }

        session(['change_locale' => $lang]);
        app()->setLocale($lang);

        $previousUrl = url()->previous();
        $localizedUrl = LaravelLocalization::getLocalizedURL($lang, $previousUrl);

        return response()->json([
            'message' => "Language changed to $lang",
            'redirect' => $localizedUrl,
        ]);
    }

    public function emailUnsubscribeUser(Request $request, $id){

        $userId = base64_decode($id);
        //prd($userId);
      
         return view('email_unsubscribe/email-unsubscribe', compact('id'));
        
    }

    public function submitUnsubscribeUser(Request $request, $id)
    {
        $userId = base64_decode($id);

        $reason = $request->input('reason');
        $otherReason = $request->input('other_reason');

        $finalReason = ($reason === 'Other') ? $otherReason : $reason;

        $user = User::find($userId);

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not found.'
            ], 404);
        }
        $user->is_subscribe = 0;
        $user->unsubscribe_reason = $finalReason;
        $user->unsubscribe_at = now();
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'You have been successfully unsubscribed.'
        ]);
    }

}
