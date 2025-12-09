<?php

namespace Src\Application\SuperAdmin\User\Controllers;

use Src\Application\SuperAdmin\User\Data\UserUpdateData;
use Src\Application\SuperAdmin\User\Resource\UserResource;
use Src\Domain\User\Models\User;

class UserController
{
    public function update(UserUpdateData $data): void
    {
        \DB::transaction(function () use ($data): void {
            $user = User::findOrFail($data->id);
            $user->update(
                [
                    'firstname' => $data->firstname,
                    'lastname' => $data->lastname,
                    'email' => $data->email,
                    'phone_number' => $data->phone_number,
                    'driver_amazon_id' => $data->driver_amazon_id,
                ]
            );
            $user->roles()->detach();
            $user->assignRole($data->roles);

            $user->positions()->sync($data->positions_id);
            $user->jobsites()->sync($data->jobsites_id);
        });

    }

    public function destroy(int $user_id): void
    {
        \DB::transaction(function () use ($user_id): void {
            $user = User::where('id', $user_id)->first();
            $company = $user->company;
            $user->delete();
            \SubscriptionService::updateSeats($company, User::where('company_id', $company->id)->whereIsNotBosmetricUser()->count());
        });
    }

    public function show(int|string $user_id): UserResource
    {
        $user = User::findOrFail($user_id);

        return new UserResource($user);
    }
}
