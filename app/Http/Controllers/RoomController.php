<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RoomController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $building_name = "(SELECT building_name FROM buildings WHERE id = rooms.building_id)";
        $floor_level = "(SELECT floor_level FROM floors WHERE id = rooms.floor_id)";
        $created_at_format = "DATE_FORMAT(rooms.created_at, '%M %d, %Y')";

        $data = Room::select([
            '*',
            DB::raw($created_at_format . ' as created_at_format'),
            DB::raw($building_name . ' as building_name'),
            DB::raw($floor_level . ' as floor_level'),
        ]);

        if ($request->has('search')) {
            $data->where(function ($query) use ($request, $created_at_format, $building_name, $floor_level) {
                $query->orWhere('room_code', 'like', '%' . $request->search . '%');
                $query->orWhere(DB::raw("$created_at_format"), 'like', '%' . $request->search . '%');
                $query->orWhere(DB::raw($building_name), 'like', '%' . $request->search . '%');
                $query->orWhere(DB::raw($floor_level), 'like', '%' . $request->search . '%');
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

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'room_code' => 'required',
            'building_id' => 'required',
            'floor_id' => 'required',
        ]);

        $room = Room::updateOrCreate([
            'id' => $request->id ? $request->id : null,
        ], [
            'room_code' => $request->room_code,
            'building_id' => $request->building_id,
            'floor_id' => $request->floor_id,
        ]);

        if ($room) {
            return response()->json([
                'success' => true,
                'message' => 'Room ' . ($request->id ? 'updated' : 'created') . ' successfully',
            ], 200);
        }

        return response()->json([
            'success' => false,
            'message' => 'Room not created',
        ], 500);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Room  $room
     * @return \Illuminate\Http\Response
     */
    public function show(Room $room)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Room  $room
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Room $room)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Room  $room
     * @return \Illuminate\Http\Response
     */
    public function destroy(Room $room)
    {
        //
    }

    public function room_archived(Request $request)
    {
        $request->validate([
            'ids' => 'required',
            'status' => 'required',
        ]);

        $ids = $request->ids;

        $find = Room::withTrashed()->whereIn('id', $ids)->get();

        if ($request->status == 'Archived') {
            foreach ($find as $room) {
                $room->restore();
            }

            return response()->json([
                'success' => true,
                'message' => 'Room restored successfully',
            ], 200);
        } else {
            foreach ($find as $room) {
                $room->delete();
            }

            return response()->json([
                'success' => true,
                'message' => 'Room archived successfully',
            ], 200);
        }

        return response()->json([
            'success' => false,
            'message' => 'Room not found',
        ], 404);
    }
}
