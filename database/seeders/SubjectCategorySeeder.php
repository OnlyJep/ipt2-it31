<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SubjectCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $subjectCategories = [
            ['subject_category' => 'General Education', 'yearlevel_id'=> 1, 'created_at' => now(), 'updated_at' => now()],
            ['subject_category' => 'Information Technology', 'yearlevel_id'=> 1, 'created_at' => now(), 'updated_at' => now()],
            ['subject_category' => 'Computer Science', 'yearlevel_id'=> 1, 'created_at' => now(), 'updated_at' => now()],
            ['subject_category' => 'Theology', 'yearlevel_id'=> 1, 'created_at' => now(), 'updated_at' => now()],
        ];

        // Insert the subject categories into the database
        DB::table('subject_category')->insert($subjectCategories);
    }
}
    