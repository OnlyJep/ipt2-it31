<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubjectCategory extends Model
{
    use HasFactory;

    /**
     * Get the subjects for the subject category.
     */
    public function subjects()
    {
        return $this->hasMany(Subject::class);
    }
}