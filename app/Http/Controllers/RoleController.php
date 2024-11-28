<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class RoleController extends Controller
{
    public function index(Request $request)
    {
        try {
            // Check if the query parameter 'deleted' is set to true
            $showDeleted = $request->query('deleted', false);

            if ($showDeleted) {
                // Retrieve only soft-deleted roles
                $roles = Role::onlyTrashed()->get();
            } else {
                // Retrieve all non-deleted roles
                $roles = Role::all();
            }

            if ($roles->isEmpty()) {
                return response()->json(['message' => 'No roles found'], 404);
            }

            return response()->json($roles);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to retrieve roles', 'error' => $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        // Delegate to the saveRole method without an ID for creation
        return $this->saveRole($request);
    }

    public function show($id)
    {
        $role = Role::withTrashed()->find($id);
        if (!$role) {
            return response()->json(['message' => 'Role not found'], 404);
        }
        return response()->json($role);
    }

    public function update(Request $request, $id)
    {
        // Delegate to the saveRole method with an ID for updating
        return $this->saveRole($request, $id);
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
            $role = Role::withTrashed()->find($id);
            if (!$role) {
                return response()->json(['message' => 'Role not found'], 404);
            }
            $role->restore();
            return response()->json(['message' => 'Role restored successfully', 'role' => $role]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to restore role', 'error' => $e->getMessage()], 500);
        }
    }

    // Private method to handle both creation and updating of roles
    private function saveRole(Request $request, $id = null)
    {
        try {
            if ($id) {
                // Update existing role
                $role = Role::withTrashed()->find($id);
                if (!$role) {
                    return response()->json(['message' => 'Role not found'], 404);
                }
            } else {
                // Create new role
                $role = new Role();
            }

            // Validation rules
            $validator = Validator::make($request->all(), [
                'role_name' => [
                    'required',
                    'string',
                    'max:50',
                    Rule::unique('roles')->ignore($role->id ?? null),
                ],
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            // Assign and save the role name
            $role->role_name = $request->role_name;
            $role->save();

            $message = $id ? 'Role updated successfully' : 'Role created successfully';
            $statusCode = $id ? 200 : 201;

            return response()->json(['message' => $message, 'role' => $role], $statusCode);
        } catch (\Exception $e) {
            $message = $id ? 'Failed to update role' : 'Failed to create role';
            return response()->json(['message' => $message, 'error' => $e->getMessage()], 500);
        }
    }
}
