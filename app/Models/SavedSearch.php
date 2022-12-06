<?php

namespace App\Models;

use GuzzleHttp\Client as GuzzleHttpClient;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;

class SavedSearch extends Model
{
    use HasFactory;

    /**
     * The database table used by the model.
     * @var string
     */
    public $table = 'saved_searches';

    /**
     * The model's default values for attributes.
     * @var array
     */
    protected $attributes = [
        'keywords' => "",
        'mercadolibre_site_id' => "MLB",
        'mercadolibre_category_id' => "MLB186456",
    ];

    public static function getCount()
    {
        return SavedSearch::query()->count();
    }

    /**
     * The user that is managing this saved search.
     * @return BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo('App\Models\User');
    }

    public function findMatchedListingsFromMercadoLibre($limit = 50, $offset = 0)
    {
        $http_client = new GuzzleHttpClient();
        $response = $http_client->get("https://api.mercadolibre.com/sites/" . $this->getAttribute('mercadolibre_site_id') . "/search?" . http_build_query([
                "category" => $this->getAttribute('mercadolibre_category_id'),
                "q" => str_replace(" ", "+", $this->getAttribute('keywords')),
                "limit" => $limit,
                "offset" => $offset,
            ]), [
            'headers' => [
                'accept' => 'application/json',
            ],
        ]);

        $api_response_contents = $response->getBody()->getContents();
//        dd(json_decode($api_response_contents, true));

        $matched_listings_api_response = json_decode($api_response_contents, true);


//        $final_matched_listings = [];
//        foreach(json_decode($api_response_contents, true) as $current_found_matched_listing) {
//            // TODO - additional search to do exact phrases, exclude keywords
//
//            $final_matched_listings[] = $current_found_matched_listing;
//        }

        if($this->exists) {
            $this->setAttribute('last_searched_at', now());
            $this->save();
        }

        return $matched_listings_api_response;

    }

}
