<?php

namespace App\Http\Controllers;

use App\Models\InventoryItem;
use Illuminate\Contracts\View\View;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use App\Models\Listing;
use App\Models\Store;
use App\Models\System;
use App\Models\User;

use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\Routing\ResponseFactory;

class WelcomeController extends Controller
{
    /**
     * @param Request $request
     * @return Response|Application|ResponseFactory
     */
    public function welcome(Request $request): Response|Application|ResponseFactory
    {
        return $this->respondWithBladeView('welcome', [
            //
        ], ['title_suffix' => null]);
    }

    /**
     * Show the about page.
     * @param Request $request
     * @return Application|ResponseFactory|JsonResponse|Response
     */
    public function about(Request $request): Application|ResponseFactory|JsonResponse|Response
    {
        // Regular HTTP response.
        return $this->respondWithBladeView('about', [
            //
        ], ['title_prefix' => 'About']);
    }

    /**
     * Show the Contact page.
     * @param Request $request
     * @return Application|ResponseFactory|Response
     */
    public function contact(Request $request): Application|ResponseFactory|Response
    {
        return $this->respondWithBladeView('contact', [
            //
        ], ['title_prefix' => 'Contact']);
    }

    /**
     * Show the Terms Of Service.
     * @param Request $request
     * @return Application|ResponseFactory|Response
     */
    public function terms(Request $request): Application|ResponseFactory|Response
    {
        return $this->respondWithBladeView('terms', [
            //
        ], ['title_prefix' => 'Terms Of Service']);
    }

    /**
     * Show the Privacy Policy.
     * @param Request $request
     * @return Application|ResponseFactory|Response
     */
    public function privacy(Request $request): Application|ResponseFactory|Response
    {
        return $this->respondWithBladeView('privacy', [
            //
        ], ['title_prefix' => 'Privacy Policy']);
    }


}
