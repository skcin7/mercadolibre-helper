<?php

namespace App\Http\Controllers;

use App\Http\Resources\SavedSearchResource;
use GuzzleHttp\Exception\GuzzleException;
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
            $saved_search = SavedSearch::query()->where('id', $id)->first();
            if(!$saved_search) {
                abort(404, "Saved Search Can Not Be Found.");
            }
//            dd('hi');

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

        $matched_listings = [];

        return $this->respondWithBladeView('search', [
            'saved_search' => $saved_search,
            'matched_listings' => [],
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
    public function findMatchedListings(Request $request): JsonResponse
    {
        $saved_search = null;
        if($request->input('exists')) {
            $saved_search = SavedSearch::query()->where('id', $request->input('id'))->where('user_id', $request->user()->getAttribute('id'))->first();
        }
        if(!$saved_search) {
            $saved_search = new SavedSearch();
        }

        // At this point the saved search will either be a new one, or an existing one.

        $saved_search->setAttribute('mercadolibre_site_id', (string)$request->input('mercadolibre_site_id'));
        $saved_search->setAttribute('mercadolibre_category_id', (string)$request->input('mercadolibre_category_id'));
        $saved_search->setAttribute('keywords', (string)$request->input('keywords'));
        $saved_search->setAttribute('title_must_contain', (string)$request->input('title_must_contain'));
        $saved_search->setAttribute('title_must_not_contain', (string)$request->input('title_must_not_contain'));

//        $per_page = (int)$request->input('per_page', 50);
//        $current_page = (int)$request->input('current_page', 0);

//        $limit = $per_page;
//        $offset = ($per_page * $current_page);

        $limit = $request->input('limit', 50);
        $offset = $request->input('offset', 0);

        try {
            $matched_listings_api_response = $saved_search->findMatchedListingsFromMercadoLibre($limit, $offset);
            return $this->respondWithJson(
                $matched_listings_api_response,
                "Matched listings API response from Mercado Libre.",
                200
            );
        }
        catch(GuzzleException $ex) {
            return $this->respondWithJson(
                null,
                "Error. " . $ex->getMessage(),
                422
            );
        }

    }

    private function createOrUpdateSavedSearch(SavedSearch $savedSearch, Request $request)
    {
        $request->validate([
            'mercadolibre_site_id' => [
                'required',
                'string',
                'size:3',
                'exists:mercadolibre_sites,id',
            ],
            'mercadolibre_category_id' => [
                'nullable',
                'string',
            ],
            'keywords' => [
                'nullable',
                'string',
            ],
            'title_must_contain' => [
                'nullable',
                'string',
            ],
            'title_must_not_contain' => [
                'nullable',
                'string',
            ],
            'system_group' => [
                'nullable',
                'string',
            ],
            'automatic_searching_enabled' => [
                'nullable',
                'boolean',
            ],
            'alerts_enabled' => [
                'nullable',
                'boolean',
            ],
        ]);

        $savedSearch->setAttribute('user_id', $request->user()->getAttribute('id'));
        $savedSearch->setAttribute('mercadolibre_site_id', (string)$request->input('mercadolibre_site_id'));
        $savedSearch->setAttribute('mercadolibre_category_id', (string)$request->input('mercadolibre_category_id'));
        $savedSearch->setAttribute('keywords', (string)$request->input('keywords'));
        $savedSearch->setAttribute('title_must_contain', (string)$request->input('title_must_contain'));
        $savedSearch->setAttribute('title_must_not_contain', (string)$request->input('title_must_not_contain'));
        $savedSearch->setAttribute('system_group', (string)$request->input('system_group'));
        $savedSearch->setAttribute('automatic_searching_enabled', (bool)$request->input('automatic_searching_enabled'));
        $savedSearch->setAttribute('alerts_enabled', (bool)$request->input('alerts_enabled'));
        $savedSearch->save();

        return $savedSearch;
    }

    public function create(Request $request)
    {
        $newly_created_saved_search = $this->createOrUpdateSavedSearch(new SavedSearch(), $request);

        if($request->expectsJson()) {
            return $this->respondWithJson(
                new SavedSearchResource($newly_created_saved_search),
                "Saved Search has been created!",
                201
            );
        }

        return redirect()->route('web.search', ['id' => $newly_created_saved_search->getAttribute('id')])
            ->with('flash_message', [
                'message' => 'Saved Search has been created!',
                'type' => 'success',
            ])
            ;
    }

    public function update(Request $request, int $id)
    {
        $saved_search = SavedSearch::where('id', $id)->where('user_id', $request->user()->getAttribute('id'))->firstOrFail();
        $updated_saved_search = $this->createOrUpdateSavedSearch($saved_search, $request);

        if($request->expectsJson()) {
            return $this->respondWithJson(
                new SavedSearchResource($updated_saved_search),
                "Saved Search has been updated!",
                200
            );
        }

        return redirect()->route('web.search', ['id' => $updated_saved_search->getAttribute('id')])
            ->with('flash_message', [
                'message' => 'Saved Search has been updated!',
                'type' => 'success',
            ])
            ;
    }

    public function delete(Request $request, int $id)
    {
        $saved_search_to_delete = SavedSearch::where('id', $id)->where('user_id', $request->user()->getAttribute('id'))->firstOrFail();
        $saved_search_to_delete->delete();

        if($request->expectsJson()) {
            return $this->respondWithJson(
                new SavedSearchResource($saved_search_to_delete),
                "Saved Search has been successfully deleted.",
                200
            );
        }

        return redirect()->route('web.account.saved_searches')
            ->with('flash_message', [
                'message' => 'Your saved search has been successfully deleted.',
                'type' => 'success',
            ])
            ;

    }


}
