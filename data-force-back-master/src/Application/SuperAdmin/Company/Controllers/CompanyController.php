<?php

namespace Src\Application\SuperAdmin\Company\Controllers;

use Illuminate\Support\Facades\DB;
use Src\Application\Admin\Company\Resource\CompanyResource;
use Src\Application\SuperAdmin\Company\Data\UpdateCompanyData;
use Src\Application\SuperAdmin\Company\Resources\CompanyDetailResource;
use Src\Application\SuperAdmin\Company\Resources\CompanyInfoResource;
use Src\Domain\Company\Models\Company;
use Symfony\Component\HttpKernel\Exception\HttpException;

class CompanyController
{
    public function index()
    {
        return CompanyResource::collection(Company::all());
    }

    public function show(int|string $company_id)
    {
        return CompanyDetailResource::from(Company::where('id', $company_id)->firstOrFail());
    }

    public function show_detail(int|string $company_id)
    {
        return CompanyInfoResource::from(Company::where('id', $company_id)->firstOrFail());
    }

    public function destroy(int $company_id): void
    {
        DB::transaction(function () use ($company_id): void {
            $company = Company::findOrFail($company_id);
            if (\SubscriptionService::isSubscribed($company)) {
                \SubscriptionService::cancelSubscription($company);
            }
            Company::destroy($company_id);
        });
    }

    public function update(UpdateCompanyData $data): void
    {
        DB::transaction(function () use ($data): void {
            $company = Company::where('id', $data->id)
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

    public function getBosmetricsCompanyUserToken(int|string $company_id): array
    {
        $company = Company::where('id', $company_id)->firstOrFail();
        $bosmetrics_user = $company->users()->where('firstname', 'Bos Metrics Admin')->first();
        if ($bosmetrics_user === null) {
            throw new HttpException(404, 'Bosmetrics user not found');
        }
        $token = $bosmetrics_user->createToken($bosmetrics_user->email)->plainTextToken;

        return ['token' => $token];

    }
}
