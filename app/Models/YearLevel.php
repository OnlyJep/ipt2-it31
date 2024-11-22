<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class YearLevel extends Model
{
    use HasFactory;

    /**
     * Get the classified sections for the year level.
     */
    public function classifiedSections()
    {
        return $this->hasMany(ClassifiedSection::class);
    }

        /**
     * Get the academic program that owns the profile.
     */
    public function academicProgram()
    {
        return $this->belongsTo(AcademicProgram::class);
    }
}