<?php

namespace Tests\Application\Admin\User\Controllers;

use Spatie\Permission\Models\Role;
use Src\Domain\Company\Models\Company;
use Src\Domain\Jobsite\Models\Jobsite;
use Src\Domain\Performance\Models\Performance;
use Src\Domain\Position\Models\Position;
use Src\Domain\Preferences\Models\Preference;
use Src\Domain\Shift\Models\Shift;
use Src\Domain\User\Enums\Roles;
use Src\Domain\User\Models\User;
use Tests\TestCase;

class UserControllerTest extends TestCase
{
    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        Role::create(['name' => Roles::SUPER_ADMIN]);
        $this->user = User::factory()->withRole(Roles::ADMIN)->create();
    }

    /** @test */
    public function it_can_store_a_user(): void
    {
        \SubscriptionService::shouldReceive('updateSeats')->once();

        $position = Position::factory()->create(['company_id' => $this->user->company_id]);
        $companie = Company::factory()->create();
        $userData = [
            'firstname' => 'John',
            'lastname' => 'Doe',
            'email' => 'johndoe@example.com',
            'driver_amazon_id' => '123',
            'roles' => [Roles::ADMIN],
            'positions_id' => [$position->id],
            'jobsites_id' => [],
            'company_id' => $companie->id,
        ];

        $this->actingAs($this->user)->post('api/admin/users', $userData)->assertOk();

        $this->assertDatabaseHas('users', [
            'firstname' => 'John',
            'email' => 'johndoe@example.com',
        ]);

        $user = User::where('email', 'johndoe@example.com')->first();
        $this->assertTrue($user->hasRole(Roles::ADMIN));
    }

    /** @test */
    public function it_can_update_a_user(): void
    {
        $this->withoutExceptionHandling();
        $user = User::factory()->create(['company_id' => $this->user->company_id]);

        $position = Position::factory()->create(['company_id' => $this->user->company_id]);
        $jobsite = Jobsite::factory()->create();

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

        $this->actingAs($this->user)->put("api/admin/users/{$user->id}", $userData)->assertOk();

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

        $user = User::factory()->create(['company_id' => $this->user->company_id]);

        \SubscriptionService::shouldReceive('updateSeats')->once()->withArgs(
            fn ($company) => $user->company->id === $company->id
        );

        $this->actingAs($this->user)->delete("api/admin/users/{$user->id}")->assertOk();

        $this->assertDatabaseMissing('users', ['id' => $user->id]);
    }

    /** @test */
    public function it_can_delete_a_user_with_relations(): void
    {
        $this->withoutExceptionHandling();
        $user = User::factory()->create([
            'company_id' => $this->user->company_id,
            'driver_amazon_id' => 666,
        ]);

        $position = Position::factory()->create();
        $user->positions()->attach($position);

        $jobsite = Jobsite::factory()->create();
        $user->jobsites()->attach($jobsite);

        Shift::factory()->create([
            'user_id' => $user->id,
            'jobsite_id' => $jobsite->id,
        ]);

        Preference::factory()->create([
            'user_id' => $user->id,
        ]);

        Performance::factory()->create([
            'driver_amazon_id' => $user->driver_amazon_id,
        ]);

        \SubscriptionService::shouldReceive('updateSeats')->once()->withArgs(
            fn ($company) => $user->company->id === $company->id
        );

        $this->actingAs($this->user)->delete("api/admin/users/{$user->id}")->assertOk();

        $this->assertDatabaseMissing('users', ['id' => $user->id]);
    }

    /** @test */
    public function it_can_show_a_user(): void
    {
        $user = User::factory()->create(['company_id' => $this->user->company_id]);
        $super_admin = User::factory()->create(['company_id' => $this->user->company_id]);
        $super_admin->assignRole(['super_admin']);

        $this->actingAs($this->user)
            ->get("api/admin/users/{$user->id}")
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

    /** @test */
    public function it_can_return_a_collection_of_users(): void
    {
        $this->withoutExceptionHandling();
        $user = User::factory()->create(['company_id' => $this->user->company_id]);
        $user_2 = User::factory()->create(['company_id' => $this->user->company_id]);
        $user_3 = User::factory()->hasJobsites()->create(['company_id' => $this->user->company_id]);

        $position = Position::factory()->create(['company_id' => $user_2->company_id]);
        $user_2->positions()->attach($position->id);

        $this->actingAs($this->user)
            ->get('api/admin/users')
            ->assertOk()
            ->assertExactJson([
                [
                    'email' => $this->user->email,
                    'firstname' => $this->user->firstname,
                    'lastname' => $this->user->lastname,
                    'phone_number' => $this->user->phone_number,
                    'positions' => [],
                    'jobsites' => [],
                    'driver_amazon_id' => $this->user->driver_amazon_id,
                    'roles' => [Roles::ADMIN],
                    'id' => $this->user->id,
                    'company_id' => $this->user->company_id,
                ],
                [
                    'email' => $user->email,
                    'firstname' => $user->firstname,
                    'lastname' => $user->lastname,
                    'phone_number' => $user->phone_number,
                    'positions' => [],
                    'jobsites' => [],
                    'driver_amazon_id' => $user->driver_amazon_id,
                    'roles' => [],
                    'id' => $user->id,
                    'company_id' => $user->company_id,
                ],
                [
                    'email' => $user_2->email,
                    'firstname' => $user_2->firstname,
                    'lastname' => $user_2->lastname,
                    'phone_number' => $user_2->phone_number,
                    'positions' => $user_2->positions->map(fn (Position $p) => [
                        'color' => $p->color,
                        'from' => $p->from,
                        'id' => $p->id,
                        'name' => $p->name,
                        'to' => $p->to,
                    ]),
                    'jobsites' => [],
                    'driver_amazon_id' => $user_2->driver_amazon_id,
                    'roles' => [],
                    'id' => $user_2->id,
                    'company_id' => $user_2->company_id,
                ],
                [
                    'email' => $user_3->email,
                    'firstname' => $user_3->firstname,
                    'lastname' => $user_3->lastname,
                    'phone_number' => $user_3->phone_number,
                    'positions' => [],
                    'jobsites' => $user_3->jobsites->map(fn (Jobsite $j) => [
                        'address_street' => $j->address_street,
                        'city' => $j->city,
                        'id' => $j->id,
                        'name' => $j->name,
                        'state' => $j->state,
                        'zip_code' => $j->zip_code,
                    ]),
                    'driver_amazon_id' => $user_3->driver_amazon_id,
                    'roles' => [],
                    'id' => $user_3->id,
                    'company_id' => $user_3->company_id,
                ],
            ]);
    }
}
