<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EnrollmentTracking extends Model
{
    use HasFactory;

        /**
     * Get the enlistment that owns the enrollment tracking.
     */
    public function enlistment()
    {
        return $this->belongsTo(Enlistment::class);
    }
}
