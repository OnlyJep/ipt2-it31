<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SemesterAcademicYear extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['academicyear_id', 'semester_id'];

    /**
     * Get the class schedules associated with the semester academic year.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function classSchedules()
    {
        return $this->hasMany(ClassSchedule::class);
    }

    /**
     * Get the semester that owns the semester academic year.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function semester()
    {
        return $this->belongsTo(Semester::class, 'semester_id');
    }

    /**
     * Get the academic year that owns the semester academic year.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class, 'academicyear_id');
    }
}
