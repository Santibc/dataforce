<?php

namespace Tests\Application\User\Coaching\Controllers;

use Src\Application\Driver\Coaching\Controllers\CoachingController;
use Src\Domain\Coaching\Models\Coaching;
use Src\Domain\User\Enums\Roles;
use Src\Domain\User\Models\User;
use Tests\TestCase;

class CoachingControllerTest extends TestCase
{
    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->withRole(Roles::ADMIN)->create();
        $this->actingAs($this->user);
    }

    /** @test */
    public function read(): void
    {
        $coach_1 = Coaching::factory()->create(['user_id' => $this->user->id]);
        $coach_2 = Coaching::factory()->create(['user_id' => $this->user->id]);

        $this->post("api/user/coaching/$coach_1->id")
            ->assertOk();
        $this->assertDatabaseHas('coachings', [
            'id' => $coach_1->id,
            'read' => true,
        ]);
        $this->assertDatabaseHas('coachings', [
            'id' => $coach_2->id,
            'read' => false,
        ]);
    }

    /** @test */
    public function get_coaching(): void
    {
        $this->withoutExceptionHandling();
        $coach_1 = Coaching::factory()->create(['user_id' => $this->user->id]);
        $coach_2 = Coaching::factory()->create(['user_id' => $this->user->id]);
        Coaching::factory()->create(['user_id' => $this->user->id, 'week' => 21]);
        Coaching::factory()->create();

        $this->get(action([CoachingController::class, 'get_coaching']).'?week=20&year=2023')
            ->assertOk()
            ->assertExactJson([
                [
                    'id' => $coach_1->id,
                    'subject' => $coach_1->subject,
                    'year' => 2023,
                    'week' => 20,
                    'category' => $coach_1->category,
                    'content' => $coach_1->content,
                    'user_id' => $this->user->id,
                    'type' => 'coach',
                    'read' => $coach_1->read,
                ],
                [
                    'id' => $coach_2->id,
                    'subject' => $coach_2->subject,
                    'year' => 2023,
                    'week' => 20,
                    'category' => $coach_2->category,
                    'content' => $coach_2->content,
                    'user_id' => $this->user->id,
                    'type' => 'coach',
                    'read' => $coach_1->read,
                ],
            ]);
    }
}
