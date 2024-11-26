<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Semester extends Model
{
    use HasFactory, SoftDeletes;

    protected $guarded = [];
    protected $table = 'semester';
    
    public function semesterAcademicYears()
    {
        return $this->hasMany(SemesterAcademicYear::class, 'semeacadyear_id');
    }
}
