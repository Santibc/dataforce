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
        Schema::table('coachings', function (Blueprint $table) {
            $table->longText('content')->change();
            $table->string('type')->default('coach');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('coachings', function (Blueprint $table) {
            $table->string('content')->change();
            $table->dropColumn('type');
        });
    }
};
