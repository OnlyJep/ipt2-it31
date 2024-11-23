<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CollegeProgram extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['college_programs', 'study_type'];

    /**
     * Get the classified sections for the college program.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function classifiedSections()
    {
        return $this->hasMany(ClassifiedSection::class);
    }

    /**
     * Get the academic programs for the college program.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function academicPrograms()
    {
        return $this->hasMany(AcademicProgram::class);
    }
}
