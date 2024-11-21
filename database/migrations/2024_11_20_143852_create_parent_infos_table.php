<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateParentInfosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('parent_infos', function (Blueprint $table) {
            $table->id();
            $table->string('father_first_name', 100); // Add father_first_name column
            $table->string('father_last_name', 50); // Add father_last_name column
            $table->string('father_middle_initial', 20); // Add father_middle_initial column
            $table->string('father_suffix', 20); // Add father_suffix column
            $table->string('father_occupation', 50); // Add father_occupation column
            $table->text('father_address'); // Add father_address column
            $table->string('father_contact_no', 20); // Add father_contact_no column
            $table->string('mother_first_name', 100); // Add mother_first_name column
            $table->string('mother_last_name', 50); // Add mother_last_name column
            $table->string('mother_middle_initial', 20); // Add mother_middle_initial column
            $table->string('mother_occupation', 50); // Add mother_occupation column
            $table->text('mother_address'); // Add mother_address column
            $table->string('mother_contact_no', 50); // Add mother_contact_no column
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('parent_infos');
    }
}