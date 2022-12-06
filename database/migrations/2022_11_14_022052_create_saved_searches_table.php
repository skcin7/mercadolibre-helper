<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\MyMigration;

return new class extends MyMigration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('saved_searches', function (Blueprint $table) {
            $table->id()->startingValue(property_exists($this, 'auto_increment_start_value') ? $this->auto_increment_start_value : 1);
            $table->foreignId('user_id')->constrained('users');
            $table->string('keywords', 255);
            $table->string('mercadolibre_site_id', 4);
            $table->string('mercadolibre_category_id', 255);

            $table->string('include_keywords', 255);
            $table->string('exclude_keywords', 255);
            $table->boolean('is_enabled')->default(true);
            $table->boolean('alerts_enabled')->default(true);
            $table->timestamp('last_searched_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('saved_searches');
    }
};
