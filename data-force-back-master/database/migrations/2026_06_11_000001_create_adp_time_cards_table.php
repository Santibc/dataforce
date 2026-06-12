<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Horas trabajadas traidas de ADP (Time & Attendance). Una fila por
     * (driver, periodo de pago); el detalle diario y los totales por pay code
     * se guardan en JSON. total_minutes guarda el total del periodo ya parseado
     * desde el formato ISO-8601 de ADP (p. ej. "PT8H30M").
     */
    public function up(): void
    {
        Schema::create('adp_time_cards', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('adp_aoid')->index();
            $table->string('time_card_id')->nullable();

            $table->string('period_code')->nullable();   // current | previous | next
            $table->date('period_start');
            $table->date('period_end');
            $table->string('period_status')->nullable();  // Open | Closed
            $table->string('processing_status')->nullable();

            $table->integer('total_minutes')->default(0);
            $table->json('period_totals')->nullable();     // [{pay_code, minutes}]
            $table->json('daily_totals')->nullable();      // [{date, pay_code, minutes}]
            $table->json('exceptions')->nullable();

            $table->timestamp('synced_at')->nullable();
            $table->timestamps();

            // Una time card por driver y periodo.
            $table->unique(['company_id', 'adp_aoid', 'period_start']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('adp_time_cards');
    }
};
