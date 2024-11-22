<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClassSchedule extends Model
{
    use HasFactory;

    public function classroomScheduling()
    {
        return $this->belongsTo(ClassroomScheduling::class);
    }

    public function classifiedSection()
    {
        return $this->belongsTo(ClassifiedSection::class);
    }

       /**
     * Get the academic program that owns the class schedule.
     */
    public function academicProgram()
    {
        return $this->belongsTo(AcademicProgram::class);
    }

        /**
     * Get the class schedules for the profile.
     */
    public function classSchedules()
    {
        return $this->hasMany(ClassSchedule::class);
    }


        /**
     * Get the semester academic year that owns the class schedule.
     */
    public function semesterAcademicYear()
    {
        return $this->belongsTo(SemesterAcademicYear::class);
    }
}
