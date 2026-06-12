<?php

namespace App\Console;


use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{

    protected $commands = [

    ];

    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        // Send shift reminders daily at 3:00 PM
        $schedule->command('shifts:send-reminders')->dailyAt('15:00');

        // Process pending shift publish notifications every 2 minutes
        $schedule->command('shifts:send-publish-notifications --limit=20')
            ->everyTwoMinutes()
            ->withoutOverlapping()
            ->runInBackground();

        // Sync ADP workers daily: refresh linked drivers and stage new candidates for review
        $schedule->command('adp:sync-workers')
            ->dailyAt('04:00')
            ->withoutOverlapping()
            ->runInBackground();

        // Sync ADP worked hours (time cards) daily after the worker sync
        $schedule->command('adp:sync-time-cards')
            ->dailyAt('05:00')
            ->withoutOverlapping()
            ->runInBackground();
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
