<?php

namespace App\Http\Controllers\MyAuth;

use App\Http\Controllers\Controller;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Foundation\Auth\SendsPasswordResetEmails;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use Illuminate\View\View;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\JsonResponse;

class ForgotPasswordController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Password Reset Controller
    |--------------------------------------------------------------------------
    |
    | This controller is responsible for handling password reset emails and
    | includes a trait which assists in sending these notifications from
    | your application to your users. Feel free to explore this trait.
    |
    */
    use SendsPasswordResetEmails;

//    /**
//     * Constant representing a successfully sent reminder.
//     *
//     * @var string
//     */
//    const RESET_LINK_SENT = PasswordBroker::RESET_LINK_SENT;
//
//    /**
//     * Constant representing a successfully reset password.
//     *
//     * @var string
//     */
//    const PASSWORD_RESET = PasswordBroker::PASSWORD_RESET;
//
//    /**
//     * Constant representing the user not found response.
//     *
//     * @var string
//     */
//    const INVALID_USER = PasswordBroker::INVALID_USER;
//
//    /**
//     * Constant representing an invalid token.
//     *
//     * @var string
//     */
//    const INVALID_TOKEN = PasswordBroker::INVALID_TOKEN;
//
//    /**
//     * Constant representing a throttled reset attempt.
//     *
//     * @var string
//     */
//    const RESET_THROTTLED = PasswordBroker::RESET_THROTTLED;
//    /**
//     * Constant representing a successfully sent reminder.
//     *
//     * @var string
//     */
//    const RESET_LINK_SENT = 'passwords.sent';
//
//    /**
//     * Constant representing a successfully reset password.
//     *
//     * @var string
//     */
//    const PASSWORD_RESET = 'passwords.reset';
//
//    /**
//     * Constant representing the user not found response.
//     *
//     * @var string
//     */
//    const INVALID_USER = 'passwords.user';
//
//    /**
//     * Constant representing an invalid token.
//     *
//     * @var string
//     */
//    const INVALID_TOKEN = 'passwords.token';
//
//    /**
//     * Constant representing a throttled reset attempt.
//     *
//     * @var string
//     */
//    const RESET_THROTTLED = 'passwords.throttled';

    /**
     * Display the form to request a password reset link.
     * @param Request $request
     * @return Application|ResponseFactory|JsonResponse|RedirectResponse|Response
     * @throws ValidationException
     */
    public function handleForgotPassword(Request $request): Application|ResponseFactory|JsonResponse|RedirectResponse|Response
    {
        // Posts requests should check the email provided and send the account recovery email
        if($request->isMethod("POST")) {
            $request->validate([
                'email' => [
                    'required',
                    'string',
                    'email',
                ],
            ]);

            return $this->sendResetLinkEmail($request);
        }

        return $this->respondWithBladeView('myauth.passwords.forgot_password', [
            //
        ], ['title_prefix' => 'Forgot Password']);
    }

    /**
     * Send a reset link to the given user.
     * @param Request $request
     * @return JsonResponse|RedirectResponse
     * @throws ValidationException
     */
    public function sendResetLinkEmail(Request $request): JsonResponse|RedirectResponse
    {
        $this->validateEmail($request);

        // We will send the password reset link to this user. Once we have attempted
        // to send the link, we will examine the response then see the message we
        // need to show to the user. Finally, we'll send out a proper response.
        $response = $this->broker()->sendResetLink(
            $this->credentials($request)
        );

        return $response == Password::RESET_LINK_SENT
            ? $this->sendResetLinkResponse($request, $response)
            : $this->sendResetLinkFailedResponse($request, $response);
    }
}
