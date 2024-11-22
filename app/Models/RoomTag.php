<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RoomTag extends Model
{
    use HasFactory;

    /**
     * Get the classrooms for the room tag.
     */
    public function classrooms()
    {
        return $this->hasMany(Classroom::class);
    }
}