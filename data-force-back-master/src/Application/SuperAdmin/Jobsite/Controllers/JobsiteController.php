<?php

namespace Src\Application\SuperAdmin\Jobsite\Controllers;

use Illuminate\Support\Facades\DB;
use Src\Application\SuperAdmin\Jobsite\Data\UpdateJobsiteData;
use Src\Application\SuperAdmin\Jobsite\Resource\JobsiteResource;
use Src\Domain\Jobsite\Models\Jobsite;
use Src\Domain\Jobsite\Scopes\JobsiteCompanyScope;

class JobsiteController
{
    public function update(UpdateJobsiteData $data): void
    {
        DB::transaction(function () use ($data): void {
            $jobsite = Jobsite::withoutGlobalScope(JobsiteCompanyScope::class)->findOrFail($data->id);
            $jobsite->update(
                [
                    'name' => $data->name,
                    'address_street' => $data->address_street,
                    'city' => $data->city,
                    'state' => $data->state,
                    'zip_code' => $data->zip_code,
                ]
            );

            $jobsite->users()->sync($data->users_id);
        });
    }

    public function destroy(int $jobsite_id): void
    {
        DB::transaction(fn () => Jobsite::withoutGlobalScope(JobsiteCompanyScope::class)->where('id', $jobsite_id)->delete()
        );
    }

    public function show(int $jobsite_id)
    {
        return JobsiteResource::from(Jobsite::withoutGlobalScope(JobsiteCompanyScope::class)->findOrFail($jobsite_id));
    }
}
