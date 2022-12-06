<?php

namespace App\Http\Controllers\MyAuth;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Providers\RouteServiceProvider;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Response;
use Illuminate\Validation\ValidationException;
use Illuminate\View\View;
use Illuminate\Support\Facades\Auth;

class LogoutController extends Controller
{
    use AuthenticatesUsers;

    /**
     * Log the user out of the application.
     * @param Request $request
     * @return RedirectResponse|JsonResponse
     */
    public function handleLogout(Request $request): RedirectResponse|JsonResponse
    {
        Auth::guard()->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        if($response = $this->loggedOut($request)) {
            return $response;
        }

        return $request->wantsJson()
            ? new JsonResponse([], 204)
            : redirect('/');
    }

    /**
     * The user has logged out of the application.
     * @param Request $request
     * @return RedirectResponse|Response
     */
    protected function loggedOut(Request $request): RedirectResponse|Response
    {
        if($request->expectsJson()) {
            return new Response('', 204);
        }
        return redirect()->route('web.welcome')
            ->with('flash_message', [
                'message' => $this->getLogoutMessage(),
                'type' => 'success',
                'bottom_margin' => 'mb-0',
            ]);
    }

    /**
     * Get the message that displays when a user logs out.
     * @return string
     */
    private function getLogoutMessage(): string
    {
        return '<strong>You have been successfully logged out.</strong> See you later.<br/><a class="hover_up" href="' . route('web.auth.login') . '">Click here to log in again.</a>';
    }


}
