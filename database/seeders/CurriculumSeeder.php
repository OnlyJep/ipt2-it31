<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CurriculumSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $curriculums = [
            [
                'objective' => 'History',
                'curriculum_type' => 'formal',
                'resources' => 'non-lab',
                'prerequisite' => 'no',
                'assessment' => 'Globalization: The interconnectedness of people around the world, and how they interact with each other in economics, politics, and culture',
                'method' => 'Examines the social, economic, political, technological, and other transformations that have made the world more interconnected.',
                'content' => 'Lessons',
                'number_of_hours' => 24,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        // Insert the curriculum into the database
        DB::table('curriculums')->insert($curriculums);
    }
}
