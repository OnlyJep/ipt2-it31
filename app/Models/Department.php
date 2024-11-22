<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    use HasFactory;

    /**
     * Get the academic programs for the department.
     */
    public function academicPrograms()
    {
        return $this->hasMany(AcademicProgram::class);
    }
}
