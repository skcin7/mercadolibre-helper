<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MyAuth\ForgotPasswordController;
use App\Http\Controllers\MyAuth\LoginController;
use App\Http\Controllers\MyAuth\LogoutController;
use App\Http\Controllers\MyAuth\RegisterController;
use App\Http\Controllers\MyAuth\ResetPasswordController;
use App\Http\Controllers\AccountController;
use App\Http\Controllers\MercadoLibreApiController;
use App\Http\Controllers\MercadoLibreController;
use App\Http\Controllers\SavedSearchesController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\WelcomeController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

  /*_                _ _           _   _
   / \   _ __  _ __ | (_) ___ __ _| |_(_) ___  _ __
  / _ \ | '_ \| '_ \| | |/ __/ _` | __| |/ _ \| '_ \
 / ___ \| |_) | |_) | | | (_| (_| | |_| | (_) | | | |
/_/   \_\ .__/| .__/|_|_|\___\__,_|\__|_|\___/|_| |_|
        |_|   |_| The Application's Basic Routes*/
Route::get('/', [WelcomeController::class, 'welcome'])->name('web.welcome');
Route::get('about', [WelcomeController::class, 'about'])->name('web.about');
Route::get('contact', [WelcomeController::class, 'contact'])->name('web.contact');
Route::get('terms', [WelcomeController::class, 'terms'])->name('web.terms');
Route::get('privacy', [WelcomeController::class, 'privacy'])->name('web.privacy');

Route::get('search/{id?}', [SearchController::class, 'index'])->name('web.search');
Route::post('search/find_matched_listings', [SearchController::class, 'findMatchedListings'])->name('web.search.find_listings');
Route::post('search', [SearchController::class, 'create'])->name('web.search.create');
Route::put('search/{id}', [SearchController::class, 'update'])->name('web.search.update');
Route::delete('search/{id}', [SearchController::class, 'delete'])->name('web.search.delete');


/*  _         _   _                _   _           _   _
   / \  _   _| |_| |__   ___ _ __ | |_(_) ___ __ _| |_(_) ___  _ __
  / _ \| | | | __| '_ \ / _ \ '_ \| __| |/ __/ _` | __| |/ _ \| '_ \
 / ___ \ |_| | |_| | | |  __/ | | | |_| | (_| (_| | |_| | (_) | | | |
/_/   \_\__,_|\__|_| |_|\___|_| |_|\__|_|\___\__,_|\__|_|\___/|_| |_|
Authentication Routes */
Route::group(['prefix' => 'auth'], function() {
    Route::match(['get', 'post'], 'login', [LoginController::class, 'handleLogin'])->name('web.auth.login')->middleware('guest');
    Route::match(['post'], 'logout', [LogoutController::class, 'handleLogout'])->name('web.auth.logout')->middleware('auth');
    Route::match(['get', 'post'], 'register', [RegisterController::class, 'handleRegistration'])->name('web.auth.register')->middleware('guest');
//    Route::match(['get', 'post'], 'forgot_password', [ForgotPasswordController::class, 'handleForgotPassword'])->name('web.auth.forgot_password')->middleware('guest');
//    Route::match(['get', 'post'], 'reset_password', [ResetPasswordController::class, 'showResetForm'])->name('web.auth.reset_password')->middleware('guest');
});

Route::group(['middleware' => 'auth', 'prefix' => 'account'], function() {
    Route::get('/', [AccountController::class, 'home'])->name('web.account');
    Route::get('notifications', [AccountController::class, 'notifications'])->name('web.account.notifications');
    Route::group(['prefix' => 'mercadolibre_api'], function() {
        Route::get('/', [MercadoLibreApiController::class, 'index'])->name('web.account.mercadolibre_api');
        Route::get('get_authorization', [MercadoLibreApiController::class, 'getAuthorization'])->name('web.account.mercadolibre_api.get_authorization');
        Route::get('success', [MercadoLibreApiController::class, 'success'])->name('web.account.mercadolibre_api.success');
        Route::get('notifications', [MercadoLibreApiController::class, 'notifications'])->name('web.account.mercadolibre_api.notifications');
    });
    Route::get('saved_searches', [AccountController::class, 'savedSearches'])->name('web.account.saved_searches');
    Route::match(['get', 'post'], 'notification_channels', [AccountController::class, 'notificationChannels'])->name('web.account.notification_channels');
});

//Route::group(['prefix' => 'mercadolibre'], function() {
//    Route::get('sites', [MercadoLibreController::class, 'sites'])->name('web.mercadolibre.sites');
//});

//Route::group(['prefix' => 'saved_searches'], function() {
//    Route::get('/', [SavedSearchesController::class, 'index'])->name('web.saved_searches');
//    Route::get('{id}', [SavedSearchesController::class, 'get'])->name('web.saved_searches.get')
//        ->where('id', '(?!^([create|update|delete])$)([a-zA-Z0-9-]+)');
//    Route::match(['get', 'post'], 'create', [SavedSearchesController::class, 'create'])->name('web.saved_searches.create');
//    Route::post('update', [SavedSearchesController::class, 'update'])->name('web.saved_searches.update');
//    Route::post('delete', [SavedSearchesController::class, 'delete'])->name('web.saved_searches.delete');
//});



//Route::get('/', function () {
//    return view('welcome');
//});

Auth::routes([
    "logout" => false,
    "login" => false,
    "register" => false,
    "reset" => false,
    "verify" => false,
]);

Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');
