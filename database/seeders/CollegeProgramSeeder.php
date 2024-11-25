<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CollegeProgramSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('college_programs')->insert([
            ['college_programs' => 'Bachelor of Science in Information Technology', 'study_type' => 'undergraduate', 'created_at' => now(), 'updated_at' => now()],
            ['college_programs' => 'Bachelor of Science in Computer Science', 'study_type' => 'undergraduate', 'created_at' => now(), 'updated_at' => now()],
            ['college_programs' => 'Bachelor of Science in Cybersecurity', 'study_type' => 'undergraduate', 'created_at' => now(), 'updated_at' => now()],
            ['college_programs' => 'Bachelor of Science in Civil Engineering', 'study_type' => 'undergraduate', 'created_at' => now(), 'updated_at' => now()],
            ['college_programs' => 'Bachelor of Science in Industrial Engineering', 'study_type' => 'undergraduate', 'created_at' => now(), 'updated_at' => now()],
            ['college_programs' => 'Bachelor of Science in Nursing', 'study_type' => 'undergraduate', 'created_at' => now(), 'updated_at' => now()],
            ['college_programs' => 'Bachelor of Science in Management Accounting', 'study_type' => 'undergraduate', 'created_at' => now(), 'updated_at' => now()],
            ['college_programs' => 'Bachelor of Science in Political Science', 'study_type' => 'undergraduate', 'created_at' => now(), 'updated_at' => now()],
            ['college_programs' => 'Bachelor of Science in Psycology', 'study_type' => 'undergraduate', 'created_at' => now(), 'updated_at' => now()],
            ['college_programs' => 'Bachelor of Science in Physical Education', 'study_type' => 'undergraduate', 'created_at' => now(), 'updated_at' => now()],
            ['college_programs' => 'Bachelor of Science in Criminology', 'study_type' => 'undergraduate', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
