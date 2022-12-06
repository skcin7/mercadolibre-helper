<?php

namespace Database\Seeders;

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use DB;
use Hash;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeder.
     * @return void
     */
    public function run()
    {
        $seeder_json_file_path = storage_path("app/database_seeders_data/users.json");
        $seeder_data = json_decode(file_get_contents($seeder_json_file_path), true);

        // Loop through the countries found and either create or insert them based on if it's already in the database or not.
        foreach($seeder_data as $this_unprocessed_seeder_data) {

            // Insert the final processed seed data into the database:
            DB::table('users')
                ->insert([
                    'id' => $this_unprocessed_seeder_data['id'],
                    'name' => $this_unprocessed_seeder_data['name'],
                    'email' => $this_unprocessed_seeder_data['email'],
                    'email_verified_at' => null,
                    'password' => Hash::make($this_unprocessed_seeder_data['password']),
                    'remember_token' => null,
                    'is_mastermind' => (bool)$this_unprocessed_seeder_data['is_mastermind'],
                    'is_admin' => (bool)$this_unprocessed_seeder_data['is_admin'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ])
            ;
        }


    }
}
