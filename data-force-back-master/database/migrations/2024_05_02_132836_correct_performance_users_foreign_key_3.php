<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('performance', function (Blueprint $table): void {
            $table->foreign('driver_amazon_id')
                ->references('driver_amazon_id')
                ->on('users')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('performance', function (Blueprint $table): void {
            $table->dropForeign(['driver_amazon_id']);
        });
    }
};
