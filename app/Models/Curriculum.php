<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Curriculum extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'objective',
        'curriculum_type',
        'resources',
        'prerequisite',
        'assessment',
        'method',
        'content',
        'number_of_hours',
    ];

    /**
     * Get the subject curriculums for the curriculum.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function subjectCurriculums()
    {
        return $this->hasMany(SubjectCurriculum::class, 'curriculum_id');
    }
}
