<?php

namespace Tests\Application\Admin\Shift\Controllers;

use Carbon\Carbon;
use Src\Application\Admin\Shift\Controllers\ShiftController;
use Src\Domain\Jobsite\Models\Jobsite;
use Src\Domain\Shift\Models\Shift;
use Src\Domain\User\Enums\Roles;
use Src\Domain\User\Models\User;
use Tests\TestCase;

class ShiftControllerTest extends TestCase
{
    private User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $user = User::factory()->withRole(Roles::ADMIN)->create();
        $this->user = $user;
        $this->actingAs($user);
    }

    /** @test */
    public function store(): void
    {
        $this->withoutExceptionHandling();
        $user_id = User::factory()->create(['company_id' => $this->user->company_id])->id;
        $jobsite_id = Jobsite::factory()->create(['company_id' => $this->user->company_id])->id;

        $shiftData = [
            'name' => $this->faker->name,
            'from' => now()->toDateTimeString(),
            'to' => now()->addDay()->toDateTimeString(),
            'color' => $this->faker->hexColor,
            'user_id' => $user_id,
            'jobsite_id' => $jobsite_id,
        ];

        $this->post(action([ShiftController::class, 'store']), $shiftData)->assertOk();
        $this->assertDatabaseHas('shifts', [
            'name' => $shiftData['name'],
            'from' => $shiftData['from'],
            'to' => $shiftData['to'],
            'color' => $shiftData['color'],
            'user_id' => $user_id,
            'jobsite_id' => $jobsite_id,
        ]);
    }

    /** @test */
    public function update(): void
    {
        $jobsite_id = Jobsite::factory()->create(['company_id' => $this->user->company_id]);
        $shift = Shift::factory()->create(['confirmed' => true, 'jobsite_id' => $jobsite_id, 'user_id' => $this->user->id]);
        $from = now()->addMonth();
        $to = now()->addMonths(2);
        $shiftData = [
            'id' => $shift->id,
            'name' => 'Nuevo nombre',
            'from' => $from,
            'to' => $to,
            'color' => 'Nuevo color',
            'user_id' => $shift->user_id,
            'jobsite_id' => $shift->jobsite_id,
        ];
        $this->put(action([ShiftController::class, 'update'], ['shift' => $shift->id]), $shiftData)
            ->assertStatus(200);

        $this->assertDatabaseHas('shifts', [
            'id' => $shift->id,
            'name' => 'Nuevo nombre',
            'from' => $from,
            'to' => $to,
            'color' => 'Nuevo color',
            'user_id' => $shift->user_id,
            'jobsite_id' => $shift->jobsite_id,
        ]);
    }

    /** @test */
    public function destroy(): void
    {

        $jobsite_id = Jobsite::factory()->create(['company_id' => $this->user->company_id]);
        $shift = Shift::factory()->create(['jobsite_id' => $jobsite_id, 'user_id' => $this->user->id]);

        $this->delete(action([ShiftController::class, 'destroy'], ['shift' => $shift->id]))
            ->assertOk();

        $this->assertDatabaseMissing(Shift::class, ['id' => $shift->id]);
    }

    /** @test */
    public function show(): void
    {
        $jobsite = Jobsite::factory()->create([
            'company_id' => $this->user->company_id,
        ]);
        Shift::factory()->create();
        $shift = Shift::factory()->create([
            'jobsite_id' => $jobsite->id,
        ]);

        $this->get(action([ShiftController::class, 'show'], ['shift' => $shift->id]))
            ->assertOk()
            ->assertExactJson([
                'id' => $shift->id,
                'name' => $shift->name,
                'from' => $shift->from->toDateTimeString(),
                'to' => $shift->to->toDateTimeString(),
                'color' => $shift->color,
                'published' => $shift->published,
                'user' => [
                    'firstname' => $shift->user->firstname,
                    'lastname' => $shift->user->lastname,
                    'email' => $shift->user->email,
                    'phone_number' => $shift->user->phone_number,
                    'driver_amazon_id' => $shift->user->driver_amazon_id,
                    'company_id' => $shift->user->company_id,
                    'id' => $shift->user->id,
                ],
                'jobsite' => [
                    'name' => $shift->jobsite->name,
                    'address_street' => $shift->jobsite->address_street,
                    'state' => $shift->jobsite->state,
                    'city' => $shift->jobsite->city,
                    'id' => $shift->jobsite->id,
                    'zip_code' => $shift->jobsite->zip_code,
                ],
            ]);

    }

    /** @test */
    public function index(): void
    {
        $jobsite = Jobsite::factory()->create([
            'company_id' => $this->user->company_id,
        ]);
        $shift_1 = Shift::factory()->create([
            'jobsite_id' => $jobsite->id,
        ]);
        $shift_2 = Shift::factory()->create([
            'jobsite_id' => $jobsite->id,
        ]);

        $this->get(action([ShiftController::class, 'index']))
            ->assertOk()
            ->assertExactJson([
                [
                    'id' => $shift_1->id,
                    'name' => $shift_1->name,
                    'from' => $shift_1->from->toDateTimeString(),
                    'to' => $shift_1->to->toDateTimeString(),
                    'color' => $shift_1->color,
                    'published' => $shift_1->published,
                    'user' => [
                        'firstname' => $shift_1->user->firstname,
                        'lastname' => $shift_1->user->lastname,
                        'email' => $shift_1->user->email,
                        'phone_number' => $shift_1->user->phone_number,
                        'driver_amazon_id' => $shift_1->user->driver_amazon_id,
                        'company_id' => $shift_1->user->company_id,
                        'id' => $shift_1->user->id,
                    ],
                    'jobsite' => [
                        'name' => $shift_1->jobsite->name,
                        'address_street' => $shift_1->jobsite->address_street,
                        'state' => $shift_1->jobsite->state,
                        'city' => $shift_1->jobsite->city,
                        'id' => $shift_1->jobsite->id,
                        'zip_code' => $shift_1->jobsite->zip_code,
                    ],
                ],
                [
                    'id' => $shift_2->id,
                    'name' => $shift_2->name,
                    'from' => $shift_2->from->toDateTimeString(),
                    'to' => $shift_2->to->toDateTimeString(),
                    'color' => $shift_2->color,
                    'published' => $shift_2->published,
                    'user' => [
                        'firstname' => $shift_2->user->firstname,
                        'lastname' => $shift_2->user->lastname,
                        'email' => $shift_2->user->email,
                        'phone_number' => $shift_2->user->phone_number,
                        'driver_amazon_id' => $shift_2->user->driver_amazon_id,
                        'company_id' => $shift_2->user->company_id,
                        'id' => $shift_2->user->id,
                    ],
                    'jobsite' => [
                        'name' => $shift_2->jobsite->name,
                        'address_street' => $shift_2->jobsite->address_street,
                        'state' => $shift_2->jobsite->state,
                        'city' => $shift_2->jobsite->city,
                        'id' => $shift_2->jobsite->id,
                        'zip_code' => $shift_2->jobsite->zip_code,
                    ],
                ],
            ]);

    }

    /** @test */
    public function copy_with_overwrite(): void
    {

        $this->withoutExceptionHandling();
        $jobsite = Jobsite::factory()->create(['company_id' => $this->user->company_id]);

        Carbon::setTestNow(Carbon::create(2023, 8, 11));
        $now = now()->subWeek();
        $to = now();

        $user = User::factory()
            ->hasShifts(1, ['from' => $now->copy()->addDay(), 'to' => $now->copy()->addDays(2), 'jobsite_id' => $jobsite->id])
            ->hasShifts(1, ['from' => $now->copy()->addDay()->addWeek(), 'to' => $now->copy()->addDays(2)->addWeek(), 'jobsite_id' => $jobsite->id])
            ->hasShifts(1, ['from' => $now->copy()->addDay(), 'to' => $now->copy()->addDays(2)])
            ->hasShifts(1, ['from' => $now->copy()->addMonths(3), 'to' => $now->copy()->addMonths(4), 'jobsite_id' => $jobsite->id])
            ->create(['company_id' => $this->user->company_id]);

        $shift_in_range = $user->shifts->first();
        $user->jobsites()->attach($jobsite->id);

        $data = [
            'jobsite_id' => $jobsite->id,
            'from' => $now->toDateTimeString(),
            'to' => $to->toDateTimeString(),
            'overwrite' => true,
            'weeks' => 1,
        ];

        $this->post(action([ShiftController::class, 'copy'], $data))->assertOk();

        $this->assertDatabaseCount('shifts', 4);
        $this->assertDatabaseHas('shifts', [
            'name' => $shift_in_range->name,
            'from' => $shift_in_range->from,
            'to' => $shift_in_range->to,
            'color' => $shift_in_range->color,
            'user_id' => $shift_in_range->user_id,
            'jobsite_id' => $shift_in_range->jobsite_id,
        ]);

        $this->assertDatabaseHas('shifts', [
            'name' => $shift_in_range->name,
            'from' => $shift_in_range->from->addWeek(),
            'to' => $shift_in_range->to->addWeek(),
            'color' => $shift_in_range->color,
            'user_id' => $shift_in_range->user_id,
            'jobsite_id' => $shift_in_range->jobsite_id,
        ]);

    }

    /** @test */
    public function copy_with_delete_after_published(): void
    {
        $jobsite = Jobsite::factory()->create(['company_id' => $this->user->company_id]);

        Carbon::setTestNow(Carbon::create(2023, 8, 11));
        $now = today()->subWeek();
        $to = today();

        $user = User::factory()
            ->hasShifts(1, ['from' => $now->copy()->addHour(), 'to' => $now->copy()->addHours(8), 'jobsite_id' => $jobsite->id])
            ->hasShifts(1,
                [
                    'from' => $now->copy()->addHour(),
                    'to' => $now->copy()->addHours(8),
                    'jobsite_id' => $jobsite->id,
                    'delete_after_published' => true,
                    'published' => true,
                ],
            )
            ->create(['company_id' => $this->user->company_id]);

        $shift_in_range = $user->shifts->first();
        $user->jobsites()->attach($jobsite->id);

        $data = [
            'jobsite_id' => $jobsite->id,
            'from' => $now->toDateTimeString(),
            'to' => $to->toDateTimeString(),
            'overwrite' => true,
            'weeks' => 1,
            'user_id' => $user->id,
        ];

        $this->post(action([ShiftController::class, 'copy'], $data))->assertOk();

        $this->assertDatabaseCount('shifts', 3);

        $this->assertDatabaseHas('shifts', [
            'name' => $shift_in_range->name,
            'from' => $shift_in_range->from->toDateTimeString(),
            'to' => $shift_in_range->to->toDateTimeString(),
            'color' => $shift_in_range->color,
            'user_id' => $shift_in_range->user_id,
            'jobsite_id' => $shift_in_range->jobsite_id,
        ]);

        $this->assertDatabaseHas('shifts', [
            'name' => $shift_in_range->name,
            'from' => $shift_in_range->from->addWeek()->toDateTimeString(),
            'to' => $shift_in_range->to->addWeek()->toDateTimeString(),
            'color' => $shift_in_range->color,
            'user_id' => $shift_in_range->user_id,
            'jobsite_id' => $shift_in_range->jobsite_id,
        ]);
    }

    /** @test */
    public function copy_with_overwrite_per_day(): void
    {

        $this->withoutExceptionHandling();
        $jobsite = Jobsite::factory()->create(['company_id' => $this->user->company_id]);

        Carbon::setTestNow(Carbon::create(2023, 8, 11));
        $now = today()->subDay();
        $to = today();

        $user = User::factory()
            ->hasShifts(1, ['from' => $now->copy()->addHour(), 'to' => $now->copy()->addHours(8), 'jobsite_id' => $jobsite->id])
            ->create(['company_id' => $this->user->company_id]);

        $shift_in_range = $user->shifts->first();
        $user->jobsites()->attach($jobsite->id);

        $data = [
            'jobsite_id' => $jobsite->id,
            'from' => $now->toDateTimeString(),
            'to' => $to->toDateTimeString(),
            'overwrite' => true,
            'weeks' => 0,
        ];

        $this->post(action([ShiftController::class, 'copy'], $data))->assertOk();

        $this->assertDatabaseCount('shifts', 2);
        $this->assertDatabaseHas('shifts', [
            'name' => $shift_in_range->name,
            'from' => $shift_in_range->from->toDateTimeString(),
            'to' => $shift_in_range->to->toDateTimeString(),
            'color' => $shift_in_range->color,
            'user_id' => $shift_in_range->user_id,
            'jobsite_id' => $shift_in_range->jobsite_id,
        ]);

        $this->assertDatabaseHas('shifts', [
            'name' => $shift_in_range->name,
            'from' => $shift_in_range->from->addDay()->toDateTimeString(),
            'to' => $shift_in_range->to->addDay()->toDateTimeString(),
            'color' => $shift_in_range->color,
            'user_id' => $shift_in_range->user_id,
            'jobsite_id' => $shift_in_range->jobsite_id,
        ]);

    }

    /** @test */
    public function copy_without_overwrite(): void
    {

        $jobsite = Jobsite::factory()->create(['company_id' => $this->user->company_id]);

        Carbon::setTestNow(Carbon::create(2023, 8, 11));
        $now = now()->subWeek();
        $to = now();

        $user = User::factory()
            ->hasShifts(1, ['from' => $now->copy()->addDay(), 'to' => $now->copy()->addDays(2), 'jobsite_id' => $jobsite->id])
            ->hasShifts(1, ['from' => $now->copy()->addDays(2), 'to' => $now->copy()->addDays(3), 'jobsite_id' => $jobsite->id])
            ->hasShifts(1, ['from' => $now->copy()->addDay()->addWeek(), 'to' => $now->copy()->addDays(2)->addWeek(), 'jobsite_id' => $jobsite->id])
            ->hasShifts(1, ['from' => $now->copy()->addDay(), 'to' => $now->copy()->addDays(2)])
            ->hasShifts(1, ['from' => $now->copy()->addMonths(3), 'to' => $now->copy()->addMonths(4), 'jobsite_id' => $jobsite->id])
            ->create(['company_id' => $this->user->company_id]);

        $shift_in_range = $user->shifts[1];
        $user->jobsites()->attach($jobsite->id);

        $data = [
            'jobsite_id' => $jobsite->id,
            'from' => $now->toDateTimeString(),
            'to' => $to->toDateTimeString(),
            'overwrite' => false,
            'weeks' => 1,
        ];

        $this->post(action([ShiftController::class, 'copy'], $data))->assertOk();

        $this->assertDatabaseCount('shifts', 6);
        $this->assertDatabaseHas('shifts', [
            'name' => $shift_in_range->name,
            'from' => $shift_in_range->from,
            'to' => $shift_in_range->to,
            'color' => $shift_in_range->color,
            'user_id' => $shift_in_range->user_id,
            'jobsite_id' => $shift_in_range->jobsite_id,
        ]);

        $this->assertDatabaseHas('shifts', [
            'name' => $shift_in_range->name,
            'from' => $shift_in_range->from->addWeek(),
            'to' => $shift_in_range->to->addWeek(),
            'color' => $shift_in_range->color,
            'user_id' => $shift_in_range->user_id,
            'jobsite_id' => $shift_in_range->jobsite_id,
        ]);

    }

    /** @test */
    public function delete_user_shift(): void
    {
        $this->withoutExceptionHandling();
        Carbon::setTestNow(Carbon::create(2023, 8, 11));
        $now = now();
        $to = now()->addWeek();

        $user = User::factory()
            ->hasShifts(1, ['from' => $now->copy()->addDay(), 'to' => $now->copy()->addDays(2)])
            ->hasShifts(1, ['from' => $now->copy()->addDays(2), 'to' => $now->copy()->addDays(3)])
            ->hasShifts(1, ['from' => $now->copy()->addDay()->addWeek(), 'to' => $now->copy()->addDays(2)->addWeek()])
            ->hasShifts(1, ['from' => $now->copy()->addDay(), 'to' => $now->copy()->addDays(2)])
            ->hasShifts(1, ['from' => $now->copy()->addMonths(3), 'to' => $now->copy()->addMonths(4)])
            ->create(['company_id' => $this->user->company_id]);

        $data = [
            'from' => $now->toDateTimeString(),
            'to' => $to->toDateTimeString(),
            'user_id' => $user->id,
            'weeks' => 1,
        ];

        $shift_in_range = $user->shifts[2];
        $shift_in_range_2 = $user->shifts[4];

        $this->delete(action([ShiftController::class, 'delete_shift_user'], $data))->assertOk();

        $this->assertDatabaseCount('shifts', 2);
        $this->assertDatabaseHas('shifts', [
            'name' => $shift_in_range->name,
            'from' => $shift_in_range->from,
            'to' => $shift_in_range->to,
            'color' => $shift_in_range->color,
            'user_id' => $shift_in_range->user_id,
            'jobsite_id' => $shift_in_range->jobsite_id,
        ]);
        $this->assertDatabaseHas('shifts', [
            'name' => $shift_in_range_2->name,
            'from' => $shift_in_range_2->from,
            'to' => $shift_in_range_2->to,
            'color' => $shift_in_range_2->color,
            'user_id' => $shift_in_range_2->user_id,
            'jobsite_id' => $shift_in_range_2->jobsite_id,
        ]);
    }

    /** @test */
    public function copy_without_overwrite_and_users(): void
    {

        $jobsite = Jobsite::factory()->create(['company_id' => $this->user->company_id]);

        Carbon::setTestNow(Carbon::create(2023, 8, 11));
        $now = now()->subWeek();
        $to = now();

        User::factory()
            ->hasShifts(1, ['from' => $now->copy()->addDay(), 'to' => $now->copy()->addDays(2), 'jobsite_id' => $jobsite->id])
            ->hasShifts(1, ['from' => $now->copy()->addDay()->addWeek(), 'to' => $now->copy()->addDays(2)->addWeek(), 'jobsite_id' => $jobsite->id])
            ->create(['company_id' => $this->user->company_id]);

        User::factory()
            ->hasShifts(1, ['from' => $now->copy()->addDay(), 'to' => $now->copy()->addDays(2), 'jobsite_id' => $jobsite->id])
            ->hasShifts(1, ['from' => $now->copy()->addDay()->addWeek(), 'to' => $now->copy()->addDays(2)->addWeek(), 'jobsite_id' => $jobsite->id])
            ->create(['company_id' => $this->user->company_id]);

        $user = User::factory()
            ->hasShifts(1, ['from' => $now->copy()->addDay(), 'to' => $now->copy()->addDays(2), 'jobsite_id' => $jobsite->id])
            ->hasShifts(1, ['from' => $now->copy()->addDay()->addWeek(), 'to' => $now->copy()->addDays(2)->addWeek(), 'jobsite_id' => $jobsite->id])
            ->create(['company_id' => $this->user->company_id]);

        $shift_in_range = $user->shifts[1];
        $user->jobsites()->attach($jobsite->id);

        $data = [
            'jobsite_id' => $jobsite->id,
            'from' => $now->toDateTimeString(),
            'to' => $to->toDateTimeString(),
            'overwrite' => false,
            'weeks' => 1,
        ];

        $this->post(action([ShiftController::class, 'copy'], $data))->assertOk();

        $this->assertDatabaseCount('shifts', 6);
        $this->assertDatabaseHas('shifts', [
            'name' => $shift_in_range->name,
            'from' => $shift_in_range->from,
            'to' => $shift_in_range->to,
            'color' => $shift_in_range->color,
            'user_id' => $shift_in_range->user_id,
            'jobsite_id' => $shift_in_range->jobsite_id,
        ]);

    }
}
