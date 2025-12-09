<?php

namespace Tests\Application\SuperAdmin\Position\Controllers;

use Src\Application\SuperAdmin\Position\Controllers\PositionController;
use Src\Domain\Position\Models\Position;
use Src\Domain\User\Enums\Roles;
use Src\Domain\User\Models\User;
use Tests\TestCase;

class PositionControllerTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->withRole(Roles::SUPER_ADMIN)->create();
    }

    /** @test */
    public function update(): void
    {
        $this->withoutExceptionHandling();
        $position = Position::factory()->create();
        $from = now()->addMonth();
        $to = now()->addMonths(2);
        $positionData = [
            'id' => $position->id,
            'name' => $position->name,
            'from' => $from,
            'to' => $to,
            'color' => 'Nuevo color',
        ];
        $this->actingAs($this->user)->put(action([PositionController::class, 'update'], ['position' => $position->id]), $positionData)
            ->assertStatus(200);

        $this->assertDatabaseHas('positions', [
            'id' => $position->id,
            'name' => $position->name,
            'from' => $from,
            'to' => $to,
            'color' => 'Nuevo color',
        ]);
    }

    /** @test */
    public function show(): void
    {
        Position::factory()->create();
        $position = Position::factory()->create(['company_id' => $this->user->company_id]);

        $this->actingAs($this->user)
            ->get(action([PositionController::class, 'show'], ['position' => $position->id]))
            ->assertOk()
            ->assertExactJson([
                'id' => $position->id,
                'name' => $position->name,
                'from' => $position->from->toDateTimeString(),
                'to' => $position->to->toDateTimeString(),
                'color' => $position->color,
            ]);
    }

    /** @test */
    public function destroy(): void
    {

        $position = Position::factory()->create();

        $this->actingAs($this->user)
            ->delete(action([PositionController::class, 'destroy'], ['position' => $position->id]))
            ->assertOk();

        $this->assertDatabaseMissing(Position::class, ['id' => $position->id]);
    }
}
