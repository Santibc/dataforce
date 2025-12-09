<?php

namespace Src\Application\Admin\Company\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Src\Application\Admin\Company\Data\RegisterCompanyData;
use Src\Application\Admin\Company\Data\StoreCompanyData;
use Src\Application\Admin\Company\Data\UpdateCompanyData;
use Src\Application\Admin\Company\Notifications\WelcomeCompanyNotification;
use Src\Application\Admin\Company\Resource\CompanyResource;
use Src\Auth\Notifications\SetPasswordNotification;
use Src\Domain\Company\Models\Company;
use Src\Domain\Position\Models\Position;
use Src\Domain\User\Enums\Roles;
use Src\Domain\User\Models\User;

class CompanyController
{
    public function store(StoreCompanyData $data): void
    {
        DB::transaction(function () use ($data): void {
            Company::create(
                [
                    'name' => $data->name,
                    'address' => $data->address,
                    'driver_amount' => $data->driver_amount,
                    'fleat_size' => $data->fleat_size,
                    'payroll' => $data->payroll,
                ]
            );
        });
    }

    public function update(UpdateCompanyData $data): void
    {
        DB::transaction(function () use ($data): void {
            $company = Company::where('id', $data->id)
                ->where('id', auth()->user()->company_id)
                ->firstOrFail();

            $company->update(
                [
                    'name' => $data->name,
                    'address' => $data->address,
                    'driver_amount' => $data->driver_amount,
                    'fleat_size' => $data->fleat_size,
                    'payroll' => $data->payroll,
                ]
            );
        });
    }

    public function show(int $company_id)
    {
        return CompanyResource::from(Company::where('id', $company_id)
            ->where('id', auth()->user()->company_id)
            ->firstOrFail());
    }

    public function index()
    {
        return CompanyResource::collection(Company::all());
    }

    public function destroy(int $company_id): void
    {
        DB::transaction(function () use ($company_id): void {
            if ($company_id !== auth()->user()->company_id) {
                throw new \Illuminate\Auth\Access\AuthorizationException('Server Error.');
            }
            $company = Company::findOrFail($company_id);
            if (\SubscriptionService::isSubscribed($company)) {
                \SubscriptionService::cancelSubscription($company);
            }
            Company::destroy($company->id);
        });
    }

    public function register(RegisterCompanyData $data): void
    {
        DB::transaction(function () use ($data): void {
            $company = Company::create(
                [
                    'name' => $data->name,
                    'address' => $data->address,
                    'driver_amount' => $data->driver_amount,
                    'fleat_size' => $data->fleat_size,
                    'payroll' => $data->payroll,
                ]
            );

            $position = Position::create(
                [
                    'name' => 'Owner',
                    'from' => '2024-02-05T09:00:00.000Z',
                    'to' => '2024-02-05T18:00:00.000Z',
                    'color' => '#abb8c3',
                    'company_id' => $company->id,
                ]
            );

            $user = User::create(
                [
                    'firstname' => $data->firstname,
                    'lastname' => $data->lastname,
                    'email' => $data->email,
                    'password' => '1',
                    'phone_number' => $data->phone_number,
                    'driver_amazon_id' => 'Owner '.$company->name.' '.$company->id,
                    'company_id' => $company->id,
                ]
            );
            $user->positions()->attach($position);
            $user->notify(new SetPasswordNotification);
            $user->notify(new WelcomeCompanyNotification($user->firstname.' '.$user->lastname));

            $user->assignRole([Roles::OWNER, Roles::ADMIN]);

            $user_bos = User::create(
                [
                    'firstname' => 'Bos Metrics Admin',
                    'lastname' => 'LLC',
                    'email' => str_replace(' ', '_', strtolower($data->name)).'@bosmetricsadmin.com',
                    'password' => Hash::make('admin1234'),
                    'phone_number' => $data->phone_number,
                    'driver_amazon_id' => 'Vic '.$company->name.' '.$company->id,
                    'company_id' => $company->id,
                ]
            );
            $user_bos->positions()->attach($position);
            $user_bos->assignRole([Roles::ADMIN]);

            $user_bos->email_verified_at = now();
            $user_bos->save();

        });
    }
}
