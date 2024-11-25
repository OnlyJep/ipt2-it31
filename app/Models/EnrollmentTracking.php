<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AcademicProgram extends Model
{
    use HasFactory, SoftDeletes;

    protected $guarded = [];


    public function enlistment()
    {
        return $this->belongsTo(Enlistment::class, 'enlistment_id');
    }
}
