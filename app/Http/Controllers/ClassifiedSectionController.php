<?php

namespace App\Http\Controllers;

use App\Models\ClassifiedSection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ClassifiedSectionController extends Controller
{
    // Display a listing of classified sections
    public function index(Request $request)
    {
        $deleted = $request->query('deleted', 'false');

        $section = "(SELECT section_name FROM sections WHERE sections.id = classified_sections.section_id)";
        $collegeprogram = "(SELECT college_programs FROM college_programs WHERE college_programs.id = classified_sections.collegeprogram_id)";
        $yearlevel = "(SELECT year_level FROM year_levels WHERE year_levels.id = classified_sections.yearlevel_id)";

        if ($deleted === 'only') {
            $classifiedSections = ClassifiedSection::select([
                '*',
                DB::raw($section . ' as section'),
                DB::raw($collegeprogram . ' as collegeprogram'),
                DB::raw($yearlevel . ' as yearlevel'),
            ])->onlyTrashed()->get();
        } elseif ($deleted === 'true') {
            $classifiedSections = ClassifiedSection::select([
                '*',
                DB::raw($section . ' as section'),
                DB::raw($collegeprogram . ' as collegeprogram'),
                DB::raw($yearlevel . ' as yearlevel'),
            ])->withTrashed()->get();
        } else {
            $classifiedSections = ClassifiedSection::select([
                '*',
                DB::raw($section . ' as section'),
                DB::raw($collegeprogram . ' as collegeprogram'),
                DB::raw($yearlevel . ' as yearlevel'),
            ])->get();
        }

        if ($classifiedSections->isEmpty()) {
            return response()->json(['message' => 'No classified sections found'], 404);
        }

        return response()->json($classifiedSections);
    }

    // Store a newly created classified section in storage
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'section_id' => 'required|exists:sections,id',
            'collegeprogram_id' => 'required|exists:college_programs,id',
            'yearlevel_id' => 'required|exists:year_levels,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $classifiedSection = ClassifiedSection::create($request->all());
        return response()->json(['message' => 'Classified Section created successfully', 'classifiedSection' => $classifiedSection], 201);
    }

    // Display the specified classified section
    public function show($id)
    {
        $classifiedSection = ClassifiedSection::withTrashed()->find($id);
        if (!$classifiedSection) {
            return response()->json(['message' => 'Classified Section not found'], 404);
        }
        return response()->json($classifiedSection);
    }

    // Update the specified classified section in storage
    public function update(Request $request, $id)
    {
        $classifiedSection = ClassifiedSection::withTrashed()->find($id);
        if (!$classifiedSection) {
            return response()->json(['message' => 'Classified Section not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'section_id' => 'required|exists:sections,id',
            'collegeprogram_id' => 'required|exists:college_programs,id',
            'yearlevel_id' => 'required|exists:year_levels,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $classifiedSection->update($request->all());
        return response()->json(['message' => 'Classified Section updated successfully', 'classifiedSection' => $classifiedSection]);
    }

    // Remove the specified classified section from storage
    public function destroy($id)
    {
        $classifiedSection = ClassifiedSection::find($id);
        if (!$classifiedSection) {
            return response()->json(['message' => 'Classified Section not found'], 404);
        }

        $classifiedSection->delete();
        return response()->json(['message' => 'Classified Section deleted successfully']);
    }

    // Restore the specified soft-deleted classified section
    public function restore($id)
    {
        $classifiedSection = ClassifiedSection::withTrashed()->find($id);
        if (!$classifiedSection) {
            return response()->json(['message' => 'Classified Section not found'], 404);
        }

        $classifiedSection->restore();
        return response()->json(['message' => 'Classified Section restored successfully']);
    }
}
