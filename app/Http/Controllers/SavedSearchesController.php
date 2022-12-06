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

class SavedSearchesController extends Controller
{
    /**
     * @param Request $request
     * @return Response|Application|ResponseFactory
     */
    public function index(Request $request): Response|Application|ResponseFactory
    {
        $saved_searches_query = SavedSearch::query();

        $saved_searches = $saved_searches_query->paginate($this->getPerPage());

        return $this->respondWithBladeView('saved_searches', [
            'saved_searches' => $saved_searches,
        ], ['title_suffix' => "Saved Searches"]);
    }


    /**
     * @param Request $request
     * @param $id
     * @return Application|ResponseFactory|Response
     */
    public function get(Request $request, $id): Application|ResponseFactory|Response
    {
        $saved_search = SavedSearch::where('id', '=', $id)->firstOrFail();

        return $this->respondWithBladeView('saved_search', [
            'saved_search' => $saved_search,
        ], ['title_suffix' => "Saved Search"]);
    }

    /**
     * @param Request $request
     * @return Application|ResponseFactory|RedirectResponse|Response
     */
    public function create(Request $request): Application|ResponseFactory|RedirectResponse|Response
    {
        if($request->isMethod("POST")) {
            $request->validate([
                'include_keywords' => [
                    'required',
                    'string',
                ],
                'exclude_keywords' => [
                    'nullable',
                    'string',
                ],
            ]);

            $saved_search = new SavedSearch();
            $saved_search->setAttribute('include_keywords', (string)$request->input('include_keywords', ''));
            $saved_search->setAttribute('exclude_keywords', (string)$request->input('exclude_keywords', ''));
            $saved_search->setAttribute('is_enabled', true);
            $saved_search->save();

            return redirect()->route('web.saved_searches.get', ['id' => $saved_search->getAttribute('id')])
                ->with('flash_message', [
                    'message' => 'Saved search has been created!',
                    'type' => 'success',
                ]);
        }

        $saved_search = new SavedSearch();

        return $this->respondWithBladeView('saved_search', [
            'saved_search' => $saved_search,
        ], ['title_suffix' => "Saved Search"]);
    }


}
