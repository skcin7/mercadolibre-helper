<?php

namespace App\Http\Controllers;

use App\Models\InventoryItem;
use Illuminate\Contracts\View\View;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use App\Models\SavedSearch;
use App\Models\User;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\Routing\ResponseFactory;

class AccountController extends Controller
{
    /**
     * Show the authenticated user's account home page.
     * @param Request $request
     * @return Response|Application|ResponseFactory
     */
    public function home(Request $request): Response|Application|ResponseFactory
    {
        return $this->respondWithBladeView('account', [
            //
        ], ['title_suffix' => "My Account - Home"]);
    }

    /**
     * Show the authenticated user's notifications.
     * @param Request $request
     * @return Application|ResponseFactory|Response
     */
    public function notifications(Request $request): Application|ResponseFactory|Response
    {
        return $this->respondWithBladeView('notifications', [
            //
        ], ['title_suffix' => 'Notifications']);
    }

    public function mercadolibreApi(Request $request): Application|ResponseFactory|Response
    {
        return $this->respondWithBladeView('mercadolibre_api', [
            //
        ], ['title_suffix' => 'MercadoLibre API']);
    }

    /**
     * Show the authenticated user's saved searches.
     * @param Request $request
     * @return Application|ResponseFactory|Response
     */
    public function savedSearches(Request $request): Application|ResponseFactory|Response
    {
        $saved_searches = $request->user()->savedSearches()->paginate(100);

        return $this->respondWithBladeView('saved_searches', [
            'saved_searches' => $saved_searches,
        ], ['title_suffix' => 'Saved Searches']);
    }

    /**
     * Show the page to edit the authenticated user's notification channels.
     * @param Request $request
     * @return Application|ResponseFactory|RedirectResponse|Response
     */
    public function notificationChannels(Request $request): Application|ResponseFactory|RedirectResponse|Response
    {
        if($request->isMethod("POST")) {
            $request->validate([
                'notification_channels_json' => [
                    'required',
                    'string',
                    'json',
                ],
            ]);

            $request->user()->setAttribute('notification_channels', json_decode($request->input('notification_channels_json')));
            $request->user()->save();

            return redirect()->route('web.account.notification_channels')
                ->with('flash_message', [
                    'message' => 'Notification channels have been successfully saved!',
                    'type' => 'success',
                ]);
        }

        $notification_channels = $request->user()->getAttribute('notification_channels');

        return $this->respondWithBladeView('notification_channels', [
            'notification_channels' => $notification_channels,
        ], ['title_suffix' => 'Notification Channels']);
    }




}
