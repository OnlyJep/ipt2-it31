<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AcademicYear extends Model
{
    use HasFactory, SoftDeletes;


    protected $guarded = [];


    public function floor()
    {
        return $this->belongsTo(Floor::class, 'floor_id');
    }


    public function classrooms()
    {
        return $this->hasMany(Classroom::class, 'classroom_id');
    }
}
