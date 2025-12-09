<?php

namespace Src\Application\Admin\Jobsite\Controllers;

use Illuminate\Support\Facades\DB;
use Src\Application\Admin\Jobsite\Data\StoreJobsiteData;
use Src\Application\Admin\Jobsite\Data\UpdateJobsiteData;
use Src\Application\Admin\Jobsite\Resource\JobsiteResource;
use Src\Domain\Jobsite\Models\Jobsite;
use Src\Domain\User\Models\User;

class JobsiteController
{
    public function store(StoreJobsiteData $data): void
    {
        DB::transaction(function () use ($data): void {
            $jobsite = Jobsite::create(
                [
                    'name' => $data->name,
                    'address_street' => $data->address_street,
                    'city' => $data->city,
                    'state' => $data->state,
                    'zip_code' => $data->zip_code,
                    'company_id' => auth()->user()->company_id,
                ]
            );
            $users = User::find($data->users_id);
            $jobsite->users()->attach($users);
        });
    }

    public function update(UpdateJobsiteData $data): void
    {
        DB::transaction(function () use ($data): void {
            $jobsite = Jobsite::findOrFail($data->id);
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

    public function show(int $jobsite_id)
    {
        return JobsiteResource::from(Jobsite::findOrFail($jobsite_id));
    }

    public function index()
    {
        return JobsiteResource::collection(Jobsite::all());
    }

    public function destroy(int $jobsite_id): void
    {
        DB::transaction(fn () => Jobsite::destroy($jobsite_id));
    }
}
