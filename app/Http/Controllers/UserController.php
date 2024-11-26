<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    // Display a listing of users
    public function index()
    {
        $users = User::all();
        return response()->json($users);
    }

    // Store a newly created user in storage
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|max:100|unique:users,username',
            'email' => 'nullable|email|unique:users,email|max:100',
            'password' => 'required|string|min:8',
            'status' => 'required|in:regular,irregular',
            'role_id' => 'required|exists:roles,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $data = $request->all();
        $data['password'] = Hash::make($request->password);

        $user = User::create($data);
        return response()->json(['message' => 'User created successfully', 'user' => $user], 201);
    }

    // Display the specified user
    public function show($id)
    {
        $user = User::withTrashed()->find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }
        return response()->json($user);
    }

    // Update the specified user in storage
    public function update(Request $request, $id)
    {
        $user = User::withTrashed()->find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'username' => 'required|string|max:100|unique:users,username,' . $user->id,
            'email' => 'nullable|email|unique:users,email,' . $user->id . '|max:100',
            'password' => 'nullable|string|min:8',
            'status' => 'required|in:regular,irregular',
            'role_id' => 'required|exists:roles,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $data = $request->all();
        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        } else {
            unset($data['password']);
        }

        $user->update($data);
        return response()->json(['message' => 'User updated successfully', 'user' => $user]);
    }

    // Remove the specified user from storage
    public function destroy($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }
        
        $user->delete();
        return response()->json(['message' => 'User deleted successfully']);
    }

    // Restore the specified soft-deleted user
    public function restore($id)
    {
        $user = User::withTrashed()->find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->restore();
        return response()->json(['message' => 'User restored successfully']);
    }

    // Permanently delete the specified user from storage
    public function forceDelete($id)
    {
        $user = User::withTrashed()->find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->forceDelete();
        return response()->json(['message' => 'User permanently deleted successfully']);
    }

    // Retrieve all soft-deleted users
    public function getDeletedUsers()
    {
        $deletedUsers = User::onlyTrashed()->get();
        if ($deletedUsers->isEmpty()) {
            return response()->json(['message' => 'No soft-deleted users found'], 404);
        }
        return response()->json($deletedUsers);
    }
}
