<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClassroomScheduling extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['time_start', 'time_end', 'day_of_week', 'classroom_id'];

    /**
     * Get the classroom that owns the scheduling.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function classroom()
    {
        return $this->belongsTo(Classroom::class, 'classroom_id');
    }

    /**
     * Get the class schedules for the classroom scheduling.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function classSchedules()
    {
        return $this->hasMany(ClassSchedule::class, 'classroomscheduling_id');
    }
}
