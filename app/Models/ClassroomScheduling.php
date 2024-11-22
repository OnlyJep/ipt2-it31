<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClassroomScheduling extends Model
{
    use HasFactory;

    /**
     * Get the classroom that owns the scheduling.
     */
    public function classroom()
    {
        return $this->belongsTo(Classroom::class);
    }

     /**
     * Get the class schedules for the classroom scheduling.
     */
    public function classSchedules()
    {
        return $this->hasMany(ClassSchedule::class);
    }
}