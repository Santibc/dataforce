<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * El AOID de ADP identifica a un trabajador dentro de una cuenta de ADP, y una
     * misma cuenta puede estar compartida por varias companias de BosMetrics (p. ej.
     * RGM Logistics y Galo Logistics usan las mismas credenciales). Con el indice
     * unico GLOBAL, vincular al mismo trabajador en la segunda compania fallaba con
     * "Duplicate entry ... for key users_adp_aoid_unique". La unicidad correcta es
     * por compania: un AOID no puede repetirse dentro de la misma empresa.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropUnique('users_adp_aoid_unique');
            $table->unique(['company_id', 'adp_aoid'], 'users_company_adp_aoid_unique');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropUnique('users_company_adp_aoid_unique');
            $table->unique('adp_aoid', 'users_adp_aoid_unique');
        });
    }
};
