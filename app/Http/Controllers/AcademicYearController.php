<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AcademicYearController extends Controller
{
    // Display a listing of academic years
    public function index()
    {
        $academicYears = AcademicYear::all();
        return response()->json($academicYears);
    }

    // Store a newly created academic year in storage
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'academic_year' => 'required|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $academicYear = AcademicYear::create($request->all());
        return response()->json(['message' => 'Academic Year created successfully', 'academicYear' => $academicYear], 201);
    }

    // Display the specified academic year
    public function show($id)
    {
        $academicYear = AcademicYear::withTrashed()->find($id);
        if (!$academicYear) {
            return response()->json(['message' => 'Academic Year not found'], 404);
        }
        return response()->json($academicYear);
    }

    // Update the specified academic year in storage
    public function update(Request $request, $id)
    {
        $academicYear = AcademicYear::withTrashed()->find($id);
        if (!$academicYear) {
            return response()->json(['message' => 'Academic Year not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'academic_year' => 'required|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $academicYear->update($request->all());
        return response()->json(['message' => 'Academic Year updated successfully', 'academicYear' => $academicYear]);
    }

    // Remove the specified academic year from storage
    public function destroy($id)
    {
        $academicYear = AcademicYear::find($id);
        if (!$academicYear) {
            return response()->json(['message' => 'Academic Year not found'], 404);
        }
        
        $academicYear->delete();
        return response()->json(['message' => 'Academic Year deleted successfully']);
    }

    // Restore the specified soft-deleted academic year
    public function restore($id)
    {
        $academicYear = AcademicYear::withTrashed()->find($id);
        if (!$academicYear) {
            return response()->json(['message' => 'Academic Year not found'], 404);
        }

        $academicYear->restore();
        return response()->json(['message' => 'Academic Year restored successfully']);
    }

    // Permanently delete the specified academic year from storage
    public function forceDelete($id)
    {
        $academicYear = AcademicYear::withTrashed()->find($id);
        if (!$academicYear) {
            return response()->json(['message' => 'Academic Year not found'], 404);
        }

        $academicYear->forceDelete();
        return response()->json(['message' => 'Academic Year permanently deleted successfully']);
    }

    // Retrieve all soft-deleted academic years
    public function getDeletedAcademicYears()
    {
        $deletedAcademicYears = AcademicYear::onlyTrashed()->get();
        if ($deletedAcademicYears->isEmpty()) {
            return response()->json(['message' => 'No soft-deleted academic years found'], 404);
        }
        return response()->json($deletedAcademicYears);
    }
}
