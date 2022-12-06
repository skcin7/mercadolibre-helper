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
use App\Models\MercadoLibreSite;
use App\Models\User;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\Routing\ResponseFactory;

class SearchController extends Controller
{
    /**
     * Page to perform a search of MercadoLivre/MercadoLibre.
     * @param Request $request
     * @param int|null $id
     * @return Response|Application|ResponseFactory
     */
    public function index(Request $request, int|null $id = null): Response|Application|ResponseFactory
    {
        if(is_int($id)) {
            $saved_search = SavedSearch::query()->where('id', $id)->firstOrFail();

            if(
                (is_null($request->user()))
                || ($saved_search->getAttribute('user_id') != $request->user()->getAttribute('id'))
            ) {
                // Saved search is not owned by the currently authenticated user.
                return redirect()->route('web.search');
            }
        }
        else {
            $saved_search = new SavedSearch();
        }

        $mercadolibre_sites = MercadoLibreSite::query()->orderBy('name', 'asc')->get();

        return $this->respondWithBladeView('search', [
            'saved_search' => $saved_search,
            'mercadolibre_sites' => $mercadolibre_sites,
        ], [
            'title_suffix' => (($saved_search->exists ? 'Existing' : 'New') . " Search"),
        ]);
    }

    /**
     * Find listings from Mercado Libre.
     * @param Request $request
     * @return JsonResponse
     */
    public function findListings(Request $request): JsonResponse
    {
        $saved_search = null;
        if($request->input('exists')) {
            $saved_search = SavedSearch::query()->where('id', $request->input('id'))->where('user_id', $request->user()->getAttribute('id'))->first();
        }
        if(!$saved_search) {
            $saved_search = new SavedSearch();
        }

        // At this point the saved search will either be a new one, or an existing one.

        $saved_search->setAttribute('mercadolibre_site_id', $request->input('mercadolibre_site_id'));
        $saved_search->setAttribute('mercadolibre_category_id', $request->input('mercadolibre_category_id'));
        $saved_search->setAttribute('keywords', $request->input('keywords'));

        $per_page = 50;
        $current_page = 0;



        $matched_listings_api_response = $saved_search->findMatchedListingsFromMercadoLibre($per_page, ($per_page * $current_page));

        return $this->respondWithJson(
            $matched_listings_api_response,
            "Matched listings API response from Mercado Libre.",
            200
        );

    }


}
