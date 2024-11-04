<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CurriculumSubject extends Model
{
    use HasFactory;

    public function curriculums()
    {
        return $this->belongsTo(Curriculum::class);
    }

    public function subject_catalogs()
    {
        return $this->belongsTo(SubjectCatalog::class);
    }
}
