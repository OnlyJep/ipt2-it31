<?php

namespace App\Http\Controllers;

use App\Models\CollegeProgramDepartment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CollegeProgramDepartmentController extends Controller
{
    // Display a listing of college program departments
    public function index(Request $request)
    {
        $deleted = $request->query('deleted', 'false');

        if ($deleted === 'only') {
            $collegeProgramDepartments = CollegeProgramDepartment::onlyTrashed()->get();
        } elseif ($deleted === 'true') {
            $collegeProgramDepartments = CollegeProgramDepartment::withTrashed()->get();
        } else {
            $collegeProgramDepartments = CollegeProgramDepartment::all();
        }

        if ($collegeProgramDepartments->isEmpty()) {
            return response()->json(['message' => 'No college program departments found'], 404);
        }

        return response()->json($collegeProgramDepartments);
    }

    // Store a newly created college program department in storage
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'department_id' => 'required|exists:departments,id',
            'collegeprogram_id' => 'required|exists:college_programs,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $collegeProgramDepartment = CollegeProgramDepartment::create($request->all());
        return response()->json(['message' => 'College Program Department created successfully', 'collegeProgramDepartment' => $collegeProgramDepartment], 201);
    }

    // Display the specified college program department
    public function show($id)
    {
        $collegeProgramDepartment = CollegeProgramDepartment::withTrashed()->find($id);
        if (!$collegeProgramDepartment) {
            return response()->json(['message' => 'College Program Department not found'], 404);
        }
        return response()->json($collegeProgramDepartment);
    }

    // Update the specified college program department in storage
    public function update(Request $request, $id)
    {
        $collegeProgramDepartment = CollegeProgramDepartment::withTrashed()->find($id);
        if (!$collegeProgramDepartment) {
            return response()->json(['message' => 'College Program Department not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'department_id' => 'required|exists:departments,id',
            'collegeprogram_id' => 'required|exists:college_programs,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $collegeProgramDepartment->update($request->all());
        return response()->json(['message' => 'College Program Department updated successfully', 'collegeProgramDepartment' => $collegeProgramDepartment]);
    }

    // Remove the specified college program department from storage
    public function destroy($id)
    {
        $collegeProgramDepartment = CollegeProgramDepartment::find($id);
        if (!$collegeProgramDepartment) {
            return response()->json(['message' => 'College Program Department not found'], 404);
        }
        
        $collegeProgramDepartment->delete();
        return response()->json(['message' => 'College Program Department deleted successfully']);
    }

    // Restore the specified soft-deleted college program department
    public function restore($id)
    {
        $collegeProgramDepartment = CollegeProgramDepartment::withTrashed()->find($id);
        if (!$collegeProgramDepartment) {
            return response()->json(['message' => 'College Program Department not found'], 404);
        }

        $collegeProgramDepartment->restore();
        return response()->json(['message' => 'College Program Department restored successfully']);
    }
}
