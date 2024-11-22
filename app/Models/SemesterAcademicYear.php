<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SemesterAcademicYear extends Model
{
    use HasFactory;

    public function classSchedules()
    {
        return $this->hasMany(ClassSchedule::class);
    }

        /**
     * Get the semester that owns the semester academic year.
     */
    public function semester()
    {
        return $this->belongsTo(Semester::class);
    }

        /**
     * Get the academic year that owns the semester academic year.
     */
    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class);
    }

}
