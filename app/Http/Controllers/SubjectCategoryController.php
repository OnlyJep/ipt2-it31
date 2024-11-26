<?php

namespace App\Http\Controllers;

use App\Models\SubjectCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SubjectCategoryController extends Controller
{
    // Display a listing of subject categories
    public function index()
    {
        $subjectCategories = SubjectCategory::all();
        return response()->json($subjectCategories);
    }

    // Store a newly created subject category in storage
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'subject_category' => 'required|string|max:100',
            'yearlevel_id' => 'required|exists:year_levels,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $subjectCategory = SubjectCategory::create($request->all());
        return response()->json(['message' => 'Subject Category created successfully', 'subjectCategory' => $subjectCategory], 201);
    }

    // Display the specified subject category
    public function show($id)
    {
        $subjectCategory = SubjectCategory::withTrashed()->find($id);
        if (!$subjectCategory) {
            return response()->json(['message' => 'Subject Category not found'], 404);
        }
        return response()->json($subjectCategory);
    }

    // Update the specified subject category in storage
    public function update(Request $request, $id)
    {
        $subjectCategory = SubjectCategory::withTrashed()->find($id);
        if (!$subjectCategory) {
            return response()->json(['message' => 'Subject Category not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'subject_category' => 'required|string|max:100',
            'yearlevel_id' => 'required|exists:year_levels,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $subjectCategory->update($request->all());
        return response()->json(['message' => 'Subject Category updated successfully', 'subjectCategory' => $subjectCategory]);
    }

    // Remove the specified subject category from storage
    public function destroy($id)
    {
        $subjectCategory = SubjectCategory::find($id);
        if (!$subjectCategory) {
            return response()->json(['message' => 'Subject Category not found'], 404);
        }
        
        $subjectCategory->delete();
        return response()->json(['message' => 'Subject Category deleted successfully']);
    }

    // Restore the specified soft-deleted subject category
    public function restore($id)
    {
        $subjectCategory = SubjectCategory::withTrashed()->find($id);
        if (!$subjectCategory) {
            return response()->json(['message' => 'Subject Category not found'], 404);
        }

        $subjectCategory->restore();
        return response()->json(['message' => 'Subject Category restored successfully']);
    }

    // Permanently delete the specified subject category from storage
    public function forceDelete($id)
    {
        $subjectCategory = SubjectCategory::withTrashed()->find($id);
        if (!$subjectCategory) {
            return response()->json(['message' => 'Subject Category not found'], 404);
        }

        $subjectCategory->forceDelete();
        return response()->json(['message' => 'Subject Category permanently deleted successfully']);
    }

    // Retrieve all soft-deleted subject categories
    public function getDeletedSubjectCategories()
    {
        $deletedSubjectCategories = SubjectCategory::onlyTrashed()->get();
        if ($deletedSubjectCategories->isEmpty()) {
            return response()->json(['message' => 'No soft-deleted subject categories found'], 404);
        }
        return response()->json($deletedSubjectCategories);
    }
}
