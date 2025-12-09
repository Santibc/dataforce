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
        Schema::table('safetys_and_compliances', function (Blueprint $table) {
            $table->integer('week')->nullable();
            $table->integer('year')->nullable();
        });

        Schema::table('qualitys', function (Blueprint $table) {
            $table->integer('week')->nullable();
            $table->integer('year')->nullable();
        });

        Schema::table('teams', function (Blueprint $table) {
            $table->integer('week')->nullable();
            $table->integer('year')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('safetys_and_compliances', function (Blueprint $table) {
            $table->dropColumn('week');
            $table->dropColumn('year');
        });

        Schema::table('qualitys', function (Blueprint $table) {
            $table->dropColumn('week');
            $table->dropColumn('year');
        });

        Schema::table('teams', function (Blueprint $table) {
            $table->dropColumn('week');
            $table->dropColumn('year');
        });
    }
};
