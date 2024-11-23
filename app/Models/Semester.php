<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Semester extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['semester_period'];

    /**
     * Get the semester academic years for the semester.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function semesterAcademicYears()
    {
        return $this->hasMany(SemesterAcademicYear::class, 'semester_id');
    }
}
