<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProfilesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('profiles', function (Blueprint $table) {
            $table->id();
            $table->string('last_name', 50);
            $table->string('first_name', 100);
            $table->string('middle_initial', 20)->nullable();
            $table->string('phone_number', 15);
            $table->text('address');
            $table->date('date_of_birth');
            $table->integer('year_level');
            $table->unsignedBigInteger('department_id');
            $table->unsignedBigInteger('user_id');
            $table->text('photo');

            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade'); // Correct foreign key column name
            $table->index('user_id'); // Define index after defining the column

            $table->foreign('department_id')->references('id')->on('departments')->onDelete('cascade'); // Correct foreign key column name
            $table->index('department_id'); // Define index after defining the column

            $table->unsignedBigInteger('room_schedule_id');
            $table->foreign('room_schedule_id')->references('id')->on('room_schedules')->onDelete('cascade');
            $table->index('room_schedule_id'); 
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('profiles');
    }
}
