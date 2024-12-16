<?php

namespace App\Http\Controllers;

use App\Models\Building;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class BuildingController extends Controller
{
    // Display a listing of buildings
    public function index(Request $request)
    {
        $created_at_format = "DATE_FORMAT(buildings.created_at, '%M %d, %Y')";

        $data = Building::select([
            '*',
            DB::raw($created_at_format . ' as created_at_format'),
        ]);

        if ($request->has('search')) {
            $data->where(function ($query) use ($request, $created_at_format,) {
                $query->orWhere('building_name', 'like', '%' . $request->search . '%');
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


    // Store a newly created building in storage
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'floor_id' => 'nullable|exists:floors,id',
            'building_name' => 'required|string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $building = Building::create($request->all());
        return response()->json(['message' => 'Building created successfully', 'building' => $building], 201);
    }

    // Display the specified building
    public function show($id)
    {
        $building = Building::withTrashed()->find($id);
        if (!$building) {
            return response()->json(['message' => 'Building not found'], 404);
        }
        return response()->json($building);
    }

    // Update the specified building in storage
    public function update(Request $request, $id)
    {
        $building = Building::withTrashed()->find($id);
        if (!$building) {
            return response()->json(['message' => 'Building not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'floor_id' => 'required|exists:floors,id',
            'building_name' => 'required|string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $building->update($request->all());
        return response()->json(['message' => 'Building updated successfully', 'building' => $building]);
    }

    // Remove the specified building from storage
    public function destroy($id)
    {
        $building = Building::find($id);
        if (!$building) {
            return response()->json(['message' => 'Building not found'], 404);
        }

        $building->delete();
        return response()->json(['message' => 'Building deleted successfully']);
    }

    // Restore the specified soft-deleted building
    public function restore($id)
    {
        $building = Building::withTrashed()->find($id); // Include soft-deleted buildings

        if (!$building) {
            return response()->json(['message' => 'Building not found'], 404);
        }

        $building->deleted_at = null; // Restore the building (set deleted_at to null)
        $building->save();

        return response()->json(['message' => 'Building restored successfully'], 200);
    }

    public function building_archived(Request $request)
    {
        $request->validate([
            'ids' => 'required',
            'status' => 'required',
        ]);

        $ids = $request->ids;

        $find = Building::withTrashed()->whereIn('id', $ids)->get();

        if ($request->status == 'Archived') {
            foreach ($find as $room) {
                $room->restore();
            }

            return response()->json([
                'success' => true,
                'message' => 'Building restored successfully',
            ], 200);
        } else {
            foreach ($find as $room) {
                $room->delete();
            }

            return response()->json([
                'success' => true,
                'message' => 'Building archived successfully',
            ], 200);
        }

        return response()->json([
            'success' => false,
            'message' => 'Building not found',
        ], 404);
    }
}
