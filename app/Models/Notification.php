<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

        /**
     * Get the event that owns the notification.
     */
    public function event()
    {
        return $this->belongsTo(Event::class);
    }

        /**
     * Get the profile that owns the notification.
     */
    public function profile()
    {
        return $this->belongsTo(Profile::class);
    }
}
