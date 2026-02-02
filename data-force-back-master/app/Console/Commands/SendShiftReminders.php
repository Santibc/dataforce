<?php

namespace App\Console\Commands;

use Carbon\Carbon;
use Illuminate\Console\Command;
use Src\Application\Admin\Shift\Notifications\ShiftChangeNotification;
use Src\Application\Admin\Shift\Notifications\TypeShift;
use Src\Domain\Company\Models\Company;
use Src\Domain\Jobsite\Models\Jobsite;
use Src\Domain\Shift\Models\Shift;

class SendShiftReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'shifts:send-reminders';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send email reminders for shifts scheduled for tomorrow';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $tomorrow = Carbon::tomorrow();
        $dayAfter = Carbon::tomorrow()->addDay();

        $shifts = Shift::withoutGlobalScopes()
            ->where('published', true)
            ->where('delete_after_published', false) // Exclude deleted shifts
            ->whereNotNull('user_id')
            ->where('from', '>=', $tomorrow->startOfDay())
            ->where('from', '<', $dayAfter->startOfDay())
            ->with(['user'])
            ->get();

        $count = 0;

        foreach ($shifts as $shift) {
            if (!$shift->user || !$shift->user->email) {
                $this->warn("Shift #{$shift->id}: User has no email, skipping.");
                continue;
            }

            try {
                // Load jobsite without global scope (requires auth user)
                $jobsite = Jobsite::withoutGlobalScopes()->find($shift->jobsite_id);
                $company = $jobsite ? Company::find($jobsite->company_id) : null;
                $companyName = $company ? $company->name : 'BosMetrics';

                $shift->user->notify(new ShiftChangeNotification(
                    'Reminder: Your Shift Tomorrow',
                    TypeShift::CREATE,
                    $shift->user->firstname . ' ' . $shift->user->lastname,
                    $companyName,
                    $shift->from->format('m/d/Y'),
                    $shift->from->format('H:i'),
                    null, // supervisor
                    $shift->name, // position_name
                    null, // prev_date
                    null, // prev_time
                    null, // prev_to
                    $shift->to->format('H:i')
                ));

                $count++;
                $this->info("Reminder sent to {$shift->user->email} for shift on {$shift->from->format('m/d/Y')}");

            } catch (\Exception $e) {
                $this->error("Failed to send reminder for shift #{$shift->id}: {$e->getMessage()}");
            }
        }

        $this->info("Total reminders sent: {$count}");

        return Command::SUCCESS;
    }
}
