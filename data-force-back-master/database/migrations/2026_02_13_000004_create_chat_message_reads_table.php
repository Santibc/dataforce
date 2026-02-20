<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('chat_message_reads', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('chat_group_id');
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('last_read_message_id')->nullable();
            $table->timestamp('read_at')->useCurrent();

            $table->foreign('chat_group_id')->references('id')->on('chat_groups')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('last_read_message_id')->references('id')->on('chat_messages')->onDelete('set null');
            $table->unique(['chat_group_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('chat_message_reads');
    }
};
