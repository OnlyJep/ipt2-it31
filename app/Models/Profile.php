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
}
