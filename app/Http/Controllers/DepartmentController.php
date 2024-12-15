<?php

namespace App\Http\Controllers;

use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class DepartmentController extends Controller
{
    // Display a listing of departments
    public function index(Request $request)
    {
        $created_at_format = "DATE_FORMAT(departments.created_at, '%M %d, %Y')";

        $data = Department::select([
            '*',
            DB::raw($created_at_format . ' as created_at_format'),
        ]);

        if ($request->has('search')) {
            $data->where(function ($query) use ($request, $created_at_format) {
                $query->where('department_name', 'like', '%' . $request->search . '%');
                $query->orWhere(DB::raw("$created_at_format"), 'like', '%' . $request->search . '%');
            });
        }

        if ($request->status == 'Archived') {
            $data->onlyTrashed();
        }

        if ($request->sort_field && $request->sort_order) {
            $data = $data->orderBy($request->sort_field, $request->sort_order);
        } else {
            $data = $data->orderBy('id', 'desc');
        }

        if ($request->page_size) {
            $data = $data->paginate($request->page_size, ['*'], 'page', $request->page)->toArray();
        } else {
            $data = $data->get();
        }

        return response()->json([
            'success' => true,
            'data' => $data,
        ], 200);
    }

    // Store a newly created department in storage
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'department_name' => 'required|string|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $department = Department::create($request->all());
        return response()->json(['message' => 'Department created successfully', 'department' => $department], 201);
    }

    // Display the specified department
    public function show($id)
    {
        $department = Department::withTrashed()->find($id);
        if (!$department) {
            return response()->json(['message' => 'Department not found'], 404);
        }
        return response()->json($department);
    }

    // Update the specified department in storage
    public function update(Request $request, $id)
    {
        $department = Department::withTrashed()->find($id);
        if (!$department) {
            return response()->json(['message' => 'Department not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'department_name' => 'required|string|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $department->update($request->all());
        return response()->json(['message' => 'Department updated successfully', 'department' => $department]);
    }

    // Soft delete the specified department
    public function destroy($id)
    {
        $department = Department::find($id);
        if (!$department) {
            return response()->json(['message' => 'Department not found'], 404);
        }

        $department->delete();
        return response()->json(['message' => 'Department deleted successfully']);
    }

    // Restore the specified soft-deleted department
    public function restore($id)
    {
        $department = Department::withTrashed()->find($id);
        if (!$department) {
            return response()->json(['message' => 'Department not found'], 404);
        }

        $department->restore();
        return response()->json(['message' => 'Department restored successfully']);
    }
}
