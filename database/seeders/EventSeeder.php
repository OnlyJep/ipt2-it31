<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('events')->insert([
            [
                'event_name' => ' General Assembly',
                'date_start' => '2024-01-17',    
                'date_end' => '2024-01-17',      // Example event date
                'time_start' => '07:00:00',
                'time_end' => '08:00:00',          // Example event time in 24-hour format
                'created_at' => now(),         // Current timestamp
                'updated_at' => now(),         // Current timestamp
                'deleted_at' => null,          // NULL if not deleted
            ],
            // Add more events if needed
        ]);
    }
}
