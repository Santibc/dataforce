<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('chat_messages', function (Blueprint $table) {
            $table->text('body')->nullable()->change();
        });
    }

    public function down(): void
    {
        DB::table('chat_messages')->whereNull('body')->update(['body' => '']);

        Schema::table('chat_messages', function (Blueprint $table) {
            $table->text('body')->nullable(false)->change();
        });
    }
};
