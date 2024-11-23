<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ParentInfo extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'father_first_name',
        'father_last_name',
        'father_middle_initial',
        'father_suffix',
        'father_occupation',
        'father_address',
        'father_contact_no',
        'mother_first_name',
        'mother_last_name',
        'mother_middle_initial',
        'mother_occupation',
        'mother_address',
        'mother_contact_no',
    ];

    /**
     * Get the profile associated with the parent info.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function profile()
    {
        return $this->hasOne(Profile::class, 'parent_info_id');
    }
}
