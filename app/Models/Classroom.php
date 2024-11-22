<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Classroom extends Model
{
    use HasFactory;

    /**
     * Get the building that owns the classroom.
     */
    public function building()
    {
        return $this->belongsTo(Building::class);
    }

    /**
     * Get the floor that owns the classroom.
     */
    public function floor()
    {
        return $this->belongsTo(Floor::class);
    }

    /**
     * Get the room tag that owns the classroom.
     */
    public function roomTag()
    {
        return $this->belongsTo(RoomTag::class);
    }

    /**
     * Get the classroom schedulings for the classroom.
     */
    public function classroomSchedulings()
    {
        return $this->hasMany(ClassroomScheduling::class);
    }
}