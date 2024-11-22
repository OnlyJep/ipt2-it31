<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Enlistment extends Model
{
    use HasFactory;

    /**
     * Get the profile that owns the enlistment.
     */
    public function profile()
    {
        return $this->belongsTo(Profile::class);
    }
    
}
