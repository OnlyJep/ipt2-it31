<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Classroom extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['room_type', 'roomtag_id', 'building_id', 'floor_id'];

    /**
     * Get the building that owns the classroom.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function building()
    {
        return $this->belongsTo(Building::class);
    }

    /**
     * Get the floor that owns the classroom.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function floor()
    {
        return $this->belongsTo(Floor::class);
    }

    /**
     * Get the room tag that owns the classroom.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function roomTag()
    {
        return $this->belongsTo(RoomTag::class);
    }

    /**
     * Get the classroom schedulings for the classroom.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function classroomSchedulings()
    {
        return $this->hasMany(ClassroomScheduling::class);
    }
}
