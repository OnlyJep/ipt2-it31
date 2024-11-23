<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'subject_code',
        'subject_name',
        'classification',
        'units',
        'subject_description',
        'course_year',
        'availability',
        'subjectcategory_id',
    ];

    /**
     * Get the subject curriculums for the subject.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function subjectCurriculums()
    {
        return $this->hasMany(SubjectCurriculum::class, 'subject_id');
    }

        /**
     * Get the subject category that owns the subject.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function subjectCategory()
    {
        return $this->belongsTo(SubjectCategory::class, 'subjectcategory_id');
    }
}