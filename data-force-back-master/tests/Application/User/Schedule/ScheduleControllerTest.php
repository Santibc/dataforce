<?php

namespace Tests\Application\User\Schedule;

use Carbon\Carbon;
use Src\Application\Driver\Schedule\Controllers\ScheduleController;
use Src\Domain\Company\Models\Company;
use Src\Domain\Jobsite\Models\Jobsite;
use Src\Domain\User\Enums\Roles;
use Src\Domain\User\Models\User;
use Tests\TestCase;

class ScheduleControllerTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

    }

    /** @test */
    public function get_schedule(): void
    {
        $this->withoutExceptionHandling();
        Carbon::setTestNow(Carbon::create(2023, 8, 11));
        $now = now();
        $to = now()->addWeek();
        $company = Company::factory()->create();

        $jobsite = Jobsite::factory()->create(['company_id' => $company->id]);
        $jobsite_2 = Jobsite::factory()->create(['company_id' => $company->id]);

        $user = User::factory()
            ->hasShifts(
                1,
                [
                    'from' => $now->copy()->addDay(),
                    'to' => $now->copy()->addDays(2),
                    'jobsite_id' => $jobsite->id,
                    'published' => true,
                ]
            )
            ->hasShifts(
                1,
                [
                    'from' => $now->copy()->addDays(2),
                    'to' => $now->copy()->addDays(3),
                    'jobsite_id' => $jobsite_2->id,
                ]
            )
            ->hasShifts(
                1,
                [
                    'from' => $now->copy()->addMonths(3),
                    'to' => $now->copy()->addMonths(4),
                    'jobsite_id' => $jobsite->id,
                ]
            )
            ->withRole(Roles::USER)
            ->create(['company_id' => $company->id]);

        $user->jobsites()->attach($jobsite->id);
        $user->jobsites()->attach($jobsite_2->id);

        $this->actingAs($user);

        $shift_in_range = $user->shifts->first();

        $this->get(action([ScheduleController::class, 'get_schedule'])."?from={$now->toDateTimeString()}&to={$to->toDateTimeString()}")
            ->assertOk()
            ->assertExactJson([
                [
                    'color' => $shift_in_range->color,
                    'from' => $shift_in_range->from->toDateTimeString(),
                    'to' => $shift_in_range->to->toDateTimeString(),
                    'id' => $shift_in_range->id,
                    'name' => $shift_in_range->name,
                    'confirmed' => false,
                    'published' => $shift_in_range->published !== 0,
                    'jobsite' => [
                        'address_street' => $shift_in_range->jobsite->address_street,
                        'city' => $shift_in_range->jobsite->city,
                        'id' => $shift_in_range->jobsite->id,
                        'name' => $shift_in_range->jobsite->name,
                        'state' => $shift_in_range->jobsite->state,
                        'zip_code' => $shift_in_range->jobsite->zip_code,
                    ],
                ],
            ]);
    }
}
