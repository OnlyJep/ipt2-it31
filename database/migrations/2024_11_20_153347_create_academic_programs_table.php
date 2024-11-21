<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAcademicProgramsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('academic_programs', function (Blueprint $table) {
            $table->id(); // Add id column
            $table->unsignedBigInteger('collegeprogram_id'); // Add collegeprogram_id column
            $table->unsignedBigInteger('department_id'); // Add department_id column
            $table->unsignedBigInteger('subjectcurriculum_id'); // Add subjectcurriculum_id column
            $table->timestamps(); // Add created_at and updated_at columns

            // Foreign key constraints
            $table->foreign('collegeprogram_id')->references('id')->on('college_programs')->onDelete('cascade'); // Add foreign key constraint for collegeprogram_id
            $table->foreign('department_id')->references('id')->on('departments')->onDelete('cascade'); // Add foreign key constraint for department_id
            $table->foreign('subjectcurriculum_id')->references('id')->on('subject_curriculums')->onDelete('cascade'); // Add foreign key constraint for subjectcurriculum_id
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('academic_programs');
    }
}