<?php

namespace App\Http\Controllers;

use App\Models\ClassSchedule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ClassScheduleController extends Controller
{
    // Display a listing of class schedules
    public function index(Request $request)
    {
        $instructor = "(SELECT TRIM(CONCAT_WS(' ', last_name, IF(last_name IS NOT NULL, ', ', ''), first_name, IF(middle_initial='', NULL, middle_initial), IF(suffix='', NULL, suffix))) FROM profiles WHERE id = class_schedules.profile_id)";
        $subject = "(SELECT subject_name FROM subjects WHERE id = class_schedules.subject_id)";
        $section = "(SELECT (SELECT section_name FROM sections WHERE sections.id = classified_sections.section_id) FROM classified_sections WHERE id = class_schedules.classifiedsection_id)";
        $room = "(SELECT room_code FROM rooms WHERE id = class_schedules.room_id)";
        $created_at_format = "DATE_FORMAT(class_schedules.created_at, '%M %d, %Y')";

        $data = ClassSchedule::select([
            '*',
            DB::raw($created_at_format . ' as created_at_format'),
            DB::raw($subject . ' as subject'),
            DB::raw($section . ' as section'),
            DB::raw($instructor . ' as instructor'),
            DB::raw($room . ' as room'),
        ]);

        if ($request->has('search')) {
            $data->where(function ($query) use ($request, $created_at_format, $section, $subject, $instructor, $room) {
                $query->orWhere('start_time', 'like', '%' . $request->search . '%');
                $query->orWhere('end_time', 'like', '%' . $request->search . '%');
                $query->orWhere(DB::raw("$created_at_format"), 'like', '%' . $request->search . '%');
                $query->orWhere(DB::raw($section), 'like', '%' . $request->search . '%');
                $query->orWhere(DB::raw($subject), 'like', '%' . $request->search . '%');
                $query->orWhere(DB::raw($instructor), 'like', '%' . $request->search . '%');
                $query->orWhere(DB::raw($room), 'like', '%' . $request->search . '%');
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

    // Store a newly created class schedule in storage
    public function store(Request $request)
    {
        $request->validate([
            'start_time' => 'required',
            'end_time' => 'required',
            'day_of_week' => 'required|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
            'classifiedsection_id' => 'required',
            // 'academicprogram_id' => 'required|exists:academic_programs,id',
            // 'classroomscheduling_id' => 'required|exists:classroom_scheduling,id',
            'profile_id' => 'required',
            'room_id' => 'required',
            'subject_id' => 'required',
        ]);

        $data = $request->all();

        $data['academicprogram_id'] = 0;
        $data['classroomscheduling_id'] = 0;

        $classSchedule = ClassSchedule::updateOrCreate(['id' => $request->id ? $request->id : null], $data);

        if ($classSchedule) {
            return response()->json(['success' => true, 'message' => 'Class Schedule ' . ($request->id ? 'updated' : 'created'),], 200);
        }

        return response()->json(['success' => false, 'message' => 'Class Schedule not ' . ($request->id ? 'updated' : 'created'),], 201);
    }

    // Display the specified class schedule
    public function show($id)
    {
        $classSchedule = ClassSchedule::withTrashed()->find($id);
        if (!$classSchedule) {
            return response()->json(['message' => 'Class Schedule not found'], 404);
        }
        return response()->json($classSchedule);
    }

    // Update the specified class schedule in storage
    public function update(Request $request, $id)
    {
        $classSchedule = ClassSchedule::withTrashed()->find($id);
        if (!$classSchedule) {
            return response()->json(['message' => 'Class Schedule not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'day_of_week' => 'required|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
            'classifiedsection_id' => 'required|exists:classified_sections,id',
            'academicprogram_id' => 'required|exists:academic_programs,id',
            'classroomscheduling_id' => 'required|exists:classroom_scheduling,id',
            'profile_id' => 'nullable|exists:profiles,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $classSchedule->update($request->all());
        return response()->json(['message' => 'Class Schedule updated successfully', 'classSchedule' => $classSchedule]);
    }

    // Remove the specified class schedule from storage
    public function destroy($id)
    {
        $classSchedule = ClassSchedule::find($id);
        if (!$classSchedule) {
            return response()->json(['message' => 'Class Schedule not found'], 404);
        }

        $classSchedule->delete();
        return response()->json(['message' => 'Class Schedule deleted successfully']);
    }

    // Restore the specified soft-deleted class schedule
    public function restore($id)
    {
        $classSchedule = ClassSchedule::withTrashed()->find($id);
        if (!$classSchedule) {
            return response()->json(['message' => 'Class Schedule not found'], 404);
        }

        $classSchedule->restore();
        return response()->json(['message' => 'Class Schedule restored successfully']);
    }
}
