<?php

namespace App\Models;

use GuzzleHttp\Client as GuzzleHttpClient;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;

class MercadoLibreSite extends Model
{
    use HasFactory;

    /**
     * The database table used by the model.
     * @var string
     */
    public $table = 'mercadolibre_sites';

    /**
     * The primary key for the model.
     * @var string
     */
    protected $primaryKey = 'id';

    /**
     * The "type" of the primary key ID.
     * @var string
     */
    protected $keyType = 'string';

    /**
     * Indicates if the IDs are auto-incrementing.
     * @var bool
     */
    public $incrementing = false;

    /**
     * The model's default values for attributes.
     * @var array
     */
    protected $attributes = [
        'id' => "",
        'default_currency_id' => "",
        'name' => "",
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'default_currency_id',
        'name',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'id' => "string",
        'default_currency_id' => "string",
        'name' => "string",
    ];


    public static function getSitesFromMercadoLibre()
    {
        $http_client = new GuzzleHttpClient();
        $response = $http_client->get("https://api.mercadolibre.com/sites", [
            'headers' => [
                'accept' => 'application/json',
            ],
//            'form_params' => []
        ]);

        $api_response_contents = $response->getBody()->getContents();
//        dd(json_decode($api_response_contents, true));

        $fetched_mercadolibre_sites = json_decode($api_response_contents, true);
        foreach($fetched_mercadolibre_sites as $fetched_mercadolibre_site) {
            $mercadolibre_site = MercadoLibreSite::query()->where('id', $fetched_mercadolibre_site['id'])->first();

            if(!$mercadolibre_site) {
                $mercadolibre_site = new MercadoLibreSite();
            }

            $mercadolibre_site->setAttribute('id', $fetched_mercadolibre_site['id']);
            $mercadolibre_site->setAttribute('default_currency_id', $fetched_mercadolibre_site['default_currency_id']);
            $mercadolibre_site->setAttribute('name', $fetched_mercadolibre_site['name']);
            $mercadolibre_site->save();
        }


    }

}
