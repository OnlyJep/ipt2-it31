<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubjectCurriculum extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['subject_id', 'curriculum_id'];

    /**
     * Get the curriculum that owns the subject curriculum.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function curriculum()
    {
        return $this->belongsTo(Curriculum::class, 'curriculum_id');
    }

    /**
     * Get the subject that owns the subject curriculum.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function subject()
    {
        return $this->belongsTo(Subject::class, 'subject_id');
    }

    /**
     * Get the academic programs for the subject curriculum.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function academicPrograms()
    {
        return $this->hasMany(AcademicProgram::class);
    }
}
