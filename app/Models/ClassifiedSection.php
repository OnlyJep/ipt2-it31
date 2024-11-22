<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClassifiedSection extends Model
{
    use HasFactory;

    /**
     * Get the section that owns the classified section.
     */
    public function section()
    {
        return $this->belongsTo(Section::class);
    }

    public function yearLevel()
    {
        return $this->belongsTo(YearLevel::class);
    }

     /**
     * Get the college program that owns the classified section.
     */
    public function collegeProgram()
    {
        return $this->belongsTo(CollegeProgram::class);
    }
}

