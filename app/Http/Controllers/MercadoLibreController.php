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
use App\Models\MercadoLibreSite;

class MercadoLibreController extends Controller
{
    /**
     * Get sites from Mercado Libre.
     * @param Request $request
     * @return void
     * @throws \GuzzleHttp\Exception\GuzzleException
     */
    public function sites(Request $request)
    {
//        MercadoLibreSite::getSitesFromMercadoLibre();



//        $http_client = new GuzzleHttpClient();
//        $response = $http_client->get("https://api.mercadolibre.com/sites", [
//            'headers' => [
//                'accept' => 'application/json',
////                'content-type' => 'application/json',
//            ],
////            'form_params' => []
//        ]);
//
//        // Output now contains the key data.
//        $api_response_contents = $response->getBody()->getContents();
//        dd(json_decode($api_response_contents, true));
    }



}
