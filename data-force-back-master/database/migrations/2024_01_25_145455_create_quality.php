<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('qualitys', function (Blueprint $table) {
            $table->id();
            $table->timestamps();

            $table->string('value')->nullable();
            $table->string('customer_delivery_experience')->nullable();
            $table->string('customer_escalation_defect')->nullable();
            $table->string('customer_delivery_feedback')->nullable();
            $table->string('delivery_completion_rate')->nullable();
            $table->string('delivered_and_received')->nullable();
            $table->string('standard_work_compliance')->nullable();
            $table->string('photo_on_delivery')->nullable();
            $table->string('contact_compliance')->nullable();
            $table->string('attended_delivery_accuracy')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('qualitys');
    }
};
