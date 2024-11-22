<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Building extends Model
{
    use HasFactory;

    /**
     * Get the floor that owns the building.
     */
    public function floor()
    {
        return $this->belongsTo(Floor::class);
    }

    /**
     * Get the classrooms for the building.
     */
    public function classrooms()
    {
        return $this->hasMany(Classroom::class);
    }
}