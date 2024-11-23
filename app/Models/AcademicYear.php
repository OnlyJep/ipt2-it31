<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AcademicYear extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['academic_year'];

    /**
     * Get the semester academic years for the academic year.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function semesterAcademicYears()
    {
        return $this->hasMany(SemesterAcademicYear::class, 'academicyear_id');
    }
}
