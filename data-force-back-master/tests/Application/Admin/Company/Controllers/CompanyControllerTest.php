<?php

namespace Tests\Application\Admin\Company\Controllers;

use Spatie\Permission\Models\Role;
use Src\Application\Admin\Company\Controllers\CompanyController;
use Src\Domain\Company\Models\Company;
use Src\Domain\User\Enums\Roles;
use Src\Domain\User\Models\User;
use Tests\TestCase;

class CompanyControllerTest extends TestCase
{
    private User $user_2;

    protected function setUp(): void
    {
        parent::setUp();

        $user = User::factory()->withRole(Roles::ADMIN)->create();
        Role::create(['name' => Roles::OWNER]);
        Role::create(['name' => Roles::SUPER_ADMIN]);

        $this->user_2 = $user;
        $this->actingAs($user);
    }

    /** @test */
    public function store(): void
    {
        $companyData = [
            'name' => 'Penzio company',
            'address' => 'Calle falsa 123',
            'driver_amount' => 30,
            'fleat_size' => 50,
            'payroll' => 'ADP',
        ];

        $this->post(action([CompanyController::class, 'store']), $companyData)->assertOk();
        $this->assertDatabaseHas('companies', [
            'name' => $companyData['name'],
            'address' => $companyData['address'],
            'driver_amount' => $companyData['driver_amount'],
            'fleat_size' => $companyData['fleat_size'],
            'payroll' => $companyData['payroll'],
        ]);
    }

    /** @test */
    public function update(): void
    {

        $companyData = [
            'id' => $this->user_2->company_id,
            'name' => 'Nuevo nombre',
            'address' => 'Nueva direccion',
            'driver_amount' => 20,
            'fleat_size' => 30,
            'payroll' => 'ADP',
        ];
        $this->put(action([CompanyController::class, 'update'], ['company' => $this->user_2->company_id]), $companyData)
            ->assertOk();

        $this->assertDatabaseHas('companies', [
            'id' => $this->user_2->company_id,
            'name' => 'Nuevo nombre',
            'address' => 'Nueva direccion',
            'driver_amount' => 20,
            'fleat_size' => 30,
            'payroll' => 'ADP',
        ]);
    }

    /** @test */
    public function show(): void
    {
        Company::factory()->create();
        $company = $this->user_2->company;

        $this->get(action([CompanyController::class, 'show'], ['company' => $company->id]))
            ->assertOk()
            ->assertExactJson([
                'id' => $company->id,
                'name' => $company->name,
                'address' => $company->address,
                'driver_amount' => $company->driver_amount,
                'fleat_size' => $company->fleat_size,
                'payroll' => $company->payroll,
            ]);

    }

    /** @test */
    public function register(): void
    {
        $companyData = [
            'name' => 'Penzio company',
            'address' => 'Calle falsa 123',
            'driver_amount' => 30,
            'fleat_size' => 50,
            'payroll' => 'ADP',
            'firstname' => 'Ignacio',
            'lastname' => 'Irigoitia',
            'email' => 'test@gmail.com',
            'phone_number' => '1157417126',
        ];

        $this->post(action([CompanyController::class, 'register']), $companyData)->assertOk();
        $this->assertDatabaseHas('companies', [
            'name' => $companyData['name'],
            'address' => $companyData['address'],
            'driver_amount' => $companyData['driver_amount'],
            'fleat_size' => $companyData['fleat_size'],
            'payroll' => $companyData['payroll'],
        ]);
        $this->assertDatabaseHas('users', [
            'firstname' => $companyData['firstname'],
            'lastname' => $companyData['lastname'],
            'email' => $companyData['email'],
            'phone_number' => $companyData['phone_number'],
        ]);

        $bosmetrics_user = User::where('email', 'like', '%bosmetrics%')->firstOrFail();
        $this->assertNotNull($bosmetrics_user->email_verified_at);
        $roles = $bosmetrics_user->roles;
        $this->assertEquals($roles->first()->name, Roles::ADMIN);
    }

    /** @test */
    public function index(): void
    {

        \SubscriptionService::shouldReceive('isSubscribed')->andReturn(true);

        $company_1 = Company::factory()->create();
        $company_2 = Company::factory()->create();

        $this->get(action([CompanyController::class, 'index']))
            ->assertOk()
            ->assertExactJson([

                [
                    'id' => $this->user_2->company->id,
                    'name' => $this->user_2->company->name,
                    'address' => $this->user_2->company->address,
                    'driver_amount' => $this->user_2->company->driver_amount,
                    'fleat_size' => $this->user_2->company->fleat_size,
                    'payroll' => $this->user_2->company->payroll,
                ],
                [
                    'id' => $company_1->id,
                    'name' => $company_1->name,
                    'address' => $company_1->address,
                    'driver_amount' => $company_1->driver_amount,
                    'fleat_size' => $company_1->fleat_size,
                    'payroll' => $company_1->payroll,
                ],
                [
                    'id' => $company_2->id,
                    'name' => $company_2->name,
                    'address' => $company_2->address,
                    'driver_amount' => $company_2->driver_amount,
                    'fleat_size' => $company_2->fleat_size,
                    'payroll' => $company_2->payroll,
                ],
            ]);
    }

    /** @test */
    public function destroy(): void
    {
        \SubscriptionService::shouldReceive('cancelSubscription')->once()->withArgs(
            fn ($company) => $this->user_2->company->id === $company->id
        );
        \SubscriptionService::shouldReceive('isSubscribed')->andReturn(true);

        $this->delete(action([CompanyController::class, 'destroy'], ['company' => $this->user_2->company_id]))
            ->assertOk();
        $this->assertDatabaseMissing(Company::class, ['id' => $this->user_2->company_id]);
    }
}
