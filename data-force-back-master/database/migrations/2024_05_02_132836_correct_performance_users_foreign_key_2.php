<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('performance', function (Blueprint $table): void {
            $table->string('driver_amazon_id')->change();
        });
    }

    public function down(): void
    {
        Schema::table('performance', function (Blueprint $table): void {
            $table->string('driver_amazon_id')->change();
        });
    }
};
