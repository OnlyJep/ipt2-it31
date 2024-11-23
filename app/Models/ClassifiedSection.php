<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClassifiedSection extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['section_id', 'collegeprogram_id', 'yearlevel_id'];

    /**
     * Get the section that owns the classified section.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function section()
    {
        return $this->belongsTo(Section::class, 'section_id');
    }

    /**
     * Get the year level that owns the classified section.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function yearLevel()
    {
        return $this->belongsTo(YearLevel::class, 'yearlevel_id');
    }

    /**
     * Get the college program that owns the classified section.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function collegeProgram()
    {
        return $this->belongsTo(CollegeProgram::class, 'collegeprogram_id');
    }

    /**
     * Get the class schedules for the classified section.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function classSchedules()
    {
        return $this->hasMany(ClassSchedule::class, 'classifiedsection_id');
    }
}
