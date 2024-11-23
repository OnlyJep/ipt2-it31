<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Building extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['building_name', 'floor_id'];

    /**
     * Get the classrooms for the building.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function classrooms()
    {
        return $this->hasMany(Classroom::class);
    }

    /**
     * Get the floor that this building references (maximum floor).
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function floor()
    {
        return $this->belongsTo(Floor::class);
    }
}
