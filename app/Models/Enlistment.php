<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Enlistment extends Model
{
    use HasFactory;


        /**
     * Get the academic year that owns the enlistment.
     */
    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class);
    }


    /**
     * Get the profile that owns the enlistment.
     */
    public function profile()
    {
        return $this->belongsTo(Profile::class);
    }

        /**
     * Get the semester academic years for the academic year.
     */
    public function semesterAcademicYears()
    {
        return $this->hasMany(SemesterAcademicYear::class);
    }

        /**
     * Get the enrollment tracking records for the enlistment.
     */
    public function enrollmentTrackings()
    {
        return $this->hasMany(EnrollmentTracking::class);
    }
}
