<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    use HasFactory;

    /**
     * Get the user that owns the profile.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

        /**
     * Get the class schedules for the profile.
     */
    public function classSchedules()
    {
        return $this->hasMany(ClassSchedule::class);
    }

        /**
     * Get the enlistments for the profile.
     */
    public function enlistments()
    {
        return $this->hasMany(Enlistment::class);
    }

        /**
     * Get the academic program that owns the profile.
     */
    public function academicProgram()
    {
        return $this->belongsTo(AcademicProgram::class);
    }

        /**
     * Get the year level that owns the profile.
     */
    public function yearLevel()
    {
        return $this->belongsTo(YearLevel::class);
    }

        /**
     * Get the parent info that owns the profile.
     */
    public function parentInfo()
    {
        return $this->belongsTo(ParentInfo::class);
    }

        /**
     * Get the department that owns the profile.
     */
    public function department()
    {
        return $this->belongsTo(Department::class);
    }

        /**
     * Get the notifications for the profile.
     */
    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }
}
