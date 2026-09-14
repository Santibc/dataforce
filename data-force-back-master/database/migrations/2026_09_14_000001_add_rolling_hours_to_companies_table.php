<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Tercera alerta de horas: ventana MOVIL que cuenta siempre desde hoy hacia
     * atras (a diferencia del limite semanal, que se reinicia cada domingo). Se
     * configuran los dias de la ventana y el tope de horas; el aviso previo NO se
     * configura, se deriva como un 15% por debajo del tope. Defaults 7 dias y 60 h.
     */
    public function up(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->unsignedInteger('rolling_hours_days')->default(7)->after('daily_hours_warning');
            $table->unsignedInteger('rolling_hours_limit')->default(60)->after('rolling_hours_days');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->dropColumn(['rolling_hours_days', 'rolling_hours_limit']);
        });
    }
};
