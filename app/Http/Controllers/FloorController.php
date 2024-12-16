<?php

namespace App\Http\Controllers;

use App\Models\Floor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class FloorController extends Controller
{
    // Display a listing of floors
    public function index(Request $request)
    {
        $created_at_format = "DATE_FORMAT(floors.created_at, '%M %d, %Y')";

        $data = Floor::select([
            '*',
            DB::raw($created_at_format . ' as created_at_format'),
        ]);

        if ($request->has('search')) {
            $data->where(function ($query) use ($request, $created_at_format,) {
                $query->orWhere('floor_level', 'like', '%' . $request->search . '%');
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

    // Store a newly created floor in storage
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'floor_level' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $floor = Floor::create($request->all());
        return response()->json(['message' => 'Floor created successfully', 'floor' => $floor], 201);
    }

    // Display the specified floor
    public function show($id)
    {
        $floor = Floor::withTrashed()->find($id);
        if (!$floor) {
            return response()->json(['message' => 'Floor not found'], 404);
        }
        return response()->json($floor);
    }

    // Update the specified floor in storage
    public function update(Request $request, $id)
    {
        $floor = Floor::withTrashed()->find($id);
        if (!$floor) {
            return response()->json(['message' => 'Floor not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'floor_level' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $floor->update($request->all());
        return response()->json(['message' => 'Floor updated successfully', 'floor' => $floor]);
    }

    // Remove the specified floor from storage
    public function destroy($id)
    {
        $floor = Floor::find($id);
        if (!$floor) {
            return response()->json(['message' => 'Floor not found'], 404);
        }

        $floor->delete();
        return response()->json(['message' => 'Floor deleted successfully']);
    }

    // Restore the specified soft-deleted floor
    public function restore($id)
    {
        $floor = Floor::withTrashed()->find($id);
        if (!$floor) {
            return response()->json(['message' => 'Floor not found'], 404);
        }

        $floor->restore();
        return response()->json(['message' => 'Floor restored successfully']);
    }

    // Retrieve all soft-deleted floors
    public function getDeletedFloors()
    {
        $deletedFloors = Floor::onlyTrashed()->get();
        if ($deletedFloors->isEmpty()) {
            return response()->json(['message' => 'No soft-deleted floors found'], 404);
        }
        return response()->json($deletedFloors);
    }
}
