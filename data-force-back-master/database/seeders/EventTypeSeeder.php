<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Src\Domain\Company\Models\Company;
use Src\Domain\DailyLog\Models\EventType;

class EventTypeSeeder extends Seeder
{
    /**
     * Seed the default daily-log event types for every company.
     */
    public function run(): void
    {
        $defaults = $this->defaults();

        Company::query()->orderBy('id')->chunk(50, function ($companies) use ($defaults): void {
            foreach ($companies as $company) {
                foreach ($defaults as $preset) {
                    EventType::withTrashed()
                        ->updateOrCreate(
                            [
                                'company_id' => $company->id,
                                'slug' => $preset['slug'],
                            ],
                            [
                                'name' => $preset['name'],
                                'default_severity' => $preset['default_severity'],
                                'default_description' => $preset['default_description'],
                                'default_action_taken' => $preset['default_action_taken'],
                                'is_active' => true,
                                'deleted_at' => null,
                            ]
                        );
                }
            }
        });
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function defaults(): array
    {
        return [
            [
                'slug' => 'absence',
                'name' => 'Absence',
                'default_severity' => 'medium',
                'default_description' => 'Driver was absent from the scheduled shift without prior approval or valid justification.',
                'default_action_taken' => "Absence documented in the driver's file. Driver contacted to verify the reason and attendance policy reviewed.",
            ],
            [
                'slug' => 'no_call_no_show',
                'name' => 'No Call No Show',
                'default_severity' => 'high',
                'default_description' => 'Driver failed to report to the scheduled shift and did not notify the company in advance.',
                'default_action_taken' => 'Formal written warning issued. Incident documented. Attendance policy reviewed with the driver.',
            ],
            [
                'slug' => 'late_arrival',
                'name' => 'Late Arrival',
                'default_severity' => 'low',
                'default_description' => 'Driver arrived after the scheduled shift start time.',
                'default_action_taken' => "Verbal warning issued. Driver reminded of the company's punctuality policy and expected arrival time.",
            ],
            [
                'slug' => 'uniform',
                'name' => 'Uniform',
                'default_severity' => 'low',
                'default_description' => "Driver did not comply with the company's uniform or personal image policy during the shift.",
                'default_action_taken' => 'Reminded of the uniform policy. Full compliance requested for the next scheduled shift.',
            ],
            [
                'slug' => 'coaching',
                'name' => 'Coaching',
                'default_severity' => 'medium',
                'default_description' => 'Coaching session held with the driver to reinforce performance standards and operational expectations.',
                'default_action_taken' => 'Feedback provided, follow-up commitments established, and notes documented for future review.',
            ],
            [
                'slug' => 'suspension',
                'name' => 'Suspension',
                'default_severity' => 'high',
                'default_description' => 'Driver temporarily suspended from duties due to a serious policy violation or recurring infractions.',
                'default_action_taken' => "Formal suspension applied. Incident documented in the driver's file. Case to be reviewed by management.",
            ],
            [
                'slug' => 'other',
                'name' => 'Other',
                'default_severity' => 'low',
                'default_description' => null,
                'default_action_taken' => null,
            ],
        ];
    }
}
