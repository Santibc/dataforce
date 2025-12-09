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
        Schema::table('companies', function (Blueprint $table) {
            $table->string( 'address');
            $table->integer('driver_amount');
            $table->integer('fleat_size');
            $table->string( 'payroll');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->dropColumn('address');
            $table->dropColumn('driver_amount');
            $table->dropColumn('fleat_size');
            $table->dropColumn('payroll');
        });
    }
};
