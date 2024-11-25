<?php

namespace App\Http\Controllers;

use App\Models\Profile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProfileController extends Controller
{
    // Display a listing of profiles
    public function index()
    {
        $profiles = Profile::all();
        return response()->json($profiles);
    }

    // Store a newly created profile in storage
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'nullable|string|max:50',
            'last_name' => 'nullable|string|max:50',
            'middle_initial' => 'nullable|string|max:20',
            'suffix' => 'nullable|string|max:20',
            'age' => 'nullable|integer|min:0',
            'address' => 'nullable|string',
            'school_email' => 'nullable|email|unique:profiles|max:50',
            'sex' => 'nullable|string|max:20',
            'phone_number' => 'nullable|string|max:20',
            'admission_date' => 'nullable|date',
            'marital_status' => 'nullable|in:single,married,divorced,widowed',
            'religion' => 'nullable|in:catholic,muslim,protestant,hindu',
            'photo_path' => 'nullable|string',
            'emer_full_name' => 'nullable|string|max:100',
            'relationship' => 'nullable|string|max:50',
            'emer_contact_no' => 'nullable|string|max:20',
            'date_of_birth' => 'nullable|date',
            'user_id' => 'nullable|exists:users,id',
            'program_department_id' => 'nullable|exists:college_program_departments,id',
            'yearlevel_id' => 'nullable|exists:year_levels,id',
            'parent_info_id' => 'nullable|exists:parent_infos,id',
            'department_id' => 'nullable|exists:departments,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $profile = Profile::create($request->all());
        return response()->json($profile, 201);
    }

    // Display the specified profile
    public function show($id)
    {
        $profile = Profile::find($id);
        if (!$profile) {
            return response()->json(['message' => 'Profile not found'], 404);
        }
        return response()->json($profile);
    }

    // Update the specified profile in storage
    public function update(Request $request, $id)
    {
        $profile = Profile::find($id);
        if (!$profile) {
            return response()->json(['message' => 'Profile not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'first_name' => 'nullable|string|max:50',
            'last_name' => 'nullable|string|max:50',
            'middle_initial' => 'nullable|string|max:20',
            'suffix' => 'nullable|string|max:20',
            'age' => 'nullable|integer|min:0',
            'address' => 'nullable|string',
            'school_email' => 'nullable|email|unique:profiles,school_email,' . $id . '|max:50',
            'sex' => 'nullable|string|max:20',
            'phone_number' => 'nullable|string|max:20',
            'admission_date' => 'nullable|date',
            'marital_status' => 'nullable|in:single,married,divorced,widowed',
            'religion' => 'nullable|in:catholic,muslim,protestant,hindu',
            'photo_path' => 'nullable|string',
            'emer_full_name' => 'nullable|string|max:100',
            'relationship' => 'nullable|string|max:50',
            'emer_contact_no' => 'nullable|string|max:20',
            'date_of_birth' => 'nullable|date',
            'user_id' => 'nullable|exists:users,id',
            'program_department_id' => 'nullable|exists:college_program_departments,id',
            'yearlevel_id' => 'nullable|exists:year_levels,id',
            'parent_info_id' => 'nullable|exists:parent_infos,id',
            'department_id' => 'nullable|exists:departments,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $profile->update($request->all());
        return response()->json($profile);
    }

    // Remove the specified profile from storage
    public function destroy($id)
    {
        $profile = Profile::find($id);
        if (!$profile) {
            return response()->json(['message' => 'Profile not found'], 404);
        }
        
        $profile->delete();
        return response()->json(['message' => 'Profile deleted successfully']);
    }

    // Restore the specified soft-deleted profile
    public function restore($id)
    {
        $profile = Profile::withTrashed()->find($id);
        if (!$profile) {
            return response()->json(['message' => 'Profile not found'], 404);
        }

        $profile->restore();
        return response()->json(['message' => 'Profile restored successfully']);
    }

    // Permanently delete the specified profile from storage
    public function forceDelete($id)
    {
        $profile = Profile::withTrashed()->find($id);
        if (!$profile) {
            return response()->json(['message' => 'Profile not found'], 404);
        }

        $profile->forceDelete();
        return response()->json(['message' => 'Profile permanently deleted successfully']);
    }
}