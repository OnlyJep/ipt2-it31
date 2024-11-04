<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSubjectAvailabilityTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('subject_availability', function (Blueprint $table) {
            $table->id();
            $table->enum('term', ['1st Semester', '2nd Semester', 'Summer']);
            $table->string('schedule', 100);
            $table->integer('max_enrollees');
            $table->string('room', 50);
            $table->boolean('is_open');
            $table->timestamps();
            $table->unsignedBigInteger('subject_id'); // Corrected column name

            // Foreign key constraint
            $table->foreign('subject_id')->references('id')->on('subject_catalogs')->onDelete('cascade');
            $table->index('subject_id'); // Define index after defining the column
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('subject_availability');
    }
}
