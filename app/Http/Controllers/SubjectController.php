<?php

namespace App\Http\Controllers;

use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class SubjectController extends Controller
{
    // Display a listing of subjects
    public function index(Request $request)
    {
        $created_at_format = "DATE_FORMAT(subjects.created_at, '%M %d, %Y')";

        $data = Subject::select([
            '*',
            DB::raw($created_at_format . ' as created_at_format'),
        ]);

        if ($request->has('search')) {
            $data->where(function ($query) use ($request, $created_at_format,) {
                $query->orWhere('subject_code', 'like', '%' . $request->search . '%');
                $query->orWhere('subject_name', 'like', '%' . $request->search . '%');
                $query->orWhere('subject_description', 'like', '%' . $request->search . '%');
                $query->orWhere('units', 'like', '%' . $request->search . '%');
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

    // Store a newly created subject in storage
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'subject_code' => 'required|string|max:10|unique:subjects,subject_code',
            'subject_name' => 'required|string|max:50',
            'classification' => 'required|string|max:50',
            'units' => 'required|integer|min:0',
            'subject_description' => 'nullable|string',
            'availability' => 'required|boolean',
            'subjectcategory_id' => 'required|exists:subject_category,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $subject = Subject::create($request->all());
        return response()->json(['message' => 'Subject created successfully', 'subject' => $subject], 201);
    }

    // Display the specified subject
    public function show($id)
    {
        $subject = Subject::withTrashed()->find($id);
        if (!$subject) {
            return response()->json(['message' => 'Subject not found'], 404);
        }
        return response()->json($subject);
    }

    // Update the specified subject in storage
    public function update(Request $request, $id)
    {
        $subject = Subject::withTrashed()->find($id);
        if (!$subject) {
            return response()->json(['message' => 'Subject not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'subject_code' => 'required|string|max:10|unique:subjects,subject_code,' . $subject->id,
            'subject_name' => 'required|string|max:50',
            'classification' => 'required|string|max:50',
            'units' => 'required|integer|min:0',
            'subject_description' => 'nullable|string',
            'availability' => 'required|boolean',
            'subjectcategory_id' => 'required|exists:subject_category,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $subject->update($request->all());
        return response()->json(['message' => 'Subject updated successfully', 'subject' => $subject]);
    }

    // Soft delete the specified subject
    public function destroy($id)
    {
        $subject = Subject::find($id);
        if (!$subject) {
            return response()->json(['message' => 'Subject not found'], 404);
        }

        $subject->delete();
        return response()->json(['message' => 'Subject deleted successfully']);
    }

    // Restore the specified soft-deleted subject
    public function restore($id)
    {
        $subject = Subject::withTrashed()->find($id);
        if (!$subject) {
            return response()->json(['message' => 'Subject not found'], 404);
        }

        $subject->restore();
        return response()->json(['message' => 'Subject restored successfully']);
    }
}
