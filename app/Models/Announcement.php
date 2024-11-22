<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
    use HasFactory;

        /**
     * Get the event that owns the notification.
     */
    public function event()
    {
        return $this->belongsTo(Event::class);
    }

}
