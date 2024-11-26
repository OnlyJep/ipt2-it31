<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RoleController extends Controller
{
    public function index()
    {
        $roles = Role::all();
        return response()->json($roles);
    }

    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'role_name' => 'required|string|max:50|unique:roles,role_name',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $role = Role::create(['role_name' => $request->role_name]);

            return response()->json(['message' => 'Role created successfully', 'role' => $role], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to create role', 'error' => $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        $role = Role::withTrashed()->where('id', $id)->first();
        if (!$role) {
            return response()->json(['message' => 'Role not found'], 404);
        }
        return response()->json($role);
    }

    public function update(Request $request, $id)
    {
        try {
            $role = Role::withTrashed()->where('id', $id)->first();
            if (!$role) {
                return response()->json(['message' => 'Role not found'], 404);
            }

            $validator = Validator::make($request->all(), [
                'role_name' => 'required|string|max:50|unique:roles,role_name,' . $role->id,
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $role->update(['role_name' => $request->role_name]);

            return response()->json(['message' => 'Role updated successfully', 'role' => $role]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to update role', 'error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $role = Role::find($id);
            if (!$role) {
                return response()->json(['message' => 'Role not found'], 404);
            }
            $role->delete(); // Soft delete
            return response()->json(['message' => 'Role was successfully deleted'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to delete role', 'error' => $e->getMessage()], 500);
        }
    }

    public function restore($id)
    {
        try {
            $role = Role::withTrashed()->findOrFail($id);
            $role->restore();
            return response()->json(['message' => 'Role restored successfully', 'role' => $role]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to restore role', 'error' => $e->getMessage()], 500);
        }
    }

    public function forceDelete($id)
    {
        try {
            $role = Role::withTrashed()->findOrFail($id);
            $role->forceDelete();
            return response()->json(['message' => 'Role permanently deleted']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to permanently delete role', 'error' => $e->getMessage()], 500);
        }
    }

    // Retrieve all soft-deleted roles
    public function getDeletedRoles()
    {
        $deletedRoles = Role::onlyTrashed()->get();
        if ($deletedRoles->isEmpty()) {
            return response()->json(['message' => 'No soft-deleted roles found'], 404);
        }
        return response()->json($deletedRoles);
    }
}
