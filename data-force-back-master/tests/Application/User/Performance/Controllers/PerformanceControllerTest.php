<?php

namespace Tests\Application\User\Performance\Controllers;

use Src\Application\Driver\Performance\Controllers\PerformanceController;
use Src\Domain\Performance\Models\Performance;
use Src\Domain\User\Enums\Roles;
use Src\Domain\User\Models\User;
use Tests\TestCase;

class PerformanceControllerTest extends TestCase
{
    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->withRole(Roles::ADMIN)->create();
        $this->actingAs($this->user);
    }

    /** @test */
    public function get_performance(): void
    {
        $this->withoutExceptionHandling();

        $user_1 = User::factory()->withRole(Roles::ADMIN)->create([
            'company_id' => $this->user->company_id,
        ]);

        $performance_1 = Performance::factory()->create([
            'driver_amazon_id' => $user_1->driver_amazon_id,
            'week' => 20,
            'year' => 2023,
        ]);
        Performance::factory()->create();
        Performance::factory()->create();

        $this->get(action([PerformanceController::class, 'get_performance']).'?user_id='.$user_1->id.'&week=20&year=2023')
            ->assertOk()
            ->assertExactJson([
                [
                    'id' => $performance_1->id,
                    'fico_score' => "$performance_1->fico_score",
                    'seatbelt_off_rate' => "$performance_1->seatbelt_off_rate",
                    'speeding_event_ratio' => "$performance_1->speeding_event_ratio",
                    'distraction_rate' => "$performance_1->distraction_rate",
                    'following_distance_rate' => "$performance_1->following_distance_rate",
                    'signal_violations_rate' => "$performance_1->signal_violations_rate",
                    'cdf' => "$performance_1->cdf",
                    'dcr' => "$performance_1->dcr",
                    'pod' => "$performance_1->pod",
                    'cc' => "$performance_1->cc",
                ],
            ]);

    }
}
