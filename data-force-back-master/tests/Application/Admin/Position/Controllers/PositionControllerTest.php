<?php

namespace Tests\Application\Admin\Position\Controllers;

use Src\Application\Admin\Position\Controllers\PositionController;
use Src\Domain\Company\Models\Company;
use Src\Domain\Position\Models\Position;
use Src\Domain\User\Enums\Roles;
use Src\Domain\User\Models\User;
use Tests\TestCase;

class PositionControllerTest extends TestCase
{
    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->withRole(Roles::ADMIN)->create();
    }

    /** @test */
    public function store(): void
    {
        $positionData = [
            'name' => $this->faker->name,
            'from' => now()->toDateTimeString(),
            'to' => now()->addDay()->toDateTimeString(),
            'color' => $this->faker->hexColor,
        ];

        $this->actingAs($this->user)->post(action([PositionController::class, 'store']), $positionData)->assertOk();
        $this->assertDatabaseHas('positions', [
            'name' => $positionData['name'],
            'from' => $positionData['from'],
            'to' => $positionData['to'],
            'color' => $positionData['color'],
        ]);
    }

    /** @test */
    public function update(): void
    {
        $position = Position::factory()->create(['company_id' => $this->user->company_id]);
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
        Position::factory()->create(['company_id' => $this->user->company_id]);
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
    public function index(): void
    {
        $position_1 = Position::factory()->create(['company_id' => $this->user->company_id]);
        $position_2 = Position::factory()->create(['company_id' => $this->user->company_id]);

        Position::factory()->create(['company_id' => Company::factory()->create()->id]);

        $this->actingAs($this->user)
            ->get(action([PositionController::class, 'index']))
            ->assertOk()
            ->assertExactJson([
                [
                    'id' => $position_1->id,
                    'name' => $position_1->name,
                    'from' => $position_1->from->toDateTimeString(),
                    'to' => $position_1->to->toDateTimeString(),
                    'color' => $position_1->color,
                ],
                [
                    'id' => $position_2->id,
                    'name' => $position_2->name,
                    'from' => $position_2->from->toDateTimeString(),
                    'to' => $position_2->to->toDateTimeString(),
                    'color' => $position_2->color,
                ],
            ]);
    }

    /** @test */
    public function destroy(): void
    {

        $position = Position::factory()->create(['company_id' => $this->user->company_id]);

        $this->actingAs($this->user)
            ->delete(action([PositionController::class, 'destroy'], ['position' => $position->id]))
            ->assertOk();

        $this->assertDatabaseMissing(Position::class, ['id' => $position->id]);
    }
}
