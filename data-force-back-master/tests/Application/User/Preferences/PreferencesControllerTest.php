<?php

namespace Tests\Application\User\Preferences;

use Carbon\Carbon;
use Src\Application\Driver\Preferences\Controllers\PreferencesController;
use Src\Domain\Preferences\Models\Preference;
use Src\Domain\Shift\Models\Shift;
use Src\Domain\User\Enums\Roles;
use Src\Domain\User\Models\User;
use Tests\TestCase;

class PreferencesControllerTest extends TestCase
{
    /** @test */
    public function get_preferences(): void
    {
        Carbon::setTestNow(Carbon::create(2023, 8, 11));
        $user = User::factory()->withRole(Roles::USER)->create();

        $now = now();

        $preferences = Preference::factory()->create([
            'user_id' => $user->id,
            'date' => $now->copy()->addDay(),
            'available' => true,
        ]);
        $preferences_1 = Preference::factory()->create([
            'user_id' => $user->id,
            'date' => $now->copy()->addDays(2),
            'available' => false,
        ]);
        Preference::factory()->create([
            'date' => $now->copy()->addDays(3),
            'available' => false,
        ]);

        $this->actingAs($user);
        $this->get(action([PreferencesController::class, 'get_preferences'])
                            ."?from={$now->toDateTimeString()}&to={$now->copy()->addWeek()->toDateTimeString()}")
            ->assertOk()
            ->assertExactJson([
                [
                    'date' => $preferences->date->toDateTimeString(),
                    'available' => true,
                    'id' => $preferences->id,
                ],
                [
                    'date' => $preferences_1->date->toDateTimeString(),
                    'available' => false,
                    'id' => $preferences_1->id,
                ],
            ]);

    }

    /** @test */
    public function copy(): void
    {
        $this->withoutExceptionHandling();
        Carbon::setTestNow(Carbon::create(2023, 8, 11));
        $user = User::factory()->withRole(Roles::USER)->create();
        $now = now();

        $pref_1 = Preference::factory()->create([
            'user_id' => $user->id,
            'date' => $now->copy(),
            'available' => true,
        ]);
        $pref_2 = Preference::factory()->create([
            'user_id' => $user->id,
            'date' => $now->copy()->subDays(2),
            'available' => true,
        ]);
        $pref_3 = Preference::factory()->create([
            'user_id' => $user->id,
            'date' => $now->copy()->subDays(7),
            'available' => true,
        ]);
        Preference::factory()->create([
            'user_id' => $user->id,
            'date' => $now->copy()->subDays(10),
            'available' => true,
        ]);

        $this->actingAs($user);

        $this->post(action([PreferencesController::class, 'copy_week_finishing_at_date'])."?date={$now->toDateTimeString()}")
            ->assertOk();

        $this->assertDatabaseCount('preferences', 7);
        $this->assertDatabaseHas('preferences', [
            'user_id' => $user->id,
            'available' => true,
            'date' => $pref_1->date->addWeek(),
        ]);
        $this->assertDatabaseHas('preferences', [
            'user_id' => $user->id,
            'available' => true,
            'date' => $pref_2->date->addWeek(),
        ]);
        $this->assertDatabaseHas('preferences', [
            'user_id' => $user->id,
            'available' => true,
            'date' => $pref_3->date->addWeek(),
        ]);

    }

    /** @test */
    public function store_or_update(): void
    {
        Carbon::setTestNow(Carbon::create(2023, 8, 11));
        $user = User::factory()->withRole(Roles::USER)->create();

        $now = now();
        $preferences = Preference::factory()->create();

        $data = [
            'data' => [
                [
                    'date' => $now->copy(),
                    'available' => false,
                ],
                [
                    'date' => $now->copy(),
                    'available' => false,
                ],
                [
                    'date' => $preferences->date,
                    'available' => ! $preferences->available,
                    'id' => $preferences->id,
                ],
            ],
        ];

        $this->actingAs($user);

        $this->post(action([PreferencesController::class, 'store_or_update']), $data)->assertOk();

        $this->assertDatabaseHas('preferences', [
            'date' => $data['data'][0]['date'],
            'available' => $data['data'][0]['available'],
            'user_id' => $user->id,
        ]);
        $this->assertDatabaseHas('preferences', [
            'date' => $data['data'][1]['date'],
            'available' => $data['data'][1]['available'],
            'user_id' => $user->id,
        ]);
        $this->assertDatabaseHas('preferences', [
            'date' => $preferences->date,
            'available' => ! $preferences->available !== 0,
            'user_id' => $preferences->user_id,
            'id' => $preferences->id,
        ]);
    }

    /** @test */
    public function store_or_update_with_conflicting_shifts_should_error(): void
    {
        Carbon::setTestNow(Carbon::create(2023, 8, 11));
        $user = User::factory()->withRole(Roles::USER)->create();

        $now = now();

        Shift::factory()->create([
            'user_id' => $user->id,
            'published' => true,
            'from' => $now->copy(),
            'to' => $now->copy()->addHour(),
        ]);

        $dataWithConflicts = [
            'data' => [
                [
                    'date' => $now->copy(),
                    'available' => false,
                ],
            ],
        ];

        $this->actingAs($user);

        $res = $this->post(action([PreferencesController::class, 'store_or_update']), $dataWithConflicts);

        $res->assertExactJson(['messages' => ['There are days marked as unavailable where shifts have already been assigned.'], 'code' => 422]);

    }

    /** @test */
    public function copy_preferences_with_conflicting_shifts_should_error(): void
    {

        Carbon::setTestNow(Carbon::create(2023, 8, 11));
        $user = User::factory()->withRole(Roles::USER)->create();

        // Creates a preference for last week
        for ($i = 0; $i < 7; $i++) {
            Preference::factory()->create([
                'user_id' => $user->id,
                'date' => now()->copy()->subDays($i + 1),
                'available' => false,
            ]);
        }

        $shift = Shift::factory()->create([
            'user_id' => $user->id,
            'published' => true,
            'from' => now()->copy(),
            'to' => now()->copy()->addHour(),
        ]);

        $this->actingAs($user);

        $now = now();

        $res = $this->post(action([PreferencesController::class, 'copy_week_finishing_at_date'])."?date={$now->subDay()->toDateTimeString()}");

        $res->assertExactJson(['messages' => ['There are days marked as unavailable where shifts have already been assigned.'], 'code' => 422]);

    }
}
