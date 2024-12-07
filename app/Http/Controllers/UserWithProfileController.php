<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

class UserWithProfileController extends Controller
{
    // Create a new user and profile in storage
    public function store(Request $request)
    {
        // Validate the input data
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|max:50|unique:users,username',
            'email' => 'required|email|unique:users,email|max:100',
            'password' => 'required|string|min:8',
            'role_id' => 'required|exists:roles,id', // Foreign key reference
            //Profile Data
            'first_name' => 'nullable|string|max:50',
            'last_name' => 'nullable|string|max:50',
            'middle_initial' => 'nullable|string|max:20',
            'sex' => 'nullable|string|max:20',
            'marital_status' => 'nullable|string|max:20',
            'religion' => 'nullable|string|max:50',
            'age' => 'nullable|integer|min:0',
            'phone_number' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
        ]);

        // If validation fails
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Start a database transaction to ensure atomicity
        DB::beginTransaction();

        try {
            // Create the user
            $user = User::create([
                'username' => $request->username,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role_id' => $request->role_id,
            ]);

            // Create the profile and associate it with the user
            $profile = Profile::create([
                'user_id' => $user->id, // Link the profile to the user
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'middle_initial' => $request->middle_initial,
                'sex' => $request->sex,
                'marital_status' => $request->marital_status,
                'religion' => $request->religion,
                'age' => $request->age,
                'phone_number' => $request->phone_number,
                'address' => $request->address,
            ]);

            // Commit the transaction
            DB::commit();

            // Return a success response
            return response()->json([
                'message' => 'User and Profile created successfully!',
                'user' => $user,
                'profile' => $profile
            ], 201);

        } catch (\Exception $e) {
            // If something goes wrong, roll back the transaction
            DB::rollBack();
            return response()->json(['error' => 'Failed to create user and profile: ' . $e->getMessage()], 500);
        }
    }
}
