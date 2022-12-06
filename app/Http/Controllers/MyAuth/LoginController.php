<?php

namespace App\Http\Controllers\MyAuth;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Providers\RouteServiceProvider;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Response;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;
use Illuminate\Validation\ValidationException;
use Illuminate\View\View;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */
    use AuthenticatesUsers;

    /**
     * Where to redirect users after login.
     * @var string
     */
//    protected string $redirectTo = RouteServiceProvider::HOME;
    protected string $redirectTo = '/';

    /**
     * Handle a login to the application.
     * @param Request $request
     * @return Application|ResponseFactory|JsonResponse|RedirectResponse|Response|SymfonyResponse
     * @throws ValidationException
     */
    public function handleLogin(Request $request): Application|ResponseFactory|JsonResponse|RedirectResponse|Response|SymfonyResponse
    {
        if($request->isMethod('post')) {
            // Ensure login credentials are present, or throw an exception if not.
            $this->validateLogin($request);

            // If the class is using the ThrottlesLogins trait, we can automatically throttle
            // the login attempts for this application. We'll key this by the username and
            // the IP address of the client making these requests into this application.
            if(method_exists($this, 'hasTooManyLoginAttempts') &&
                $this->hasTooManyLoginAttempts($request)) {
                $this->fireLockoutEvent($request);

                return $this->sendLockoutResponse($request);
            }

            if($this->attemptLogin($request)) {
                return $this->sendLoginResponse($request);
            }

            // If the login attempt was unsuccessful we will increment the number of attempts
            // to login and redirect the user back to the login form. Of course, when this
            // user surpasses their maximum number of attempts they will get locked out.
            $this->incrementLoginAttempts($request);

            return $this->sendFailedLoginResponse($request);
        }

        // After this the HTTP request method is sure to be GET.
        return $this->respondWithBladeView('myauth.login', [
            //
        ], ['title_prefix' => 'Login']);
    }

    /**
     * Send the response after the user was authenticated.
     * @param Request $request
     * @return RedirectResponse|JsonResponse
     */
    protected function sendLoginResponse(Request $request): RedirectResponse|JsonResponse
    {
        if( !$request->wantsJson() ) {
            $request->session()->regenerate();
        }

        $this->clearLoginAttempts($request);

        if($response = $this->authenticated($request, $this->guard()->user())) {
            return $response;
        }

        return redirect()->intended($this->redirectPath());

        return $request->wantsJson()
            ? new JsonResponse([], 204)
            : redirect()->intended($this->redirectPath());
    }

    /**
     * Validate the HTTP login request.
     * @param Request $request
     * @return void
     * @throws ValidationException
     */
    protected function validateLogin(Request $request): void
    {
        $request->validate([
            'username_or_email' => [
                'required',
                'string',
            ],
            'password' => [
                'required',
                'string',
            ],
        ]);
    }

    /**
     * Attempt to log the user into the application.
     * @param Request $request
     * @return bool
     */
    protected function attemptLogin(Request $request): bool
    {
        $loginField = filter_var($request->input('username_or_email'), FILTER_VALIDATE_EMAIL) ? 'email' : 'name';
        return $this->guard()->attempt([
            $loginField => $request->input('username_or_email'),
            'password' => $request->input('password')
        ], $request->filled('remember'));
    }

    /**
     * The user has been authenticated.
     * @param Request $request
     * @param mixed $user
     * @return mixed
     */
    protected function authenticated(Request $request, $user)
    {
        if($request->expectsJson()) {
            $auth_token = $this->guard()->user()->createToken('authToken');
//            dd($auth_token);
//            $accessToken = $this->guard()->user()->createToken('authToken')->accessToken;

            return $this->respondWithJson(
                new UserResource($this->guard()->user()),
                "Login attempt was successful.",
                200,
                [
                    'access_token' => $auth_token->accessToken,
//                    'user' => new UserResource($this->guard()->user()),
                ]
            );
        }
    }

    /**
     * Get the failed login response instance.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Symfony\Component\HttpFoundation\Response
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    protected function sendFailedLoginResponse(Request $request)
    {
        throw ValidationException::withMessages([
            'username_or_email' => [trans('auth.failed')],
        ]);
    }

    /**
     * Get the post register / login redirect path.
     * @return string
     */
    public function redirectPath(): string
    {
        // Do your logic to flash data to session...
        session()->flash('flash_message', [
            'message' => 'Welcome back, <strong>@' . request()->user()->name . '</strong>! You have been logged in.',
            'type' => 'success',
        ]);

        return property_exists($this, 'redirectTo') ? $this->redirectTo : '/home';
    }


}
