<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AcademicProgram extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['collegeprogram_id', 'department_id', 'subjectcurriculum_id'];

    /**
     * Get the college program that owns the academic program.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function collegeProgram()
    {
        return $this->belongsTo(CollegeProgram::class, 'collegeprogram_id');
    }

    /**
     * Get the department that owns the academic program.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function department()
    {
        return $this->belongsTo(Department::class, 'department_id');
    }

    /**
     * Get the subject curriculum that owns the academic program.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function subjectCurriculum()
    {
        return $this->belongsTo(SubjectCurriculum::class, 'subjectcurriculum_id');
    }

    /**
     * Get the class schedules for the academic program.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function classSchedules()
    {
        return $this->hasMany(ClassSchedule::class, 'academicprogram_id');
    }
}
