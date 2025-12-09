<?php

namespace Tests\Application\SuperAdmin\Company\Controllers;

use Src\Application\SuperAdmin\Company\Controllers\CompanyController;
use Src\Domain\Company\Models\Company;
use Src\Domain\User\Enums\Roles;
use Src\Domain\User\Models\User;
use Tests\TestCase;

class CompanyControllerTest extends TestCase
{
    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->withRole(Roles::SUPER_ADMIN)->create();
    }

    /** @test */
    public function cat_get_all_companies(): void
    {
        $this->withoutExceptionHandling();
        $companies = Company::factory()->create();
        $this->actingAs($this->user)->get(action([CompanyController::class, 'index']))
            ->assertOk()
            ->assertExactJson([
                [
                    'id' => $this->user->company->id,
                    'name' => $this->user->company->name,
                    'address' => $this->user->company->address,
                    'driver_amount' => $this->user->company->driver_amount,
                    'fleat_size' => $this->user->company->fleat_size,
                    'payroll' => $this->user->company->payroll,
                ],
                [
                    'id' => $companies->id,
                    'name' => $companies->name,
                    'address' => $companies->address,
                    'driver_amount' => $companies->driver_amount,
                    'fleat_size' => $companies->fleat_size,
                    'payroll' => $companies->payroll,
                ],
            ]);

    }

    /** @test */
    public function show(): void
    {
        Company::factory()->create();
        $company = $this->user->company;

        $this->actingAs($this->user)->get('/api/super/companies/'.$company->id)
            ->assertOk()
            ->assertJson([
                'id' => $company->id,
                'name' => $company->name,
                'address' => $company->address,
                'driver_amount' => $company->driver_amount,
                'fleat_size' => $company->fleat_size,
                'payroll' => $company->payroll,
                'jobsites' => [],
                'positions' => [],
                'users' => $company->users->map(fn ($u) => [
                    'driver_amazon_id' => $u->driver_amazon_id,
                    'email' => $u->email,
                    'firstname' => $u->firstname,
                    'id' => $u->id,
                    'lastname' => $u->lastname,
                    'phone_number' => $u->phone_number,
                    'roles' => $u->roles->map(fn ($r) => [
                        'guard_name' => $r->guard_name,
                        'id' => $r->id,
                        'name' => $r->name,
                    ])->toArray(),
                ])->toArray(),
            ]);

    }

    /** @test */
    public function cat_show_details_company(): void
    {
        Company::factory()->create();
        $company = $this->user->company;

        $this->actingAs($this->user)->get('/api/super/companies/'.$company->id)
            ->assertOk()
            ->assertJson([
                'id' => $company->id,
                'name' => $company->name,
                'address' => $company->address,
                'driver_amount' => $company->driver_amount,
                'fleat_size' => $company->fleat_size,
                'payroll' => $company->payroll,
                'jobsites' => [],
                'positions' => [],
                'users' => $company->users->map(fn ($u) => [
                    'driver_amazon_id' => $u->driver_amazon_id,
                    'email' => $u->email,
                    'firstname' => $u->firstname,
                    'id' => $u->id,
                    'lastname' => $u->lastname,
                    'phone_number' => $u->phone_number,
                    'roles' => $u->roles->map(fn ($r) => [
                        'guard_name' => $r->guard_name,
                        'id' => $r->id,
                        'name' => $r->name,
                    ])->toArray(),
                ])->toArray(),
            ]);
    }

    /** @test */
    public function destroy(): void
    {
        $this->withoutExceptionHandling();
        $company = Company::factory()->create();

        \SubscriptionService::shouldReceive('cancelSubscription')->once()->withArgs(
            fn ($comp) => $company->id === $comp->id
        );
        \SubscriptionService::shouldReceive('isSubscribed')->andReturn(true);

        $this->actingAs($this->user)->delete('/api/super/companies/'.$company->id)
            ->assertOk();
        $this->assertDatabaseMissing(Company::class, ['id' => $company->id]);
    }

    /** @test */
    public function update(): void
    {

        $companyData = [
            'id' => $this->user->company_id,
            'name' => 'Nuevo nombre',
            'address' => 'Nueva direccion',
            'driver_amount' => 20,
            'fleat_size' => 30,
            'payroll' => 'ADP',
        ];
        $this->actingAs($this->user)
            ->put(action([CompanyController::class, 'update'], ['company' => $this->user->company_id]), $companyData)
            ->assertOk();

        $this->assertDatabaseHas('companies', [
            'id' => $this->user->company_id,
            'name' => 'Nuevo nombre',
            'address' => 'Nueva direccion',
            'driver_amount' => 20,
            'fleat_size' => 30,
            'payroll' => 'ADP',
        ]);
    }

    public function test_get_bosmetrics_company_user_token(): void
    {
        $this->withoutExceptionHandling();
        $company = Company::factory()->create();
        $user = User::factory()->create([
            'company_id' => $company->id,
            'firstname' => 'Bos Metrics Admin',
        ]);
        $this->actingAs($this->user)
            ->get(action([CompanyController::class, 'getBosmetricsCompanyUserToken'], ['company_id' => $company->id]))
            ->assertJsonStructure(['token'])
            ->assertOk();
    }
}
