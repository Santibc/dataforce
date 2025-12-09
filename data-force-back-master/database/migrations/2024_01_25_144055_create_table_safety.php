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
        Schema::create('safetys_and_compliances', function (Blueprint $table) {
            $table->id();
            $table->timestamps();

            $table->string('value')->nullable();
            $table->string('on_road_safety_score')->nullable();
            $table->string('safe_driving_metric')->nullable();
            $table->string('seatbelt_off_rate')->nullable();
            $table->string('speeding_event_rate')->nullable();
            $table->string('sign_violations_rate')->nullable();
            $table->string('distractions_rate')->nullable();
            $table->string('following_distance_rate')->nullable();
            $table->string('breach_of_contract')->nullable();
            $table->string('comprehensive_audit')->nullable();
            $table->string('working_hour_compliance')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('safetys_and_compliances');
    }
};
