<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SubjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $subjects = [
            [
                'subject_code' => '01',
                'subject_name' => 'Contemporary World',
                'classification' => 'minor',
                'units' => 3,
                'subject_description' => 'Modern World Society',
                'availability' => true, // Set to 1 (true) for availability
                'subjectcategory_id' => 1, // SubjectCategory ID 1 corresponds to General Education
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        // Insert the subject into the database
        DB::table('subjects')->insert($subjects);
    }
}
