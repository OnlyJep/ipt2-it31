<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    use HasFactory;

    /**
     * Get the subject category that owns the subject.
     */
    public function subjectCategory()
    {
        return $this->belongsTo(SubjectCategory::class);
    }

       /**
     * Get the subject curriculums for the subject.
     */
    public function subjectCurriculums()
    {
        return $this->hasMany(SubjectCurriculum::class);
    }

}