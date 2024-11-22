<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AcademicYear extends Model
{
    use HasFactory;

        /**
     * Get the semester academic years for the academic year.
     */
    public function semesterAcademicYears()
    {
        return $this->hasMany(SemesterAcademicYear::class);
    }
}
