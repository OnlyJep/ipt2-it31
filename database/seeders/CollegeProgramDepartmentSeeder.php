<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CollegeProgramDepartmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('college_program_departments')->insert([
            ['collegeprogram_id' => 1, 'department_id' => 4, 'created_at' => now(), 'updated_at' => null, 'deleted_at' => null],
            ['collegeprogram_id' => 2, 'department_id' => 4, 'created_at' => now(), 'updated_at' => null, 'deleted_at' => null],
            ['collegeprogram_id' => 3, 'department_id' => 4, 'created_at' => now(), 'updated_at' => null, 'deleted_at' => null],
            ['collegeprogram_id' => 4, 'department_id' => 6, 'created_at' => now(), 'updated_at' => null, 'deleted_at' => null],
            ['collegeprogram_id' => 5, 'department_id' => 6, 'created_at' => now(), 'updated_at' => null, 'deleted_at' => null],
            ['collegeprogram_id' => 6, 'department_id' => 7, 'created_at' => now(), 'updated_at' => null, 'deleted_at' => null],
            ['collegeprogram_id' => 7, 'department_id' => 1, 'created_at' => now(), 'updated_at' => null, 'deleted_at' => null],
            ['collegeprogram_id' => 8, 'department_id' => 2, 'created_at' => now(), 'updated_at' => null, 'deleted_at' => null],
            ['collegeprogram_id' => 9, 'department_id' => 2, 'created_at' => now(), 'updated_at' => null, 'deleted_at' => null],
            ['collegeprogram_id' => 10, 'department_id' => 8, 'created_at' => now(), 'updated_at' => null, 'deleted_at' => null],
            ['collegeprogram_id' => 11, 'department_id' => 5, 'created_at' => now(), 'updated_at' => null, 'deleted_at' => null],
        ]); 
    }
}
