<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AssignmentTracking extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'classschedule_id',
        'enlistment_id',
    ];

    /**
     * Get the class schedule that owns the assignment tracking.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function classSchedule()
    {
        return $this->belongsTo(ClassSchedule::class, 'classschedule_id');
    }

    /**
     * Get the enlistment that owns the assignment tracking.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function enlistment()
    {
        return $this->belongsTo(Enlistment::class, 'enlistment_id');
    }
}
