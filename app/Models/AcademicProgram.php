<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AcademicProgram extends Model
{
    use HasFactory;

    public function classSchedules()
    {
        return $this->hasMany(ClassSchedule::class);
    }
 
    /**
     * Get the college program that owns the academic program.
     */
    public function collegeProgram()
    {
        return $this->belongsTo(CollegeProgram::class);
    }

    /**
     * Get the department that owns the academic program.
     */
    public function department()
    {
        return $this->belongsTo(Department::class);
    }

        /**
     * Get the subject curriculum that owns the academic program.
     */
    public function subjectCurriculum()
    {
        return $this->belongsTo(SubjectCurriculum::class);
    }

        /**
     * Get the profiles for the academic program.
     */
    public function profiles()
    {
        return $this->hasMany(Profile::class);
    }
}
