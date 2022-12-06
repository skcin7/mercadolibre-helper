<?php

namespace App\Http\Controllers\MyAuth;

use App\Http\Controllers\Controller;
use App\Providers\RouteServiceProvider;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Contracts\Auth\StatefulGuard;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Foundation\Auth\RegistersUsers;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\View\View;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
//use Illuminate\Support\Facades\Validator as ValidatorFacade;
use App\Rules\PasswordPolicyRule;
use App\Rules\UsernamePolicyRule;
//use Illuminate\Contracts\Validation\Validator;
//use Illuminate\Support\Facades\Validator;
use Validator;

class RegisterController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Register Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles the registration of new users as well as their
    | validation and creation. By default this controller uses a trait to
    | provide this functionality without requiring any additional code.
    |
    */
    use RegistersUsers;

    /**
     * Where to redirect users after registration.
     * @var string
     */
    protected string $redirectTo = RouteServiceProvider::HOME;


//    /**
//     * Handle a registration request for the application.
//     *
//     * @param  \Illuminate\Http\Request  $request
//     * @return \Illuminate\Http\RedirectResponse|\Illuminate\Http\JsonResponse
//     */
//    public function register(Request $request)
//    {
//        $this->validator($request->all())->validate();
//
//        event(new Registered($user = $this->create($request->all())));
//
//        $this->guard()->login($user);
//
//        if ($response = $this->registered($request, $user)) {
//            return $response;
//        }
//
//        return $request->wantsJson()
//            ? new JsonResponse([], 201)
//            : redirect($this->redirectPath());
//    }

    /**
     * Handle a registration.
     * @param Request $request
     * @return Application|ResponseFactory|JsonResponse|RedirectResponse|Response|Redirector
     * @throws ValidationException
     */
    public function handleRegistration(Request $request): Application|ResponseFactory|JsonResponse|RedirectResponse|Response|Redirector
    {
        if($request->isMethod('post')) {
            // Validation will throw exceptions if invalid.
            $validator = $this->getValidator($request->all());
            if($validator->fails()) {
                return redirect()->route('web.auth.register')
                    ->withErrors($validator)
                    ->withInput();
            }

            event(new Registered($user = $this->createUser($request->all())));

            $this->guard()->login($user);

            if($response = $this->afterUserWasRegistration($request, $user)) {
                return $response;
            }

            return $request->wantsJson()
                ? new JsonResponse([], 201)
                : redirect($this->redirectPath());
        }

        // After this the HTTP request method is sure to be GET.
        return $this->respondWithBladeView('myauth.register', [
            //
        ], ['title_prefix' => 'Create Account']);
    }

    /**
     * Get a validator for an incoming registration request.
     * @param array $data
     * @return \Illuminate\Validation\Validator
     */
    protected function getValidator(array $data): \Illuminate\Validation\Validator
    {
        return Validator::make($data, [
            'username' => [
                'required',
                'string',
                'max:255',
                'unique:users,name',
                (new UsernamePolicyRule()),
            ],
            'email' => [
                'required',
                'string',
                'max:255',
                'email',
                'unique:users,email',
            ],
            'password' => [
                'required',
                'string',
                'min:1',
                'confirmed',
                (new PasswordPolicyRule([
                    'min' => 1,
                    'max' => 256,
                    'regex' => 1,
                ])),
            ],
            'required_conditions' => [
                'accepted',
            ],
        ]);
    }

    /**
     * Create a new user instance after a valid registration.
     * @param array $data
     * @return User
     */
    protected function createUser(array $data): User
    {
        $user = (new User())->forceFill([
            'name' => $data['username'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);
        $user->save();
        return $user;
    }

    /**
     * Get the guard to be used during registration.
     * @return StatefulGuard
     */
    protected function guard(): StatefulGuard
    {
        return Auth::guard();
    }

    /**
     * After the user was registered, run this code.
     * @param Request $request
     * @param User $user
     * @return mixed
     */
    protected function afterUserWasRegistration(Request $request, User $user): mixed
    {
        return null;
    }


}
