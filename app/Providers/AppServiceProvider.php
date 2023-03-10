<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
//        try {
//            config([
//                'app.debug' => in_array(get_ip_address(), ["76.149.55.108"])
//            ]);
//        }
//        catch(Exception $ex) {
//            config(['app.debug' => false]);
//        }
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
