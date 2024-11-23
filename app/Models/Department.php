<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['department_name'];

    /**
     * Get the academic programs for the department.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function academicPrograms()
    {
        return $this->hasMany(AcademicProgram::class);
    }

    /**
     * Get the profiles for the department.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function profiles()
    {
        return $this->hasMany(Profile::class);
    }
}
