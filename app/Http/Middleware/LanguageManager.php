<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Torann\GeoIP\Facades\GeoIP;
use Illuminate\Support\Facades\Session;
use Mcamara\LaravelLocalization\Facades\LaravelLocalization;

class LanguageManager
{
    protected $availableLocales = [
        'en','de','it','fr','es','ru','zh','jp','pt','pl','tr'
    ];

    public function handle(Request $request, Closure $next)
    {
        // ✅ If user manually selected language → keep that
        if (Session::has('change_locale')) {
            App::setLocale(Session::get('change_locale'));
            return $next($request);
        }

        // ✅ Otherwise detect by GeoIP
        try {
            $ip = $request->ip();
            $response = file_get_contents("https://ipinfo.io/{$ip}/json");
            $details = json_decode($response);
            $countryCode = $details->country ?? 'US';
            $countryCode = strtoupper($countryCode ?? 'US');
        } catch (\Exception $e) {
            $countryCode = 'US';
        }

        $map = config('locale_map');
        $lang = $map[$countryCode] ?? 'en';

        // Save detected locale
        Session::put('change_locale', $lang);
        App::setLocale($lang);

        // ✅ Redirect user to localized version
        $localizedUrl = LaravelLocalization::getLocalizedURL($lang, $request->fullUrl());
        if ($request->fullUrl() !== $localizedUrl) {
            return redirect($localizedUrl);
        }

        return $next($request);
    }
}