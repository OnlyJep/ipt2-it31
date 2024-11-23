<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Enlistment extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'profile_id',
        'classschedules_id',
    ];

    /**
     * Get the profile that owns the enlistment.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function profile()
    {
        return $this->belongsTo(Profile::class, 'profile_id');
    }

    /**
     * Get the class schedule that owns the enlistment.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function classSchedule()
    {
        return $this->belongsTo(ClassSchedule::class, 'classschedules_id');
    }

    /**
     * Get the academic year that owns the enlistment.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class);
    }

    /**
     * Get the semester academic years for the enlistment.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function semesterAcademicYears()
    {
        return $this->hasMany(SemesterAcademicYear::class);
    }

    /**
     * Get the enrollment tracking records for the enlistment.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function enrollmentTrackings()
    {
        return $this->hasMany(EnrollmentTracking::class);
    }

    /**
     * Get the assignment tracking records for the enlistment.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function assignmentTrackings()
    {
        return $this->hasMany(AssignmentTracking::class);
    }
}
