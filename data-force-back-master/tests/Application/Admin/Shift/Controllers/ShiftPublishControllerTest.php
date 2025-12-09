<?php

namespace Tests\Application\Admin\Shift\Controllers;

use Carbon\Carbon;
use Src\Application\Admin\Shift\Controllers\ShiftPublishController;
use Src\Domain\Jobsite\Models\Jobsite;
use Src\Domain\Shift\Models\Shift;
use Src\Domain\User\Enums\Roles;
use Src\Domain\User\Models\User;
use Tests\TestCase;

class ShiftPublishControllerTest extends TestCase
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
    public function publish(): void
    {

        $jobsite = Jobsite::factory()->create(['company_id' => $this->user->company_id]);
        $shift = Shift::factory()->create(['jobsite_id' => $jobsite->id, 'user_id' => $this->user->id]);

        $this->put(action([ShiftPublishController::class, 'publish'], $shift->id))
            ->assertStatus(200);

        $this->assertDatabaseHas('shifts', [
            'id' => $shift->id,
            'name' => $shift->name,
            'from' => $shift->from,
            'to' => $shift->to,
            'color' => $shift->color,
            'published' => true,
            'user_id' => $shift->user_id,
            'jobsite_id' => $shift->jobsite_id,
        ]);

    }

    /** @test */
    public function publish_all_filter_name(): void
    {
        $jobsite = Jobsite::factory()->create(['company_id' => $this->user->company_id]);

        Carbon::setTestNow(Carbon::create(2023, 8, 11));
        $now = now();
        $to = now()->addWeek();

        $data = [
            'jobsite_id' => $jobsite->id,
            'from' => $now->toDateTimeString(),
            'to' => $to->toDateTimeString(),
            'names' => ['managment', 'driver'],
        ];

        $shift = Shift::factory()->create([
            'from' => $now->copy()->addDay(),
            'to' => $now->copy()->addDays(2),
            'jobsite_id' => $jobsite->id,
            'name' => 'Managment',
            'user_id' => $this->user->id,
        ]);
        $shift_2 = Shift::factory()->create([
            'from' => $now->copy()->addDays(2),
            'to' => $now->copy()->addDays(3),
            'jobsite_id' => $jobsite->id,
            'name' => 'Managment 2',
            'user_id' => $this->user->id,
        ]);
        $shift_3 = Shift::factory()->create([
            'from' => $now->copy()->addDays(2),
            'to' => $now->copy()->addDays(3),
            'jobsite_id' => $jobsite->id,
            'name' => 'Driver',
            'user_id' => $this->user->id,
        ]);

        $this->put(action([ShiftPublishController::class, 'publish_all'], $data))
            ->assertStatus(200);

        $this->assertDatabaseHas('shifts',
            [
                'id' => $shift->id,
                'name' => $shift->name,
                'from' => $shift->from,
                'to' => $shift->to,
                'color' => $shift->color,
                'published' => true,
                'user_id' => $shift->user_id,
                'jobsite_id' => $shift->jobsite_id,
            ],
        );
        $this->assertDatabaseHas('shifts',
            [
                'id' => $shift_2->id,
                'name' => $shift_2->name,
                'from' => $shift_2->from,
                'to' => $shift_2->to,
                'color' => $shift_2->color,
                'published' => false,
                'user_id' => $shift_2->user_id,
                'jobsite_id' => $shift_2->jobsite_id,
            ],
        );
        $this->assertDatabaseHas('shifts',
            [
                'id' => $shift_3->id,
                'name' => $shift_3->name,
                'from' => $shift_3->from,
                'to' => $shift_3->to,
                'color' => $shift_3->color,
                'published' => true,
                'user_id' => $shift_3->user_id,
                'jobsite_id' => $shift_3->jobsite_id,
            ],
        );
    }

    /** @test */
    public function publish_all(): void
    {

        $this->withoutExceptionHandling();
        $jobsite = Jobsite::factory()->create(['company_id' => $this->user->company_id]);

        Carbon::setTestNow(Carbon::create(2023, 8, 11));
        $now = now();
        $to = now()->addWeek();

        $data = [
            'jobsite_id' => $jobsite->id,
            'from' => $now->toDateTimeString(),
            'to' => $to->toDateTimeString(),
        ];

        $shift = Shift::factory()->create([
            'from' => $now->copy()->addDay(),
            'to' => $now->copy()->addDays(2),
            'jobsite_id' => $jobsite->id,
            'user_id' => $this->user->id,
        ]);
        $shift_2 = Shift::factory()->create([
            'from' => $now->copy()->addDays(2),
            'to' => $now->copy()->addDays(3),
            'user_id' => $this->user->id,
        ]);
        $shift_3 = Shift::factory()->create([
            'from' => $now->copy()->addDays(3),
            'to' => $now->copy()->addDays(4),
            'jobsite_id' => $jobsite->id,
            'user_id' => $this->user->id,
        ]);
        $shift_4 = Shift::factory()->create([
            'from' => $now->copy()->addMonth(),
            'to' => $now->copy()->addMonth()->addDay(),
            'jobsite_id' => $jobsite->id,
            'user_id' => $this->user->id,
        ]);

        $this->put(action([ShiftPublishController::class, 'publish_all'], $data))
            ->assertStatus(200);

        $this->assertDatabaseHas('shifts',
            [
                'id' => $shift->id,
                'name' => $shift->name,
                'from' => $shift->from,
                'to' => $shift->to,
                'color' => $shift->color,
                'published' => true,
                'user_id' => $shift->user_id,
                'jobsite_id' => $shift->jobsite_id,
            ],
        );

        $this->assertDatabaseHas('shifts',
            [
                'id' => $shift_2->id,
                'name' => $shift_2->name,
                'from' => $shift_2->from,
                'to' => $shift_2->to,
                'color' => $shift_2->color,
                'published' => false,
                'user_id' => $shift_2->user_id,
                'jobsite_id' => $shift_2->jobsite_id,
            ],
        );

        $this->assertDatabaseHas('shifts',
            [
                'id' => $shift_3->id,
                'name' => $shift_3->name,
                'from' => $shift_3->from,
                'to' => $shift_3->to,
                'color' => $shift_3->color,
                'published' => true,
                'user_id' => $shift_3->user_id,
                'jobsite_id' => $shift_3->jobsite_id,
            ],
        );

        $this->assertDatabaseHas('shifts',
            [
                'id' => $shift_4->id,
                'name' => $shift_4->name,
                'from' => $shift_4->from,
                'to' => $shift_4->to,
                'color' => $shift_4->color,
                'published' => false,
                'user_id' => $shift_4->user_id,
                'jobsite_id' => $shift_4->jobsite_id,
            ],
        );

    }
}
