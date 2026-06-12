<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Staging de la pantalla de revision: guarda el resultado de comparar los
     * trabajadores de ADP con los drivers existentes, para que el admin revise
     * y confirme sin tener que volver a llamar a la API de ADP, y para que el
     * cron deje pendientes los nuevos sin crearlos automaticamente.
     */
    public function up(): void
    {
        Schema::create('adp_sync_candidates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained('companies')->cascadeOnDelete();
            $table->string('adp_aoid');

            // Datos normalizados del worker de ADP (nombre, emails, phone, jobTitle, etc.).
            $table->json('payload');

            // Coincidencias encontradas con la logica OR: [{user_id, match_type}].
            // match_type ∈ aoid|email|phone|name|amazon_id. Soporta varios candidatos (ambiguo).
            $table->json('possible_matches')->nullable();

            // matched (1 coincidencia), ambiguous (>1), new (0).
            $table->string('classification')->default('new');

            // pending | linked | created | ignored.
            $table->string('status')->default('pending');

            // User que el admin eligio vincular/creo al confirmar.
            $table->foreignId('resolved_user_id')->nullable()->constrained('users')->nullOnDelete();

            $table->timestamps();

            $table->unique(['company_id', 'adp_aoid']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('adp_sync_candidates');
    }
};
