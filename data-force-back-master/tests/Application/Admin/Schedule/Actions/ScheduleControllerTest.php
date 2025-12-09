<?php

namespace Tests\Application\Admin\Schedule\Actions;

use Carbon\Carbon;
use Src\Application\Admin\Schedule\Controllers\ScheduleController;
use Src\Domain\Jobsite\Models\Jobsite;
use Src\Domain\Preferences\Models\Preference;
use Src\Domain\Shift\Models\Shift;
use Src\Domain\User\Enums\Roles;
use Src\Domain\User\Models\User;
use Tests\TestCase;

class ScheduleControllerTest extends TestCase
{
    private User $user_logg;

    protected function setUp(): void
    {
        parent::setUp();

        $user = User::factory()->withRole(Roles::ADMIN)->create();
        $this->user_logg = $user;
        $this->actingAs($user);
    }

    /** @test */
    public function handle(): void
    {

        $this->withoutExceptionHandling();
        $jobsite = Jobsite::factory()->create([
            'company_id' => $this->user_logg->company_id,
        ]);

        Carbon::setTestNow(Carbon::create(2023, 8, 11));
        $now = now();
        $to = now()->addMonth();

        $user = User::factory()
            ->hasShifts(1, ['from' => $now->copy()->addDay(), 'to' => $now->copy()->addDays(2), 'jobsite_id' => $jobsite->id])
            ->hasShifts(1, ['from' => $now->copy()->addDay(), 'to' => $now->copy()->addDays(2)])
            ->hasShifts(1, ['from' => $now->copy()->addMonths(3), 'to' => $now->copy()->addMonths(4), 'jobsite_id' => $jobsite->id])
            ->create();

        Preference::factory()->create([
            'user_id' => $user->id,
        ]);
        $pref = Preference::factory()->create([
            'user_id' => $user->id,
            'date' => $now->copy()->addDay(),
            'available' => false,
        ]);

        $shift_in_range = $user->shifts->first();
        $user->jobsites()->attach($jobsite->id);

        $this->get(action([ScheduleController::class, 'handle'])."?jobsite_id={$jobsite->id}&from={$now->toDateTimeString()}&to={$to->toDateTimeString()}")
            ->assertOk()
            ->assertExactJson([
                [
                    'cantidad_horas' => 24,
                    'id' => $user->id,
                    'firstname' => $user->firstname,
                    'lastname' => $user->lastname,
                    'email' => $user->email,
                    'phone_number' => $user->phone_number,
                    'driver_amazon_id' => $user->driver_amazon_id,
                    'company_id' => $user->company_id,
                    'preferences' => [
                        [
                            'date' => $now->copy()->addDay(),
                            'available' => false,
                            'id' => $pref->id,
                        ],
                    ],
                    'shifts' => [
                        [
                            'id' => $shift_in_range->id,
                            'name' => $shift_in_range->name,
                            'color' => $shift_in_range->color,
                            'delete_after_published' => $shift_in_range->delete_after_published,
                            'published' => $shift_in_range->published,
                            'from' => $shift_in_range->from,
                            'to' => $shift_in_range->to,
                            'confirmed' => false,
                        ],
                    ],
                ]]
            );

    }

    /** @test */
    public function handle_with_positions_name(): void
    {
        $this->withoutExceptionHandling();
        $jobsite = Jobsite::factory()->create([
            'company_id' => $this->user_logg->company_id,
        ]);

        Carbon::setTestNow(Carbon::create(2023, 8, 11));
        $now = now();
        $to = now()->addMonth();

        $user = User::factory()
            ->hasShifts(1, ['name' => 'Prueba', 'from' => $now->copy()->addDay(), 'to' => $now->copy()->addDays(2), 'jobsite_id' => $jobsite->id])
            ->hasShifts(1, ['name' => 'Prueba 2', 'from' => $now->copy()->addDay(), 'to' => $now->copy()->addDays(2), 'jobsite_id' => $jobsite->id])
            ->hasShifts(1, ['from' => $now->copy()->addDay(), 'to' => $now->copy()->addDays(2)])
            ->hasShifts(1, ['from' => $now->copy()->addMonths(3), 'to' => $now->copy()->addMonths(4), 'jobsite_id' => $jobsite->id])
            ->create();

        $shift_in_range = $user->shifts->first();
        $user->jobsites()->attach($jobsite->id);

        $this->get(action([ScheduleController::class, 'handle'])."?jobsite_id={$jobsite->id}&from={$now->toDateTimeString()}&to={$to->toDateTimeString()}&name_positions[]=prueba")
            ->assertOk()
            ->assertExactJson([
                [
                    'cantidad_horas' => 24,
                    'id' => $user->id,
                    'firstname' => $user->firstname,
                    'lastname' => $user->lastname,
                    'email' => $user->email,
                    'phone_number' => $user->phone_number,
                    'driver_amazon_id' => $user->driver_amazon_id,
                    'company_id' => $user->company_id,
                    'preferences' => [],
                    'shifts' => [
                        [
                            'id' => $shift_in_range->id,
                            'name' => $shift_in_range->name,
                            'delete_after_published' => $shift_in_range->delete_after_published,
                            'color' => $shift_in_range->color,
                            'published' => $shift_in_range->published,
                            'from' => $shift_in_range->from,
                            'to' => $shift_in_range->to,
                            'confirmed' => false,
                        ],
                    ],
                ]]
            );
    }

    /** @test */
    public function clean(): void
    {
        $this->withoutExceptionHandling();
        $jobsite = Jobsite::factory()->create();

        Carbon::setTestNow(Carbon::create(2023, 8, 11));
        $now = now();
        $to = now()->addWeek();

        $shift = Shift::factory()->create([
            'jobsite_id' => $jobsite->id,
            'from' => $now->copy(),
            'to' => $to->copy(),
            'name' => 'Driver',
        ]);
        Shift::factory()->create([
            'jobsite_id' => $jobsite->id,
            'from' => $now->copy(),
            'to' => $to->copy(),
            'published' => true,
            'delete_after_published' => true,
            'name' => 'Driver',
        ]);
        Shift::factory()->create([
            'from' => $now->copy(),
            'to' => $to->copy(),
        ]);
        Shift::factory()->create([
            'jobsite_id' => $jobsite->id,
            'from' => $now->copy(),
            'to' => $to->copy(),
        ]);

        $data = [
            'from' => $now->toDateTimeString(),
            'to' => $to->toDateTimeString(),
            'jobsite_id' => $jobsite->id,
            'name_positions' => ['Driver'],
        ];

        $this->delete(action([ScheduleController::class, 'clean'], $data))->assertOk();

        $this->assertDatabaseCount('shifts', 3);
        $this->assertDatabaseMissing(Shift::class, ['id' => $shift->id]);

    }

    /** @test */
    public function handle_with_users(): void
    {
        $jobsite = Jobsite::factory()->create([
            'company_id' => $this->user_logg->company_id,
        ]);

        Carbon::setTestNow(Carbon::create(2023, 8, 11));
        $now = now();
        $to = now()->addMonth();

        $user = User::factory()
            ->hasShifts(1, ['from' => $now->copy()->addDay(), 'to' => $now->copy()->addDays(2), 'jobsite_id' => $jobsite->id])
            ->hasShifts(1, ['from' => $now->copy()->addDay(), 'to' => $now->copy()->addDays(2), 'jobsite_id' => $jobsite->id])
            ->hasShifts(1, ['from' => $now->copy()->addDay(), 'to' => $now->copy()->addDays(2)])
            ->hasShifts(1, ['from' => $now->copy()->addMonths(3), 'to' => $now->copy()->addMonths(4), 'jobsite_id' => $jobsite->id])
            ->create();

        $shift_in_range_1 = $user->shifts->first();
        $shift_in_range_2 = $user->shifts[1];
        $user->jobsites()->attach($jobsite->id);

        $this->get(action([ScheduleController::class, 'handle'])."?jobsite_id={$jobsite->id}&from={$now->toDateTimeString()}&to={$to->toDateTimeString()}&users_id[]=$user->id")
            ->assertOk()
            ->assertExactJson([
                [
                    'cantidad_horas' => 48,
                    'id' => $user->id,
                    'firstname' => $user->firstname,
                    'lastname' => $user->lastname,
                    'email' => $user->email,
                    'phone_number' => $user->phone_number,
                    'driver_amazon_id' => $user->driver_amazon_id,
                    'company_id' => $user->company_id,
                    'preferences' => [],
                    'shifts' => [
                        [
                            'id' => $shift_in_range_1->id,
                            'name' => $shift_in_range_1->name,
                            'color' => $shift_in_range_1->color,
                            'delete_after_published' => $shift_in_range_1->delete_after_published,
                            'published' => $shift_in_range_1->published,
                            'from' => $shift_in_range_1->from,
                            'to' => $shift_in_range_1->to,
                            'confirmed' => false,
                        ],
                        [
                            'id' => $shift_in_range_2->id,
                            'name' => $shift_in_range_2->name,
                            'color' => $shift_in_range_2->color,
                            'delete_after_published' => $shift_in_range_2->delete_after_published,
                            'published' => $shift_in_range_2->published,
                            'from' => $shift_in_range_2->from,
                            'to' => $shift_in_range_2->to,
                            'confirmed' => false,
                        ],
                    ],
                ]]
            );
    }
}
