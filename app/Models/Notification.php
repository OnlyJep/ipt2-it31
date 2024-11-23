<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'event_id',
        'announcement_id',
        'enrollmenttracking_id',
        'assignmenttracking_id',
        'profile_id',
    ];

    /**
     * Get the event that owns the notification.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function event()
    {
        return $this->belongsTo(Event::class, 'event_id');
    }

    /**
     * Get the announcement that owns the notification.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function announcement()
    {
        return $this->belongsTo(Announcement::class, 'announcement_id');
    }

    /**
     * Get the enrollment tracking that owns the notification.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function enrollmentTracking()
    {
        return $this->belongsTo(EnrollmentTracking::class, 'enrollmenttracking_id');
    }

    /**
     * Get the assignment tracking that owns the notification.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function assignmentTracking()
    {
        return $this->belongsTo(AssignmentTracking::class, 'assignmenttracking_id');
    }

    /**
     * Get the profile that owns the notification.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function profile()
    {
        return $this->belongsTo(Profile::class, 'profile_id');
    }
}
