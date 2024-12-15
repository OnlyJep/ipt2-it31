<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ChangeTypeStatusInUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            // Drop foreign key constraint
            $table->dropForeign(['role_id']);

            $table->string('status')->default('Active')->nullable()->change();
            $table->string('username')->nullable()->change();
            $table->string('password')->nullable()->change();
            $table->unsignedBigInteger('role_id')->nullable()->change(); // Ensure role_id is unsignedBigInteger

            // Foreign key constraint
            $table->foreign('role_id')->references('id')->on('roles')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('status')->default('Active')->nullable(false)->change();
            $table->string('username')->nullable(false)->change();
            $table->string('password')->nullable(false)->change();
            $table->bigInteger('role_id')->nullable(false)->change(); // Revert role_id to original type

            // Drop foreign key constraint
            $table->dropForeign(['role_id']);
        });
    }
}
