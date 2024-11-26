<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AnnouncementController extends Controller
{
    // Display a listing of announcements
    public function index()
    {
        $announcements = Announcement::all();
        return response()->json($announcements);
    }

    // Store a newly created announcement in storage
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'announcement' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $announcement = Announcement::create($request->all());
        return response()->json(['message' => 'Announcement created successfully', 'announcement' => $announcement], 201);
    }

    // Display the specified announcement
    public function show($id)
    {
        $announcement = Announcement::withTrashed()->find($id);
        if (!$announcement) {
            return response()->json(['message' => 'Announcement not found'], 404);
        }
        return response()->json($announcement);
    }

    // Update the specified announcement in storage
    public function update(Request $request, $id)
    {
        $announcement = Announcement::withTrashed()->find($id);
        if (!$announcement) {
            return response()->json(['message' => 'Announcement not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'announcement' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $announcement->update($request->all());
        return response()->json(['message' => 'Announcement updated successfully', 'announcement' => $announcement]);
    }

    // Remove the specified announcement from storage
    public function destroy($id)
    {
        $announcement = Announcement::find($id);
        if (!$announcement) {
            return response()->json(['message' => 'Announcement not found'], 404);
        }
        
        $announcement->delete();
        return response()->json(['message' => 'Announcement deleted successfully']);
    }

    // Restore the specified soft-deleted announcement
    public function restore($id)
    {
        $announcement = Announcement::withTrashed()->find($id);
        if (!$announcement) {
            return response()->json(['message' => 'Announcement not found'], 404);
        }

        $announcement->restore();
        return response()->json(['message' => 'Announcement restored successfully']);
    }

    // Permanently delete the specified announcement from storage
    public function forceDelete($id)
    {
        $announcement = Announcement::withTrashed()->find($id);
        if (!$announcement) {
            return response()->json(['message' => 'Announcement not found'], 404);
        }

        $announcement->forceDelete();
        return response()->json(['message' => 'Announcement permanently deleted successfully']);
    }

    // Retrieve all soft-deleted announcements
    public function getDeletedAnnouncements()
    {
        $deletedAnnouncements = Announcement::onlyTrashed()->get();
        if ($deletedAnnouncements->isEmpty()) {
            return response()->json(['message' => 'No soft-deleted announcements found'], 404);
        }
        return response()->json($deletedAnnouncements);
    }
}
