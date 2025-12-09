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
        Schema::table('performance', function (Blueprint $table) {
            $table->string('overall_tier')->nullable()->change();
            $table->string('fico_score')->nullable()->change();
            $table->string('seatbelt_off_rate')->nullable()->change();
            $table->string('speeding_event_ratio')->nullable()->change();
            $table->string('distraction_rate')->nullable()->change();
            $table->string('following_distance_rate')->nullable()->change();
            $table->string('signal_violations_rate')->nullable()->change();
            $table->string('cdf')->nullable()->change();
            $table->string('dcr')->nullable()->change();
            $table->string('pod')->nullable()->change();
            $table->string('cc')->nullable()->change();
            $table->string('delivered')->nullable()->change();
            $table->string('ced')->nullable()->change();
            $table->string('dsb')->nullable()->change();
            $table->string('swc_pod')->nullable()->change();
            $table->string('swc_cc')->nullable()->change();
            $table->string('swc_ad')->nullable()->change();
            $table->string('dsb_dnr')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('performance', function (Blueprint $table) {
            $table->float('overall_tier')->nullable()->change();
            $table->float('fico_score')->nullable()->change();
            $table->float('seatbelt_off_rate')->nullable()->change();
            $table->float('speeding_event_ratio')->nullable()->change();
            $table->float('distraction_rate')->nullable()->change();
            $table->float('following_distance_rate')->nullable()->change();
            $table->float('signal_violations_rate')->nullable()->change();
            $table->float('cdf')->nullable()->change();
            $table->float('dcr')->nullable()->change();
            $table->float('pod')->nullable()->change();
            $table->float('cc')->nullable()->change();
            $table->float('delivered')->nullable()->change();
            $table->float('ced')->nullable()->change();
            $table->float('dsb')->nullable()->change();
            $table->float('swc_pod')->nullable()->change();
            $table->float('swc_cc')->nullable()->change();
            $table->float('swc_ad')->nullable()->change();
            $table->float('dsb_dnr')->nullable()->change();
        });
    }
};
