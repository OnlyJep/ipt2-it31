<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'middle_initial',
        'suffix',
        'age',
        'address',
        'section',
        'school_email',
        'sex',
        'phone_number',
        'admission_date',
        'marital_status',
        'religion',
        'photo_path',
        'emer_full_name',
        'relationship',
        'contact_no',
        'date_of_birth',
        'user_id',
        'academicprogram_id',
        'yearlevel_id',
        'parent_info_id',
        'department_id',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'admission_date' => 'date',
        'date_of_birth' => 'date',
    ];

    /**
     * Get the user that owns the profile.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the academic program that owns the profile.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function academicProgram()
    {
        return $this->belongsTo(AcademicProgram::class, 'academicprogram_id');
    }

    /**
     * Get the year level that owns the profile.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function yearLevel()
    {
        return $this->belongsTo(YearLevel::class, 'yearlevel_id');
    }

    /**
     * Get the parent info that owns the profile.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function parentInfo()
    {
        return $this->belongsTo(ParentInfo::class, 'parent_info_id');
    }

    /**
     * Get the department that owns the profile.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function department()
    {
        return $this->belongsTo(Department::class, 'department_id');
    }

    /**
     * Get the class schedules for the profile.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function classSchedules()
    {
        return $this->hasMany(ClassSchedule::class);
    }

    /**
     * Get the enlistments for the profile.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function enlistments()
    {
        return $this->hasMany(Enlistment::class);
    }

    /**
     * Get the notifications for the profile.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }
}
