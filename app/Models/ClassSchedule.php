<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClassSchedule extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'start_time',
        'end_time',
        'day_of_week',
        'classifiedsection_id',
        'academicprogram_id',
        'classroomscheduling_id',
        'profile_id',
        'semacayear_id',
    ];

    /**
     * Get the classroom scheduling that owns the class schedule.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function classroomScheduling()
    {
        return $this->belongsTo(ClassroomScheduling::class, 'classroomscheduling_id');
    }

    /**
     * Get the classified section that owns the class schedule.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function classifiedSection()
    {
        return $this->belongsTo(ClassifiedSection::class, 'classifiedsection_id');
    }

    /**
     * Get the academic program that owns the class schedule.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function academicProgram()
    {
        return $this->belongsTo(AcademicProgram::class, 'academicprogram_id');
    }

    /**
     * Get the semester academic year that owns the class schedule.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function semesterAcademicYear()
    {
        return $this->belongsTo(SemesterAcademicYear::class, 'semacayear_id');
    }

    /**
     * Get the profile associated with the class schedule.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function profile()
    {
        return $this->belongsTo(Profile::class, 'profile_id');
    }

    /**
     * Get the assignment tracking records for the class schedule.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function assignmentTrackings()
    {
        return $this->hasMany(AssignmentTracking::class);
    }
}
