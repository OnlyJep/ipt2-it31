<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class EventController extends Controller
{
    // Display a listing of events
    public function index()
    {
        $events = Event::all();
        return response()->json($events);
    }

    // Store a newly created event in storage
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'event_name' => 'required|string|max:255',
            'date' => 'required|date',
            'time' => 'required|date_format:H:i',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $event = Event::create($request->all());
        return response()->json(['message' => 'Event created successfully', 'event' => $event], 201);
    }

    // Display the specified event
    public function show($id)
    {
        $event = Event::withTrashed()->find($id);
        if (!$event) {
            return response()->json(['message' => 'Event not found'], 404);
        }
        return response()->json($event);
    }

    // Update the specified event in storage
    public function update(Request $request, $id)
    {
        $event = Event::withTrashed()->find($id);
        if (!$event) {
            return response()->json(['message' => 'Event not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'event_name' => 'required|string|max:255',
            'date' => 'required|date',
            'time' => 'required|date_format:H:i',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $event->update($request->all());
        return response()->json(['message' => 'Event updated successfully', 'event' => $event]);
    }

    // Remove the specified event from storage
    public function destroy($id)
    {
        $event = Event::find($id);
        if (!$event) {
            return response()->json(['message' => 'Event not found'], 404);
        }
        
        $event->delete();
        return response()->json(['message' => 'Event deleted successfully']);
    }

    // Restore the specified soft-deleted event
    public function restore($id)
    {
        $event = Event::withTrashed()->find($id);
        if (!$event) {
            return response()->json(['message' => 'Event not found'], 404);
        }

        $event->restore();
        return response()->json(['message' => 'Event restored successfully']);
    }

    // Permanently delete the specified event from storage
    public function forceDelete($id)
    {
        $event = Event::withTrashed()->find($id);
        if (!$event) {
            return response()->json(['message' => 'Event not found'], 404);
        }

        $event->forceDelete();
        return response()->json(['message' => 'Event permanently deleted successfully']);
    }

    // Retrieve all soft-deleted events
    public function getDeletedEvents()
    {
        $deletedEvents = Event::onlyTrashed()->get();
        if ($deletedEvents->isEmpty()) {
            return response()->json(['message' => 'No soft-deleted events found'], 404);
        }
        return response()->json($deletedEvents);
    }
}
