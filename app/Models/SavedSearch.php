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
        'title_must_contain' => "",
        'title_must_not_contain' => "",
        'system_group' => "",
        'automatic_searching_enabled' => true,
        'alerts_enabled' => true,
        'last_searched_at' => null,
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'keywords' => "string",
        'mercadolibre_site_id' => "string",
        'mercadolibre_category_id' => "string",
        'title_must_contain' => "string",
        'title_must_not_contain' => "string",
        'system_group' => "string",
        'automatic_searching_enabled' => "boolean",
        'alerts_enabled' => "boolean",
        'last_searched_at' => "datetime",
    ];

//    public static function getCount()
//    {
//        return SavedSearch::query()->count();
//    }

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

        // Filtered results (with additional searching done locally) is stored in this array.
        $matched_listings_api_response['results_filtered'] = [];



        // The title MUST contain all of the following words/phrases in this list.
        // Each word/phrase to make sure it is included is separated by a comma.
        // Furthermore, individual words/phrases may be separated by a '|' pipe character, to specify that any of the words/phrases in that group must be matched.
        if(strlen(trim($this->getAttribute('title_must_contain'))) > 0) {
            $title_must_contain = explode(",", trim($this->getAttribute('title_must_contain')));
        }
        else {
            $title_must_contain = [];
        }



        // The title may NOT contain any of the words/phrases in this list. Each one to check is separated by a comma.
        if(strlen(trim($this->getAttribute('title_must_not_contain'))) > 0) {
            $title_must_not_contain = explode(",", trim($this->getAttribute('title_must_not_contain')));
        }
        else {
            $title_must_not_contain = [];
        }


//        $final_matched_listings = [];
//        foreach($matched_listings_api_response['results'] as $current_found_matched_result) {
        for($i = 0; $i < count($matched_listings_api_response['results']); $i++) {
            // TODO - additional search to do exact phrases, exclude keywords

            $all_additional_search_filters_pass = true;



            foreach($title_must_contain as $current_title_must_contain) {
                $this_word_or_phrase_is_matched = false;
                $all_current_title_must_contain_parts = explode("|", trim($current_title_must_contain));
                foreach($all_current_title_must_contain_parts as $this_optional_part) {

                    if(str_contains(strtolower($matched_listings_api_response['results'][$i]['title']), trim(strtolower($this_optional_part)))) {
                        $this_word_or_phrase_is_matched = true;
                    }

                }

                if(!$this_word_or_phrase_is_matched) {
                    $all_additional_search_filters_pass = false;
                }
            }


            foreach($title_must_not_contain as $current_title_must_not_contain) {
                if(str_contains(strtolower($matched_listings_api_response['results'][$i]['title']), trim(strtolower($current_title_must_not_contain)))) {
                    $all_additional_search_filters_pass = false;
                }
            }



            if($all_additional_search_filters_pass) {
                $matched_listings_api_response['results_filtered'][] = $matched_listings_api_response['results'][$i];
            }

            $matched_listings_api_response['results'][$i]["_passes_additional_filters"] = $all_additional_search_filters_pass;
        }

        if($this->exists) {
            $this->setAttribute('last_searched_at', now());
            $this->save();
        }

        return $matched_listings_api_response;

    }

}
