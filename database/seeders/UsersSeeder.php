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

            $user = new User();
            $user->setAttribute('id', $this_unprocessed_seeder_data['id']);
            $user->setAttribute('name', $this_unprocessed_seeder_data['name']);
            $user->setAttribute('email', $this_unprocessed_seeder_data['email']);
            $user->setAttribute('email_verified_at', null);
            $user->setAttribute('password', Hash::make($this_unprocessed_seeder_data['password']));
            $user->setAttribute('remember_token', null);
            $user->setAttribute('is_mastermind', (bool)$this_unprocessed_seeder_data['is_mastermind']);
            $user->setAttribute('is_admin', (bool)$this_unprocessed_seeder_data['is_admin']);
            $user->save();


        }


    }
}
