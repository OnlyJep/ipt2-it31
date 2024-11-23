<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Floor extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['floor_level'];

    /**
     * Get the buildings for the floor.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function buildings()
    {
        return $this->hasMany(Building::class);
    }

    /**
     * Get the classrooms for the floor.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function classrooms()
    {
        return $this->hasMany(Classroom::class);
    }
}
