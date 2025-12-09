<?php

namespace Tests\Application\Admin\Company\Controllers;

use Spatie\Permission\Models\Role;
use Src\Application\Admin\Company\Controllers\CompanyController;
use Src\Domain\Company\Models\Company;
use Src\Domain\User\Enums\Roles;
use Src\Domain\User\Models\User;
use Tests\TestCase;

class RegisterCompanyTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        Role::create(['name' => Roles::OWNER]);
        Role::create(['name' => Roles::SUPER_ADMIN]);
        Role::create(['name' => Roles::ADMIN]);

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
    public function register_company_with_same_email_should_error(): void
    {
        User::factory([
            'email' => 'test@gmail.com',
        ])->create();
        Company::factory()->create();

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

        $error = $this->post(action([CompanyController::class, 'register']), $companyData);

        $error->assertStatus(422);
        $this->assertEquals($error->baseResponse->original['messages'][0], 'The email has already been taken.');
    }

    /** @test */
    public function register_company_with_same_company_name_should_error(): void
    {
        Company::factory([
            'name' => 'Penzio company',
        ])->create();

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

        $error = $this->post(action([CompanyController::class, 'register']), $companyData);

        $error->assertStatus(422);
        $this->assertEquals($error->baseResponse->original['messages'][0], 'The name has already been taken.');
    }
}
