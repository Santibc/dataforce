<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Src\Domain\Chat\Models\ChatMessage;

class CleanOldChatMessages extends Command
{
    protected $signature = 'chat:clean-old-messages {--months=3 : Number of months to keep}';

    protected $description = 'Delete chat messages older than the specified number of months';

    public function handle(): int
    {
        $months = (int) $this->option('months');
        $cutoff = now()->subMonths($months);

        $count = ChatMessage::where('created_at', '<', $cutoff)->count();

        if ($count === 0) {
            $this->info('No old messages to clean.');

            return self::SUCCESS;
        }

        ChatMessage::where('created_at', '<', $cutoff)->delete();

        $this->info("Deleted {$count} messages older than {$months} months.");

        return self::SUCCESS;
    }
}
