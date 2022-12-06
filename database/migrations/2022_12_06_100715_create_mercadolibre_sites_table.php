<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        if(!Schema::hasTable('mercadolibre_sites')) {
            Schema::create('mercadolibre_sites', function (Blueprint $table) {
                $table->string('id', 4)->primary();
                $table->string('default_currency_id', 4);
                $table->string('name', 255);
                $table->timestamps();
            });
        }

        // Add the foreign key to link the catalog_items and systems table together.
        if(Schema::hasColumn('saved_searches', 'mercadolibre_site_id')) {
            Schema::table('saved_searches', function (Blueprint $table) {
                $table->foreign('mercadolibre_site_id')->references('id')->on('mercadolibre_sites');
            });
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('saved_searches', function (Blueprint $table) {
            $table->dropForeign(['mercadolibre_site_id']);
        });

        Schema::dropIfExists('mercadolibre_sites');
    }
};
