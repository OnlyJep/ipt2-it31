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
            $table->id(); // Add id column
            $table->string('first_name', 50)->nullable(); // Add first_name column, nullable
            $table->string('last_name', 100)->nullable(); // Add last_name column, nullable
            $table->string('middle_initial', 20)->nullable(); // Add middle_initial column, nullable
            $table->string('suffix', 20)->nullable(); // Add suffix column, nullable
            $table->integer('age')->nullable(); // Add age column, nullable
            $table->text('address')->nullable(); // Add address column, nullable
            $table->string('section', 20)->nullable(); // Add section column, nullable
            $table->string('school_email', 50)->nullable(); // Add school_email column, nullable
            $table->string('sex', 20)->nullable(); // Add sex column, nullable
            $table->string('phone_number', 20)->nullable(); // Add phone_number column, nullable
            $table->date('admission_date')->nullable(); // Add admission_date column, nullable
            $table->enum('marital_status', ['single', 'married', 'divorced', 'widowed'])->nullable(); // Add marital_status column, nullable
            $table->enum('religion', ['catholic', 'muslim', 'protestant', 'hindu', 'buddhist', 'other'])->nullable(); // Add religion column, nullable
            $table->text('photo_path')->nullable(); // Add photo_path column, nullable
            $table->string('emer_full_name', 100)->nullable(); // Add emer_full_name column, nullable
            $table->string('relationship', 50)->nullable(); // Add relationship column, nullable
            $table->string('contact_no', 20)->nullable(); // Add contact_no column, nullable
            $table->timestamp('date_of_birth')->nullable(); // Add date_of_birth column, nullable
            $table->timestamps(); // Add created_at and updated_at columns

            // Foreign key attributes
            $table->unsignedBigInteger('user_id')->nullable(); // Add user_id column, nullable
            $table->unsignedBigInteger('academicprogram_id')->nullable(); // Add academicprogram_id column, nullable
            $table->unsignedBigInteger('yearlevel_id')->nullable(); // Add yearlevel_id column, nullable
            $table->unsignedBigInteger('parent_info_id')->nullable(); // Add parent_info_id column, nullable

            // Foreign key constraints
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null'); // Add foreign key constraint for user_id
            $table->foreign('academicprogram_id')->references('id')->on('academic_programs')->onDelete('set null'); // Add foreign key constraint for academicprogram_id
            $table->foreign('yearlevel_id')->references('id')->on('year_levels')->onDelete('set null'); // Add foreign key constraint for yearlevel_id
            $table->foreign('parent_info_id')->references('id')->on('parent_infos')->onDelete('set null'); // Add foreign key constraint for parent_info_id
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
