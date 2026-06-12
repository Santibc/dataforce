<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Limite de horas semanales (domingo-sabado) a partir del cual el driver entra
     * en overtime. Configurable por compania. El aviso naranja se calcula como
     * (limite - 10). Default 40.
     */
    public function up(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->unsignedInteger('overtime_threshold')->default(40)->after('payroll');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            $table->dropColumn('overtime_threshold');
        });
    }
};
