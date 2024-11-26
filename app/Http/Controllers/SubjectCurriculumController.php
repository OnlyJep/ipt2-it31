<?php

namespace App\Http\Controllers;

use App\Models\SubjectCurriculum;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SubjectCurriculumController extends Controller
{
    // Display a listing of subject curriculums
    public function index()
    {
        $subjectCurriculums = SubjectCurriculum::all();
        return response()->json($subjectCurriculums);
    }

    // Store a newly created subject curriculum in storage
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'subject_id' => 'required|exists:subjects,id',
            'curriculum_id' => 'required|exists:curriculums,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $subjectCurriculum = SubjectCurriculum::create($request->all());
        return response()->json(['message' => 'Subject Curriculum created successfully', 'subjectCurriculum' => $subjectCurriculum], 201);
    }

    // Display the specified subject curriculum
    public function show($id)
    {
        $subjectCurriculum = SubjectCurriculum::withTrashed()->find($id);
        if (!$subjectCurriculum) {
            return response()->json(['message' => 'Subject Curriculum not found'], 404);
        }
        return response()->json($subjectCurriculum);
    }

    // Update the specified subject curriculum in storage
    public function update(Request $request, $id)
    {
        $subjectCurriculum = SubjectCurriculum::withTrashed()->find($id);
        if (!$subjectCurriculum) {
            return response()->json(['message' => 'Subject Curriculum not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'subject_id' => 'required|exists:subjects,id',
            'curriculum_id' => 'required|exists:curriculums,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $subjectCurriculum->update($request->all());
        return response()->json(['message' => 'Subject Curriculum updated successfully', 'subjectCurriculum' => $subjectCurriculum]);
    }

    // Remove the specified subject curriculum from storage
    public function destroy($id)
    {
        $subjectCurriculum = SubjectCurriculum::find($id);
        if (!$subjectCurriculum) {
            return response()->json(['message' => 'Subject Curriculum not found'], 404);
        }
        
        $subjectCurriculum->delete();
        return response()->json(['message' => 'Subject Curriculum deleted successfully']);
    }

    // Restore the specified soft-deleted subject curriculum
    public function restore($id)
    {
        $subjectCurriculum = SubjectCurriculum::withTrashed()->find($id);
        if (!$subjectCurriculum) {
            return response()->json(['message' => 'Subject Curriculum not found'], 404);
        }

        $subjectCurriculum->restore();
        return response()->json(['message' => 'Subject Curriculum restored successfully']);
    }

    // Permanently delete the specified subject curriculum from storage
    public function forceDelete($id)
    {
        $subjectCurriculum = SubjectCurriculum::withTrashed()->find($id);
        if (!$subjectCurriculum) {
            return response()->json(['message' => 'Subject Curriculum not found'], 404);
        }

        $subjectCurriculum->forceDelete();
        return response()->json(['message' => 'Subject Curriculum permanently deleted successfully']);
    }

    // Retrieve all soft-deleted subject curriculums
    public function getDeletedSubjectCurriculums()
    {
        $deletedSubjectCurriculums = SubjectCurriculum::onlyTrashed()->get();
        if ($deletedSubjectCurriculums->isEmpty()) {
            return response()->json(['message' => 'No soft-deleted subject curriculums found'], 404);
        }
        return response()->json($deletedSubjectCurriculums);
    }
}
