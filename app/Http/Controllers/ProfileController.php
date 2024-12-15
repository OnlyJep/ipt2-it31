<?php

namespace App\Http\Controllers;

use App\Models\Profile;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class ProfileController extends Controller
{
    // Display a listing of profiles
    public function index(Request $request)
    {
        $department = "(SELECT department_name FROM departments WHERE id = profiles.department_id)";
        $created_at_format = "DATE_FORMAT(profiles.created_at, '%M %d, %Y')";

        $data = Profile::select([
            '*',
            DB::raw($created_at_format . ' as created_at_format'),
            DB::raw($department . ' as department'),
        ])
            ->with(['user']);

        if ($request->has('search')) {
            $data->where(function ($query) use ($request, $created_at_format, $department) {
                $query->orWhere('first_name', 'like', '%' . $request->search . '%');
                $query->orWhere('last_name', 'like', '%' . $request->search . '%');
                $query->orWhere('middle_initial', 'like', '%' . $request->search . '%');
                $query->orWhere('suffix', 'like', '%' . $request->search . '%');
                $query->orWhere('address', 'like', '%' . $request->search . '%');
                $query->orWhere('school_email', 'like', '%' . $request->search . '%');
                $query->orWhere('sex', 'like', '%' . $request->search . '%');
                $query->orWhere('phone_number', 'like', '%' . $request->search . '%');
                $query->orWhere('marital_status', 'like', '%' . $request->search . '%');
                $query->orWhere('religion', 'like', '%' . $request->search . '%');
                $query->orWhere(DB::raw("$created_at_format"), 'like', '%' . $request->search . '%');
                $query->orWhere(DB::raw($department), 'like', '%' . $request->search . '%');
            });
        }

        if ($request->status == 'Archived') {
            $data->onlyTrashed();
        }

        if ($request->profile_status == 'All Faculty') {
            $data->whereIn('profile_status', ['Full-time', 'Part-time']);
        } else {
            $data->where('profile_status', $request->profile_status);
        }

        $data->whereHas('user', function ($query) use ($request) {
            if ($request->role_ids) {
                $role_ids = explode(',', $request->role_ids);
                $query->whereIn('role_id', $role_ids);
            }
        });

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

    // Create a new profile in storage
    public function store(Request $request)
    {
        $request->validate([
            'first_name' => 'required',
            'last_name' => 'required',
            'school_email' => [
                'required',
                Rule::unique('profiles')->ignore($request->id)
            ],
        ]);

        $data = $request->except(['photo_path', 'password']);

        // Handle file upload if exists
        if ($request->hasFile('photo')) {
            $photo = $request->file('photo');
            $path = $photo->store('profile_photos', 'public'); // Store photo in the "profile_photos" directory

            $data['photo_path'] = $path;
        }

        $updateCreate = Profile::updateOrCreate(
            ['id' => $request->id ? $request->id : null],
            $data
        );

        if ($updateCreate) {

            $username = explode('@', $request->school_email);
            $dataUser = [
                'username' => $username[0],
                'email' => $request->school_email,
                'role_id' => 3,
                'status' => 'Active',
            ];

            if ($request->password) {
                $dataUser['password'] = bcrypt($request->password);
            }

            $user_id = $updateCreate->user_id ? $updateCreate->user_id : null;

            $user =  User::updateOrCreate(
                ['id' => $user_id],
                $dataUser
            );

            if ($user) {
                if (!$user_id) {
                    $updateCreate->update(['user_id' => $user->id]);
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Profile ' . ($request->id ? 'updated' : 'created') . ' successfully',
            ], 200);
        }

        return response()->json([
            'success' => false,
            'message' => 'Profile not ' . ($request->id ? 'updated' : 'created')
        ], 200);
    }

    // Update an existing profile in storage
    public function update(Request $request, $id)
    {
        $profile = Profile::withTrashed()->find($id);
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
            'religion' => 'nullable|string',
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
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048', // Validate photo upload
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Handle file upload (if any)
        if ($request->hasFile('photo') && $request->file('photo')->isValid()) {
            // Delete the old photo if exists
            if ($profile->photo_path && Storage::exists('public/' . $profile->photo_path)) {
                Storage::delete('public/' . $profile->photo_path);
            }

            // Store the new photo
            $photoPath = $request->file('photo')->store('photos', 'public');
            $profile->photo_path = $photoPath;
        }

        $profile->update($request->all());
        return response()->json($profile, 200);
    }

    public function uploadPhoto(Request $request)
    {
        // Validate the file upload and profile_id
        $request->validate([
            'photo' => 'required|file|image|max:2048', // File validation
            'profile_id' => 'required|exists:profiles,id', // Ensure profile_id exists in the database
        ]);

        $profileId = $request->input('profile_id');  // Get the profile ID from the request

        // Retrieve the profile using the profile_id
        $profile = Profile::find($profileId);

        // Check if the profile exists
        if (!$profile) {
            return response()->json(['message' => 'Profile not found.'], 404);
        }

        // Handle file upload logic
        if ($request->hasFile('photo') && $request->file('photo')->isValid()) {
            $path = $request->file('photo')->store('photos', 'public');  // Store photo in the "photos" directory

            // Save the file path in the profile's photo_path field
            $profile->photo_path = $path;
            $profile->save();  // Save the profile with the updated photo_path

            return response()->json(['message' => 'Photo uploaded successfully!', 'path' => $path]);
        }

        return response()->json(['message' => 'Failed to upload photo.'], 400);
    }



    // Display the specified profile
    public function show($id)
    {
        try {
            // Retrieve profile including soft-deleted ones using withTrashed
            $profile = Profile::withTrashed()->find($id);

            // Check if the profile exists
            if (!$profile) {
                return response()->json(['message' => 'Profile not found'], 404);
            }

            // Return the profile data as a JSON response
            return response()->json($profile);
        } catch (\Exception $e) {
            // Log any errors for debugging purposes
            return response()->json(['message' => 'Something went wrong'], 500);
        }
    }


    // Soft delete the specified profile
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
    public function profile_archived(Request $request)
    {
        $request->validate([
            'ids' => 'required',
            'status' => 'required|in:Archived,Active',
        ]);

        $ids = $request->ids;

        $profiles = Profile::withTrashed()->whereIn('id', $ids)->get();

        if ($request->status == "Archived") {
            foreach ($profiles as $profile) {
                $profile->restore();
                $findUser = User::find($profile->user_id);
                if ($findUser) {
                    $findUser->update(['status' => 'Active']);
                }
            }
            return response()->json(['message' => 'Profile restored successfully', 'success' => true]);
        } else {
            foreach ($profiles as $profile) {
                $findUser = User::find($profile->user_id);
                if ($findUser) {
                    $findUser->update(['status' => 'Deactive']);
                }
                $profile->delete();
            }
            return response()->json(['message' => 'Profile archived successfully', 'success' => true]);
        }

        return response()->json(['message' => 'Data not ' . ($request->status == 'Active' ? 'archive' : 'restore'), 'success' => false]);
    }

    public function showByProfileId($profileId)
    {
        // Fetch the profile using the profileId
        $profile = Profile::find($profileId);

        // Check if the profile exists
        if ($profile) {
            return response()->json($profile);
        } else {
            return response()->json(['message' => 'Profile not found.'], 404);
        }
    }

    public function getTotalInstructors()
    {
        // Count instructors excluding soft-deleted users and profiles
        $totalInstructors = Profile::join('users', 'profiles.user_id', '=', 'users.id')
            ->join('roles', 'users.role_id', '=', 'roles.id')
            ->where('roles.role_name', 'teacher')
            ->whereNull('users.deleted_at')
            ->whereNull('profiles.deleted_at')
            ->count();

        return response()->json(['totalInstructors' => $totalInstructors]);
    }

    public function getTotalStudents()
    {

        $studentRoleId = 4;
        // Count students excluding soft-deleted users and profiles
        $totalStudents = Profile::join('users', 'profiles.user_id', '=', 'users.id')
            ->where('users.role_id', $studentRoleId)
            ->whereNull('users.deleted_at') // Exclude soft-deleted users
            ->whereNull('profiles.deleted_at') // Exclude soft-deleted profiles
            ->count();

        return response()->json(['totalStudents' => $totalStudents]);
    }

    public function deletePhoto($profileId)
    {
        $profile = Profile::find($profileId);
        if (!$profile) {
            return response()->json(['message' => 'Profile not found'], 404);
        }

        if ($profile->photo_path && Storage::exists('public/' . $profile->photo_path)) {
            Storage::delete('public/' . $profile->photo_path);
        }

        $profile->photo_path = null;  // Remove the photo path from the profile
        $profile->save();

        return response()->json(['message' => 'Old photo deleted successfully']);
    }

    public function getStudents()
    {
        try {
            // Join Profiles, Users, and Roles tables
            $students = Profile::join('users', 'profiles.user_id', '=', 'users.id')  // Join with users table
                ->join('roles', 'users.role_id', '=', 'roles.id')  // Join with roles table
                ->where('roles.id', 4)  // Filter by student role (role_id = 4)
                ->select(
                    'profiles.first_name',
                    'profiles.last_name',
                    'profiles.middle_initial',
                    'profiles.suffix',
                    'profiles.date_of_birth',
                    'profiles.address',
                    'profiles.school_email',
                    'profiles.sex',
                    'profiles.phone_number',
                    'profiles.admission_date',
                    'profiles.marital_status',
                    'profiles.religion',
                    'profiles.created_at',
                    'profiles.updated_at'
                )
                ->get();

            return response()->json($students);
        } catch (\Exception $e) {
            Log::error('Error fetching students: ' . $e->getMessage());  // Log the error message
            return response()->json(['message' => 'Error fetching students'], 500);
        }
    }


    public function faculty_list(Request $request)
    {
        $created_at_format = "DATE_FORMAT(profiles.created_at, '%F %d, %Y')";

        $data = Profile::select([
            '*',
            DB::raw($created_at_format . ' as created_at_format'),
        ]);

        if ($request->has('search')) {
            $data->where(function ($query) use ($request, $created_at_format) {
                $query->where('first_name', 'like', '%' . $request->search . '%');
                $query->orWhere('last_name', 'like', '%' . $request->search . '%');
                $query->orWhere(DB::raw("$created_at_format"), 'like', '%' . $request->search . '%');
            });
        }

        $data->whereHas('user', function ($query) use ($request) {
            $query->where('role_id', 3);

            // if ($request->has('status')) {
            //     $query->where(function ($query) use ($request) {
            //         $query->where('username', 'like', '%' . $request->search . '%');
            //         $query->orWhere('email', 'like', '%' . $request->search . '%');
            //     });
            // }
        });

        if ($request->sort_field && $request->sort_order) {
            $data =   $data->orderBy($request->sort_field, $request->sort_order);
        } else {
            $data =   $data->orderBy('id', 'desc');
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
}
