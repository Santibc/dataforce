<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Src\Domain\DailyLog\Models\DailyLog;
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

        $eventTypeLabels = [
            'absence' => 'Absence',
            'no_call_no_show' => 'No Call No Show',
            'late_arrival' => 'Late Arrival',
            'uniform' => 'Uniform',
            'coaching' => 'Coaching',
            'suspension' => 'Suspension',
            'other' => 'Other',
        ];

        $severityLabels = [
            'low' => 'Low',
            'medium' => 'Medium',
            'high' => 'High',
        ];

        $adminName = $log->admin->firstname . ' ' . $log->admin->lastname;
        $driverName = $log->driver->firstname . ' ' . $log->driver->lastname;

        $notification = new DailyLogNotification(
            driverName: $driverName,
            eventType: $eventTypeLabels[$log->event_type] ?? $log->event_type,
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
