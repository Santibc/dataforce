<?php

namespace Src\Application\Admin\User\Controllers;

use Src\Application\Admin\User\Data\StoreUserData;
use Src\Application\Admin\User\Data\UpdateUserData;
use Src\Application\Admin\User\Resources\UserResource;
use Src\Auth\Notifications\SetPasswordNotification;
use Src\Auth\Notifications\WelcomeUserNotification;
use Src\Domain\Company\Models\Company;
use Src\Domain\Jobsite\Models\Jobsite;
use Src\Domain\Position\Models\Position;
use Src\Domain\User\Models\User;

class UserController
{
    public function store(StoreUserData $data): void
    {
        \DB::transaction(function () use ($data): void {
            $user_search = User::currentCompany()->where('driver_amazon_id', $data->driver_amazon_id)->first();
            if ($user_search == null) {
                $user = User::create(
                    [
                        'firstname' => $data->firstname,
                        'lastname' => $data->lastname,
                        'email' => $data->email,
                        'password' => '1',
                        'phone_number' => $data->phone_number,
                        'driver_amazon_id' => $data->driver_amazon_id,
                        'company_id' => auth()->user()->company_id,
                    ]
                );

                $positions = Position::currentCompany()->findOrFail($data->positions_id);
                $user->positions()->attach($positions);
                if ($data->jobsites_id) {
                    $jobsites = Jobsite::findOrFail($data->jobsites_id);
                    $user->jobsites()->attach($jobsites);
                }

                $user->notify(new SetPasswordNotification);
                $user->notify(new WelcomeUserNotification(
                    $user->firstname.' '.$user->lastname,
                    Company::findOrFail(auth()->user()->company_id)->name
                ));

                $user->assignRole($data->roles);

                \SubscriptionService::updateSeats($user->company, User::currentCompany()->whereIsNotBosmetricUser()->count());

            }
        });
    }

    public function update(UpdateUserData $data): void
    {
        \DB::transaction(function () use ($data): void {
            $user = User::currentCompany()->findOrFail($data->id);
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
            $user = User::currentCompany()
                ->where('id', $user_id)->firstOrFail();
            $company = $user->company;
            $user->delete();
            \SubscriptionService::updateSeats($company, User::currentCompany()->whereIsNotBosmetricUser()->count());
        });
    }

    public function show(int|string $user_id): UserResource
    {
        $user_id = $user_id === 'me' ? auth()->user()->id : $user_id;

        $user = User::currentCompany()->findOrFail($user_id);

        return new UserResource($user);
    }

    public function index(): \Illuminate\Http\Resources\Json\AnonymousResourceCollection
    {

        $users = User::currentCompany()
            ->whereIsNotBosmetricUser()
            ->get();

        return UserResource::collection($users);
    }
}
