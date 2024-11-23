<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RoomTag extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['room_tag', 'room_tag_type'];

    /**
     * Get the classrooms for the room tag.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function classrooms()
    {
        return $this->hasMany(Classroom::class);
    }
}
