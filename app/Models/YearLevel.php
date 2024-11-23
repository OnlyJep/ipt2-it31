<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class YearLevel extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['year_level'];

    /**
     * Get the profiles for the year level.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function profiles()
    {
        return $this->hasMany(Profile::class, 'yearlevel_id');
    }

    /**
     * Get the classified sections for the year level.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function classifiedSections()
    {
        return $this->hasMany(ClassifiedSection::class);
    }
}
