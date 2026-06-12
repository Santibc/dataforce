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
        Schema::table('users', function (Blueprint $table) {
            // associateOID de ADP: identificador canonico, inmutable y unico en todo ADP.
            // Es la clave estable para relacionar un driver con su trabajador en ADP.
            $table->string('adp_aoid')->nullable()->unique()->after('driver_amazon_id');
            // workerID/Employee ID de ADP: informativo (unico solo dentro del cliente, puede reutilizarse).
            $table->string('adp_worker_id')->nullable()->after('adp_aoid');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropUnique(['adp_aoid']);
            $table->dropColumn(['adp_aoid', 'adp_worker_id']);
        });
    }
};
