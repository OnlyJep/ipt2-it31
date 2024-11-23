<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EnrollmentTracking extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'enlistment_id',
    ];

    /**
     * Get the enlistment that owns the enrollment tracking.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function enlistment()
    {
        return $this->belongsTo(Enlistment::class, 'enlistment_id');
    }
}
