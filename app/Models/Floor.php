<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Floor extends Model
{
    use HasFactory;

    /**
     * Get the buildings for the floor.
     */
    public function buildings()
    {
        return $this->hasMany(Building::class);
    }

    /**
     * Get the classrooms for the floor.
     */
    public function classrooms()
    {
        return $this->hasMany(Classroom::class);
    }
}