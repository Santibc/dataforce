<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Src\Domain\DailyLog\Models\DailyLog;
use Src\Domain\DailyLog\Models\EventType;
use Src\Shared\Notifications\DailyLogNotification;

class SendDailyLogEmail extends Command
{
    protected $signature = 'dailylog:send-email {logId}';
    protected $description = 'Send daily log notification email';

    public function handle(): void
    {
        $log = DailyLog::with(['driver', 'admin'])->find($this->argument('logId'));

        if (!$log) {
            $this->error('Daily log not found');
            return;
        }

        $eventType = EventType::withTrashed()
            ->where('company_id', $log->company_id)
            ->where('slug', $log->event_type)
            ->first();

        $eventTypeLabel = $eventType
            ? $eventType->name
            : Str::headline(str_replace('_', ' ', (string) $log->event_type));

        $severityLabels = [
            'low' => 'Low',
            'medium' => 'Medium',
            'high' => 'High',
        ];

        $adminName = $log->admin->firstname . ' ' . $log->admin->lastname;
        $driverName = $log->driver->firstname . ' ' . $log->driver->lastname;

        $notification = new DailyLogNotification(
            driverName: $driverName,
            eventType: $eventTypeLabel,
            severity: $severityLabels[$log->severity] ?? $log->severity,
            description: $log->description ?? 'N/A',
            actionTaken: $log->action_taken ?? 'N/A',
            date: $log->date->format('m/d/Y'),
            adminName: $adminName,
        );

        try {
            $log->driver->notify($notification);
            $this->info('Email sent to driver: ' . $driverName);
        } catch (\Exception $e) {
            Log::error('Failed to send DailyLog email to driver: ' . $e->getMessage());
            $this->error('Failed to send to driver: ' . $e->getMessage());
        }
    }
}
