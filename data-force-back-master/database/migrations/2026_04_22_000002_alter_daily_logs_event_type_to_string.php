<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE daily_logs MODIFY event_type VARCHAR(100) NOT NULL");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE daily_logs MODIFY event_type ENUM('absence','no_call_no_show','late_arrival','uniform','coaching','suspension','other') NOT NULL");
    }
};
