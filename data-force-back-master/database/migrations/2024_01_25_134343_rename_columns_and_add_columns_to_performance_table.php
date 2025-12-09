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

            $table->integer('delivered')->nullable();
            $table->integer('week')->nullable();
            $table->integer('year')->nullable();
            $table->string('key_focus_area')->nullable();
            $table->float('ced')->nullable();
            $table->float('dsb')->nullable();
            $table->float('swc_pod')->nullable();
            $table->float('swc_cc')->nullable();
            $table->float('swc_ad')->nullable();
            $table->float('dsb_dnr')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('performance', function (Blueprint $table) {
            $table->float('overall_tier')->nullable()->change();

            $table->dropColumn('delivered');
            $table->dropColumn('week');
            $table->dropColumn('year');
            $table->dropColumn('key_focus_area');
            $table->dropColumn('ced');
            $table->dropColumn('dsb');
            $table->dropColumn('swc_pod');
            $table->dropColumn('swc_cc');
            $table->dropColumn('swc_ad');
            $table->dropColumn('dsb_dnr');
        });
    }
};
