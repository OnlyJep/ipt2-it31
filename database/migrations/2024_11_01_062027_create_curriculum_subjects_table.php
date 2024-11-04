<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCurriculumSubjectsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('curriculum_subjects', function (Blueprint $table) {
            $table->enum('semester', ['1', '2', 'Summer']);
            $table->integer('year_level');
            $table->boolean('is_prerequisite');

            $table->unsignedBigInteger('curriculum_id');
            $table->foreign('curriculum_id')->references('id')->on('curriculums')->onDelete('cascade');
            $table->index('curriculum_id');

            $table->unsignedBigInteger('subject_id');
            $table->foreign('subject_id')->references('id')->on('subject_catalogs')->onDelete('cascade');
            $table->index('subject_id');


        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('curriculum_subjects');
    }
}
