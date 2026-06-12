<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Marca de la ultima sincronizacion del periodo actual de horas. Se usa para
     * el throttle: al cargar lista/calendario/perfil solo se consulta ADP si pasaron
     * mas de N minutos desde esta marca (evita saturar la API).
     */
    public function up(): void
    {
        Schema::table('adp_connections', function (Blueprint $table) {
            $table->timestamp('time_cards_synced_at')->nullable()->after('token_expires_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('adp_connections', function (Blueprint $table) {
            $table->dropColumn('time_cards_synced_at');
        });
    }
};
