<?php

namespace Tests\Application\SuperAdmin\User\Controllers;

use Spatie\Permission\Models\Role;
use Src\Domain\Jobsite\Models\Jobsite;
use Src\Domain\Position\Models\Position;
use Src\Domain\User\Enums\Roles;
use Src\Domain\User\Models\User;
use Tests\TestCase;

class UserControllerTest extends TestCase
{
    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        Role::firstOrCreate(['name' => Roles::ADMIN]);
        $this->user = User::factory()->withRole(Roles::SUPER_ADMIN)->create();
    }

    /** @test */
    public function it_can_update_a_user(): void
    {
        $this->withoutExceptionHandling();
        $user = User::factory()->create();

        $position = Position::factory()->create(['company_id' => $user->company_id]);
        $jobsite = Jobsite::factory()->create(['company_id' => $user->company_id]);

        $userData = [
            'id' => $user->id,
            'firstname' => 'Updated Name',
            'lastname' => 'Updated Last Name',
            'email' => $user->email,
            'roles' => [Roles::ADMIN],
            'driver_amazon_id' => '123',
            'positions_id' => [$position->id],
            'jobsites_id' => [$jobsite->id],
        ];

        $this->actingAs($this->user)->put("api/super/users/{$user->id}", $userData)->assertOk();

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'firstname' => 'Updated Name',
            'email' => $user->email,
            'lastname' => 'Updated Last Name',
        ]);

        $user->refresh();
        $this->assertTrue($user->hasRole(Roles::ADMIN));
    }

    /** @test */
    public function it_can_delete_a_user(): void
    {
        $this->withoutExceptionHandling();
        $user = User::factory()->create();

        \SubscriptionService::shouldReceive('updateSeats')->once()->withArgs(
            fn ($company, $amount) => $user->company->id === $company->id && $amount === 0
        );

        $this->actingAs($this->user)->delete("api/super/users/{$user->id}")->assertOk();

        $this->assertDatabaseMissing('users', ['id' => $user->id]);
    }

    /** @test */
    public function it_can_show_a_user(): void
    {
        $user = User::factory()->create();
        $super_admin = User::factory()->create();
        $super_admin->assignRole(['super_admin']);

        $this->actingAs($this->user)
            ->get("api/super/users/{$user->id}")
            ->assertOk()
            ->assertExactJson([
                'email' => $user->email,
                'firstname' => $user->firstname,
                'lastname' => $user->lastname,
                'phone_number' => $user->phone_number,
                'driver_amazon_id' => $user->driver_amazon_id,
                'positions' => [],
                'jobsites' => [],
                'roles' => [],
                'id' => $user->id,
                'company_id' => $user->company_id,
            ]);

    }
}
