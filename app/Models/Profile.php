<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Profile extends Model
{
    use HasFactory, SoftDeletes;


    protected $guarded = [];


    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function college_program_department()
    {
        return $this->belongsTo(CollegeProgramDepartment::class, 'program_department_id');
    }


    public function yearLevel()
    {
        return $this->belongsTo(YearLevel::class, 'yearlevel_id');
    }

    public function parentInfo()
    {
        return $this->belongsTo(ParentInfo::class, 'parent_info_id');
    }


    public function department()
    {
        return $this->belongsTo(Department::class, 'department_id');
    }


    public function classSchedules()
    {
        return $this->hasMany(ClassSchedule::class, 'classschedules_id');
    }


    public function enlistments()
    {
        return $this->hasMany(Enlistment::class, 'enlistment_id');
    }


    public function notifications()
    {
        return $this->hasMany(Notification::class, 'notification_id');
    }
}