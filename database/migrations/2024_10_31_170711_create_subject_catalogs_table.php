<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSubjectCatalogsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('subject_catalogs', function (Blueprint $table) {
            $table->id();
            $table->string('subject_code', 10);
            $table->string('subject_name', 50);
            $table->integer('credit_units');
            $table->string('subject_catalog', 255);
            $table->text('subject_description');
            $table->enum('status', ['active', 'inactive']);
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
        Schema::dropIfExists('subject_catalogs');
    }
}
