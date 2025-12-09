<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('performance', function (Blueprint $table) {
            $table->string('serial_number')->nullable();
            $table->string('psb')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('performance', function (Blueprint $table) {
            $table->dropColumn('serial_number');
            $table->dropColumn('psb');
        });
    }
};
