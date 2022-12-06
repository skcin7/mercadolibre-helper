<?php

namespace App\Http\Controllers;

use GuzzleHttp\Exception\ClientException;
use GuzzleHttp\Exception\ServerException;
use http\Client;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response as LaravelResponse;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Pagination\Paginator;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Js;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Collection;
use App;
//use Illuminate\Support\Facades\View;
//use Illuminate\Contracts\View\View;
//use View;
//use Illuminate\Support\Facades\View;
//use Illuminate\View\View;
//use Illuminate\Contracts\View\View;
use Illuminate\Contracts\View\View;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    ///////////////////////////////////////////////////////////////////////////
    /// BEGIN: PER PAGE/PAGINATION
    ///////////////////////////////////////////////////////////////////////////

    /**
     * Number of results to show per paginated collection response.
     * @var int
     */
    private int $perPage = 50;

    /**
     * Set the per page amount to a new amount.
     * @param $perPage
     */
    public function setPerPage($perPage)
    {
        // Only let the per page amount be one of the valid amounts:
        switch($perPage) {
            case 1000:
            case 500:
            case 400:
            case 300:
            case 250:
            case 200:
            case 100:
            case 50:
            case 25:
            case 15:
            case 10:
            case 5:
                $this->perPage = $perPage;
        }
    }

    /**
     * Get the per page amount for each paginated collection response.
     * @return int
     */
    public function getPerPage(): int
    {
        return $this->perPage;
    }




    /**
     * Respond to an application HTTP Request with a rendered Blade HTML View.
     * @param string $blade_view
     * @param array $page_data
     * @param array $_page
     * @param int $http_status_code
     * @return Application|ResponseFactory|LaravelResponse
     */
    public function respondWithBladeView(string $blade_view, array $page_data = [], array $_page = [], int $http_status_code = 200): Application|ResponseFactory|LaravelResponse
    {
        // In case page is still an array from before, translate it back to an array.
        if(is_string($_page)) { $_page = []; }

        $final_page_data = array_merge([
            '_page' => [
                'layout' => (isset($_page['meta']) ? $_page['meta'] : 'layouts.layout'),
                'title_prefix' => (isset($_page['title_prefix']) ? $_page['title_prefix'] : null),
                'title_suffix' => (isset($_page['title_suffix']) ? $_page['title_suffix'] : null),
                'show_header' => (isset($_page['show_header']) ? $_page['show_header'] : true),
                'show_footer' => (isset($_page['show_footer']) ? $_page['show_footer'] : true),
            ],
            '_response' => [
                'status_code' => $http_status_code,
                'status_text' => http_status_text($http_status_code),
            ],
        ], $page_data);

        $rendered_blade_view = view((view()->exists($blade_view) ? $blade_view : 'default_view'), $final_page_data);

        return response($rendered_blade_view, $http_status_code)
            ->header('Content-Type', 'text/html');
    }

    /**
     * Respond to a request with JSON, using a consistent format throughout the app.
     * @param mixed $resource = null
     * @param string $message
     * @param int $statusCode
     * @param array|null $meta = null
     * @param array|null $errors = null
     * @param array|null $warnings = null
     * @return JsonResponse
     */
    public function respondWithJson(mixed $resource = null, string $message = '', int $statusCode = 200, array|null $meta = null, array|null $errors = null, array|null $warnings = null): JsonResponse
    {
        $data = [];

        // Attach the resource data (if any exists):
        if(! is_null($resource)) {
            $data['resource'] = $resource;
        }

        // Attach the message:
        $data['message'] = $message;

        // Attach the status code and status text:
        $data['status_code'] = $statusCode;
        $data['status_text'] = Response::$statusTexts[$statusCode];

        // Attach the meta data (if any exists):
        if(! is_null($meta) && count($meta) > 0) {
            $data['meta'] = $meta;
        }

        // Attach errors (if any are present):
        if(! is_null($errors)) {
            $data['errors'] = $errors;
        }

        // Attach warnings (if any are present):
        if(! is_null($warnings)) {
            $data['warnings'] = $warnings;
        }

        // Respond to the API request:
        return response()->json($data, $statusCode);
    }


}
