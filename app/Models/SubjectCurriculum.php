<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubjectCurriculum extends Model
{
    use HasFactory;


        /**
     * Get the curriculum that owns the subject curriculum.
     */
    public function curriculum()
    {
        return $this->belongsTo(Curriculum::class);
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

     /**
     * Get the academic programs for the subject curriculum.
     */
    public function academicPrograms()
    {
        return $this->hasMany(AcademicProgram::class);
    }
}
