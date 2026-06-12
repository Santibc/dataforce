<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Los drivers traidos desde ADP no tienen "amazon driver id" (ese ID lo asigna
     * Amazon, no ADP); el admin lo completa despues en la pantalla de revision.
     * Por eso driver_amazon_id debe poder ser NULL al crear un driver desde ADP.
     * (La migracion original ya lo declaraba nullable, pero el esquema real quedo NOT NULL.)
     */
    public function up(): void
    {
        DB::statement('ALTER TABLE `users` MODIFY `driver_amazon_id` VARCHAR(255) NULL');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('ALTER TABLE `users` MODIFY `driver_amazon_id` VARCHAR(255) NOT NULL');
    }
};
