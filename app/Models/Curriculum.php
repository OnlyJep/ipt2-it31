<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Curriculum extends Model
{
    use HasFactory;

        /**
     * Get the subject curriculums for the curriculum.
     */
    public function subjectCurriculums()
    {
        return $this->hasMany(SubjectCurriculum::class);
    }
}
