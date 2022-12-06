<?php

namespace App\Http\Controllers;

use App\Models\InventoryItem;
use GuzzleHttp\Client as GuzzleHttpClient;
use Illuminate\Contracts\View\View;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;
use Illuminate\Support\Facades\Auth;
use App\Models\SavedSearch;
use App\Models\User;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\Routing\ResponseFactory;

class MercadoLibreApiController extends Controller
{
    /**
     * Show the MercadoLibre API settings page.
     * @param Request $request
     * @return Application|ResponseFactory|Response
     */
    public function index(Request $request): Application|ResponseFactory|Response
    {
        return $this->respondWithBladeView('mercadolibre_api', [
            //
        ], ['title_suffix' => 'MercadoLibre API']);
    }

    /**
     * Get a new API authorization with MercadoLibre.
     * @param Request $request
     * @return Application|RedirectResponse|Redirector|Response|ResponseFactory
     */
    public function getAuthorization(Request $request): Application|RedirectResponse|Redirector|Response|ResponseFactory
    {
        $http_query_string = http_build_query([
            "response_type" => "code",
            "client_id" => config('mercadolibre.application_id', ''),
            "redirect_uri" => config('mercadolibre.redirect_uri', ''),
            "code_challenge" => config('mercadolibre.application_secret', ''),
            "code_challenge_method" => "plain",
        ]);

        return redirect("https://auth.mercadolibre.com.ar/authorization?" . $http_query_string);

//        "https://auth.mercadolibre.com.ar/authorization?response_type=code&client_id=$APP_ID&redirect_uri=$YOUR_URL&code_challenge=$CODE_CHALLENGE&code_challenge_method=$CODE_METHOD"

        // Redirect user to the eBay authorization page to grant the API authorization.
//        return redirect($environment_modes[$api_mode]["url"] . '?' . $http_query_string);
    }

    /**
     * Handle a successful API authorization - exchange the code for a use-able token.
     * @param Request $request
     * @return Application|ResponseFactory|Response
     */
    public function success(Request $request): Application|ResponseFactory|Response
    {
        if($request->input('error')) {
            return redirect()->route('web.account.mercadolibre_api')
                ->with('flash_message', [
                    'message' => 'An error has occurred getting the Mercado Libre API authorization. :-(<br/>Error URL:' . $request->fullUrl(),
                    'type' => 'danger',
                ]);
        }

//        $authorization_code = $request->input('code');
//        $expires_in = $request->input('expires_in');
//
//        // https://developer.ebay.com/api-docs/static/oauth-auth-code-grant-request.html
//        $environment_modes = [
//            "sandbox" => [
//                "client_id" => config('ebay.sandbox.credentials.client_id'),
//                "client_secret" => config('ebay.sandbox.credentials.client_secret'),
//                "redirect_uri" => config('ebay.sandbox.ru_name'),
//                "url" => "https://api.sandbox.ebay.com/identity/v1/oauth2/token",
//            ],
//            "production" => [
//                "client_id" => config('ebay.production.credentials.client_id'),
//                "client_secret" => config('ebay.production.credentials.client_secret'),
//                "redirect_uri" => "Nick_Morgan-NickMorg-Global-bptvocb",
//                "url" => "https://api.ebay.com/identity/v1/oauth2/token",
//            ],
//        ];

//        $code = $request->input('code');

        $http_client = new GuzzleHttpClient();
        $response = $http_client->post("https://api.mercadolibre.com/oauth/token", [
            'headers' => [
                'accept' => 'application/json',
                'content-type' => 'application/x-www-form-urlencoded',
            ],
            'form_params' => [
                'grant_type' => 'authorization_code',
                'client_id' => config('mercadolibre.application_id'),
                'client_secret' => config('mercadolibre.application_secret'),
                'code' => $request->input('code'),
                'redirect_uri' => config('mercadolibre.redirect_uri'),
                'code_verifier' => "",
            ]
        ]);

        // Output now contains the key data.
        $api_token = $response->getBody()->getContents();

        $mercadolibre_api_settings = $request->user()->getAttribute('mercadolibre_api');
//        $mercadolibre_api_settings['token_issued_at'] = time();
        $mercadolibre_api_settings = json_decode($api_token, true);
        $request->user()->setAttribute('mercadolibre_api', $mercadolibre_api_settings);
        $request->user()->save();

        return redirect()->route('web.account.mercadolibre_api')
            ->with('flash_message', [
                'message' => 'The Mercado Libre API authorization has completed successfully!',
                'type' => 'success',
            ]);
    }


    public function notifications(Request $request)
    {

    }



}
