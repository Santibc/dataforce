<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('daily_logs', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->unsignedBigInteger('driver_id');
            $table->enum('event_type', [
                'absence',
                'no_call_no_show',
                'late_arrival',
                'uniform',
                'coaching',
                'suspension',
                'other',
            ]);
            $table->text('description')->nullable();
            $table->enum('severity', ['low', 'medium', 'high']);
            $table->text('action_taken')->nullable();
            $table->unsignedBigInteger('admin_id');
            $table->unsignedBigInteger('company_id');
            $table->enum('status', ['draft', 'submitted'])->default('draft');
            $table->timestamp('submitted_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('driver_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('admin_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('company_id')->references('id')->on('companies')->onDelete('cascade');
            $table->index(['company_id', 'date']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('daily_logs');
    }
};
