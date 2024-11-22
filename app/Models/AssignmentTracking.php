<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AssignmentTracking extends Model
{
    use HasFactory;

    /**
     * Get the class schedule that owns the assignment tracking.
     */
    public function classSchedule()
    {
        return $this->belongsTo(ClassSchedule::class);
    }
    
    /**
     * Get the enlistment that owns the assignment tracking.
     */
    public function enlistment()
    {
        return $this->belongsTo(Enlistment::class);
    }


    
}
