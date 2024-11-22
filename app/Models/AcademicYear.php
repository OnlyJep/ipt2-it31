<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AcademicYear extends Model
{
    use HasFactory;

    /**
     * Get the enlistments for the academic year.
     */
    public function enlistments()
    {
        return $this->hasMany(Enlistment::class);
    }
    
}
