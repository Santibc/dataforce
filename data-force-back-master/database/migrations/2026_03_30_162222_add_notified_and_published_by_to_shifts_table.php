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
        Schema::table('shifts', function (Blueprint $table) {
            $table->boolean('notified')->default(false)->after('delete_after_published');
            $table->unsignedBigInteger('published_by')->nullable()->after('notified');
            $table->foreign('published_by')->references('id')->on('users')->nullOnDelete();
            $table->index(['published', 'notified']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('shifts', function (Blueprint $table) {
            $table->dropIndex(['published', 'notified']);
            $table->dropForeign(['published_by']);
            $table->dropColumn(['notified', 'published_by']);
        });
    }
};
