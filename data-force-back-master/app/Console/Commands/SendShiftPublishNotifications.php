<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Src\Application\Admin\Shift\Notifications\ShiftBulkPublishNotification;
use Src\Domain\Shift\Models\Shift;
use Src\Shared\Tasks\SendNotificationTask;

class SendShiftPublishNotifications extends Command
{
    protected $signature = 'shifts:send-publish-notifications {--limit=20}';

    protected $description = 'Send consolidated email notifications for published but unnotified shifts';

    public function handle(): int
    {
        $limit = (int) $this->option('limit');

        $shifts = Shift::where('published', true)
            ->where('notified', false)
            ->where('delete_after_published', false)
            ->whereNotNull('user_id')
            ->with(['user.company', 'publishedByUser'])
            ->limit($limit)
            ->orderBy('created_at', 'asc')
            ->get();

        if ($shifts->isEmpty()) {
            $this->info('No pending notifications.');

            return Command::SUCCESS;
        }

        $grouped = $shifts->groupBy('user_id');

        foreach ($grouped as $userId => $userShifts) {
            $user = $userShifts->first()->user;

            if (! $user || ! $user->email) {
                $this->warn("User #{$userId} has no email, skipping.");
                Shift::whereIn('id', $userShifts->pluck('id'))->update(['notified' => true]);

                continue;
            }

            try {
                SendNotificationTask::notifyPublish(
                    $userId,
                    $userShifts->first()->from,
                    $userShifts->count() > 1 ? $userShifts->count().' shifts' : $userShifts->first()->name
                );

                $companyName = $user->company?->name ?? 'BosMetrics';
                $adminUser = $userShifts->first()->publishedByUser;
                $adminName = $adminUser ? $adminUser->firstname.' '.$adminUser->lastname : null;

                $user->notify(new ShiftBulkPublishNotification(
                    $userShifts,
                    $companyName,
                    $adminName,
                ));

                Shift::whereIn('id', $userShifts->pluck('id'))->update(['notified' => true]);

                $this->info("Notified {$user->email} for {$userShifts->count()} shift(s).");
            } catch (\Exception $e) {
                $this->error("Failed for user #{$userId} ({$user->email}): {$e->getMessage()}");
                Log::error('Shift publish notification failed', [
                    'user_id' => $userId,
                    'shift_ids' => $userShifts->pluck('id')->toArray(),
                    'error' => $e->getMessage(),
                ]);
            }
        }

        return Command::SUCCESS;
    }
}
