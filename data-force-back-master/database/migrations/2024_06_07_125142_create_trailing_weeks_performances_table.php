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
        Schema::create('trailing_weeks_performances', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('driver_amazon_id')->index();
            $table->foreign('driver_amazon_id')
                ->references('driver_amazon_id')
                ->on('users')
                ->onDelete('cascade');
            $table->integer('year');
            $table->integer('week');

            $table->string('fico_score')->nullable();
            $table->string('seatbelt_off_rate')->nullable();
            $table->string('speeding_event_ratio')->nullable();
            $table->string('distraction_rate')->nullable();
            $table->string('following_distance_rate')->nullable();
            $table->string('signal_violations_rate')->nullable();

            $table->string('cdf')->nullable();
            $table->string('dcr')->nullable();
            $table->string('dsb')->nullable();
            $table->string('swc_pod')->nullable();
            $table->string('swc_cc')->nullable();
            $table->string('swc_ad')->nullable();

            $table->string('performer_status')->nullable();

            $table->integer('weeks_fantastic');
            $table->integer('weeks_great');
            $table->integer('weeks_fair');
            $table->integer('weeks_poor');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trailing_weeks_performance');
    }
};
