<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $users = [
            ['username' => 'superadmin', 'email' => null, 'password' => Hash::make('Admin123'), 'status' => null, 'role_id' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['username' => 'admin', 'email' => null, 'password' => Hash::make('Admin123'), 'status' => null, 'role_id' => 2, 'created_at' => now(), 'updated_at' => now()],
            ['username' => 'nazir.buenavidez', 'email' => 'nazir.buenavidez@urios.edu.ph', 'password' => Hash::make('Admin123'), 'status' => 'regular', 'role_id' => 3, 'created_at' => now(), 'updated_at' => now()],
            ['username' => 'khim.lucintes', 'email' => 'khim.lucintes@urios.edu.ph', 'password' => Hash::make('Admin123'), 'status' => 'regular', 'role_id' => 4, 'created_at' => now(), 'updated_at' => now()],
            ['username' => 'sofia.reyes', 'email' => 'sofia.reyes@urios.edu.ph', 'password' => Hash::make('Admin123'), 'status' => 'regular', 'role_id' => 3, 'created_at' => now(), 'updated_at' => now()],
            ['username' => 'jasper.castro', 'email' => 'jasper.castro@urios.edu.ph', 'password' => Hash::make('Admin123'), 'status' => 'regular', 'role_id' => 4, 'created_at' => now(), 'updated_at' => now()],
            ['username' => 'diana.salazar', 'email' => 'diana.salazar@urios.edu.ph', 'password' => Hash::make('Admin123'), 'status' => 'irregular', 'role_id' => 4, 'created_at' => now(), 'updated_at' => now()],
            ['username' => 'marco.villanueva', 'email' => 'marco.villanueva@urios.edu.ph', 'password' => Hash::make('Admin123'), 'status' => 'irregular', 'role_id' => 4, 'created_at' => now(), 'updated_at' => now()],
            ['username' => 'elena.gonzales', 'email' => 'elena.gonzales@urios.edu.ph', 'password' => Hash::make('Admin123'), 'status' => 'regular', 'role_id' => 3, 'created_at' => now(), 'updated_at' => now()],
        ];

        User::insert($users);
    }
}
