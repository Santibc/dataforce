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
        Schema::table('jobsites', function (Blueprint $table) {
            $table->renameColumn('address', 'address_street');
            $table->integer('address_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('jobsites', function (Blueprint $table) {
            $table->renameColumn('address_street', 'address');
            $table->dropColumn('address_number');
        });
    }
};
