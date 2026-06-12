<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Marca de la ultima vez que se trajo el HISTORICO de horas de este driver desde
     * ADP. Se usa para throttle: el historico viejo no cambia, asi que no se re-consulta
     * en cada carga del perfil (solo cada cierto tiempo).
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->timestamp('adp_history_synced_at')->nullable()->after('adp_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('adp_history_synced_at');
        });
    }
};
