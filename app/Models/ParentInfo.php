<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ParentInfo extends Model
{
    use HasFactory;

        /**
     * Get the profile associated with the parent info.
     */
    public function profile()
    {
        return $this->hasOne(Profile::class);
    }
}
