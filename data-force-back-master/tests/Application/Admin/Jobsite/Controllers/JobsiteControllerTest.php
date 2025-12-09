<?php

namespace Tests\Application\Admin\Jobsite\Controllers;

use Src\Application\Admin\Jobsite\Controllers\JobsiteController;
use Src\Domain\Jobsite\Models\Jobsite;
use Src\Domain\Shift\Models\Shift;
use Src\Domain\User\Enums\Roles;
use Src\Domain\User\Models\User;
use Tests\TestCase;

class JobsiteControllerTest extends TestCase
{
    private User $user_logged;

    protected function setUp(): void
    {
        parent::setUp();

        $user = User::factory()->withRole(Roles::ADMIN)->create();
        $this->user_logged = $user;
        $this->actingAs($user);
    }

    /** @test */
    public function store(): void
    {
        $this->withoutExceptionHandling();
        $user_1 = User::factory()->create();
        $user_2 = User::factory()->create();

        $jobsiteData = [
            'name' => $this->faker->name,
            'address_street' => $this->faker->streetAddress,
            'state' => $this->faker->country,
            'city' => $this->faker->city,
            'zip_code' => $this->faker->countryCode,
            'users_id' => [$user_1->id, $user_2->id],
        ];

        $this->post(action([JobsiteController::class, 'store']), $jobsiteData)->assertOk();
        $this->assertDatabaseHas('jobsites', [
            'name' => $jobsiteData['name'],
            'address_street' => $jobsiteData['address_street'],
            'state' => $jobsiteData['state'],
            'city' => $jobsiteData['city'],
            'zip_code' => $jobsiteData['zip_code'],
        ]);
    }

    /** @test */
    public function update(): void
    {
        $jobsite = Jobsite::factory()->hasUsers()->create([
            'company_id' => $this->user_logged->company_id,
        ]);
        $user_1 = User::factory()->create();

        $jobsiteData = [
            'id' => $jobsite->id,
            'name' => 'Nuevo nombre',
            'address_street' => 'Segurola',
            'state' => 'Buenos Aires',
            'city' => 'CABA',
            'zip_code' => '1405',
            'users_id' => [$user_1->id],
        ];
        $this->put(action([JobsiteController::class, 'update'], ['jobsite' => $jobsite->id]), $jobsiteData)
            ->assertStatus(200);

        $this->assertDatabaseHas('jobsites', [
            'id' => $jobsite->id,
            'name' => 'Nuevo nombre',
            'address_street' => 'Segurola',
            'state' => 'Buenos Aires',
            'city' => 'CABA',
            'zip_code' => '1405',
        ]);
    }

    /** @test */
    public function show(): void
    {
        $this->withoutExceptionHandling();
        $jobsite = Jobsite::factory()->hasUsers()->create([
            'company_id' => $this->user_logged->company_id,
        ]);
        Jobsite::factory()->hasUsers()->create();

        $this->get(action([JobsiteController::class, 'show'], ['jobsite' => $jobsite->id]))
            ->assertOk()
            ->assertExactJson([
                'id' => $jobsite->id,
                'name' => $jobsite->name,
                'address_street' => $jobsite->address_street,
                'state' => $jobsite->state,
                'city' => $jobsite->city,
                'zip_code' => $jobsite->zip_code,
                'users' => $jobsite->users->map(fn ($user) => [
                    'id' => $user->id,
                    'firstname' => $user->firstname,
                    'lastname' => $user->lastname,
                    'email' => $user->email,
                    'phone_number' => $user->phone_number,
                    'driver_amazon_id' => $user->driver_amazon_id,
                    'positions' => $user->positions->map(fn ($position) => [
                        'name' => $position->name,
                        'color' => $position->color,
                        'from' => $position->from,
                        'to' => $position->to,
                    ]),
                ])->toArray(),
            ]);

    }

    /** @test */
    public function index(): void
    {
        $this->withoutExceptionHandling();
        $jobsite_1 = Jobsite::factory()->create([
            'company_id' => $this->user_logged->company_id,
        ]);
        $jobsite_2 = Jobsite::factory()->hasUsers()->create([
            'company_id' => $this->user_logged->company_id,
        ]);

        Jobsite::factory()->hasUsers()->create();

        $this->get(action([JobsiteController::class, 'index']))
            ->assertOk()
            ->assertExactJson([
                [
                    'id' => $jobsite_1->id,
                    'name' => $jobsite_1->name,
                    'address_street' => $jobsite_1->address_street,
                    'state' => $jobsite_1->state,
                    'city' => $jobsite_1->city,
                    'zip_code' => $jobsite_1->zip_code,
                    'users' => $jobsite_1->users->map(fn ($user) => [
                        'id' => $user->id,
                        'firstname' => $user->firstname,
                        'lastname' => $user->lastname,
                        'email' => $user->email,
                        'phone_number' => $user->phone_number,
                        'driver_amazon_id' => $user->driver_amazon_id,
                        'positions' => $user->positions->map(fn ($position) => [
                            'name' => $position->name,
                            'color' => $position->color,
                            'from' => $position->from,
                            'to' => $position->to,
                        ]),
                    ])->toArray(),
                ],
                [
                    'id' => $jobsite_2->id,
                    'name' => $jobsite_2->name,
                    'address_street' => $jobsite_2->address_street,
                    'state' => $jobsite_2->state,
                    'city' => $jobsite_2->city,
                    'zip_code' => $jobsite_2->zip_code,
                    'users' => $jobsite_2->users->map(fn ($user) => [
                        'id' => $user->id,
                        'firstname' => $user->firstname,
                        'lastname' => $user->lastname,
                        'email' => $user->email,
                        'phone_number' => $user->phone_number,
                        'driver_amazon_id' => $user->driver_amazon_id,
                        'positions' => $user->positions->map(fn ($position) => [
                            'name' => $position->name,
                            'color' => $position->color,
                            'from' => $position->from,
                            'to' => $position->to,
                        ]),
                    ])->toArray(),
                ],
            ]);

    }

    /** @test */
    public function destroy(): void
    {
        $this->withoutExceptionHandling();
        $jobsite = Jobsite::factory()->create([
            'company_id' => $this->user_logged->company_id,
        ]);
        $user = User::factory()
            ->hasShifts(1, ['jobsite_id' => $jobsite->id])
            ->create();

        $user->jobsites()->attach($jobsite->id);

        $this->delete(action([JobsiteController::class, 'destroy'], ['jobsite' => $jobsite->id]))
            ->assertOk();

        $this->assertDatabaseMissing(Jobsite::class, ['id' => $jobsite->id]);
        $this->assertCount(0, Shift::all());
    }
}
