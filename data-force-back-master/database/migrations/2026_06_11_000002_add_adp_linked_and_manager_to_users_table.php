<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * adp_linked: bandera explicita de "vinculado con ADP" (true cuando el driver
     * tiene su associateOID asignado). adp_manager_aoid: AOID del manager (reportsTo),
     * usado para traer las horas del equipo por lote via team-time-cards.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('adp_linked')->default(false)->after('adp_worker_id');
            $table->string('adp_manager_aoid')->nullable()->after('adp_linked');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['adp_linked', 'adp_manager_aoid']);
        });
    }
};
