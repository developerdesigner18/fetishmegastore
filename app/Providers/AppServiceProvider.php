<?php

namespace App\Providers;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use Illuminate\Support\Facades\App;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {  
         Inertia::share([
            'current_locale' => fn() => App::getLocale(),
        ]);
        //URL::forceScheme('https');
        Model::unguard();
        View::composer('*', function () {
        affiliateTracksUser();
    });
        
    }
}
