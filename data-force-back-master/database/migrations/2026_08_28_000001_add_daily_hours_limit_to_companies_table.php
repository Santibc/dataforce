<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Limite de horas de UN dia a partir del cual el driver no deberia seguir
     * trabajando, y aviso previo. A diferencia del limite semanal (donde el aviso
     * es limite - 10), aqui los dos valores se configuran por separado.
     * Defaults 12 y 10.
     */
    public function up(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->unsignedInteger('daily_hours_limit')->default(12)->after('overtime_threshold');
            $table->unsignedInteger('daily_hours_warning')->default(10)->after('daily_hours_limit');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->dropColumn(['daily_hours_limit', 'daily_hours_warning']);
        });
    }
};
