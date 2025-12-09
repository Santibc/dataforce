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
        Schema::create('performance', function (Blueprint $table) {
            $table->id();
            $table->float('fico_score')->nullable();
            $table->float('seatbelt_off_rate')->nullable();
            $table->float('speeding_event_ratio')->nullable();
            $table->float('distraction_rate')->nullable();
            $table->float('following_distance_rate')->nullable();
            $table->float('signal_violations_rate')->nullable();
            $table->float('cdf')->nullable();
            $table->float('dcr')->nullable();
            $table->float('pod')->nullable();
            $table->float('cc')->nullable();

            $table->unsignedBigInteger('driver_amazon_id')->nullable();
            $table->foreign('driver_amazon_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('performance');
    }
};
