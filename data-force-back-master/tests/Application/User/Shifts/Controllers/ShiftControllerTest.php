<?php

namespace Tests\Application\User\Shifts\Controllers;

use Carbon\Carbon;
use Src\Application\Driver\Shifts\Controllers\ShiftController;
use Src\Domain\Jobsite\Models\Jobsite;
use Src\Domain\User\Enums\Roles;
use Src\Domain\User\Models\User;
use Tests\TestCase;

class ShiftControllerTest extends TestCase
{
    /** @test */
    public function confirmed(): void
    {

        $this->withoutExceptionHandling();
        $jobsite = Jobsite::factory()->create();
        Carbon::setTestNow(Carbon::create(2023, 8, 11));
        $now = now();
        $to = now()->copy()->addWeek();

        $user = User::factory()
            ->hasShifts(1, ['from' => $now->copy()->addDay(), 'to' => $now->copy()->addDays(2), 'jobsite_id' => $jobsite->id, 'published' => true])
            ->hasShifts(1, ['from' => $now->copy()->addDay()->addWeek(), 'to' => $now->copy()->addDays(2)->addWeek(), 'jobsite_id' => $jobsite->id])
            ->hasShifts(1, ['from' => $now->copy()->addDay(), 'to' => $now->copy()->addDays(2)])
            ->hasShifts(1, ['from' => $now->copy()->addMonths(3), 'to' => $now->copy()->addMonths(4), 'jobsite_id' => $jobsite->id])
            ->withRole(Roles::USER)
            ->create();

        $this->actingAs($user);

        $shift_in_range = $user->shifts->first();
        $user->jobsites()->attach($jobsite->id);

        $this->post(action([ShiftController::class, 'confirm'])."?from={$now->toDateTimeString()}&to={$to->toDateTimeString()}")
            ->assertOk();

        $this->assertDatabaseHas('shifts', [
            'name' => $shift_in_range->name,
            'from' => $shift_in_range->from,
            'to' => $shift_in_range->to,
            'color' => $shift_in_range->color,
            'user_id' => $shift_in_range->user_id,
            'jobsite_id' => $shift_in_range->jobsite_id,
            'confirmed' => true,
        ]);
    }
}
