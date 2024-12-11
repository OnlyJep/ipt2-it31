<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Building extends Model
{
    use HasFactory, SoftDeletes;


    protected $table = 'buildings';

    protected $fillable = [
        'building_name',
        'floor_id',
    ];

    public function floor()
    {
        return $this->belongsTo(Floor::class, 'floor_id');
    }


    public function classrooms()
    {
        return $this->hasMany(Classroom::class, 'classroom_id');
    }
}
