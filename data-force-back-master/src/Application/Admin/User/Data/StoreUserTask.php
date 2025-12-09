<?php

namespace Src\Application\Admin\User\Data;

use Illuminate\Support\Collection;
use Src\Auth\Notifications\SetPasswordNotification;
use Src\Domain\User\Models\User;

class StoreUserTask
{
    public static function run(
        string $firstname,
        string $lastname,
        string $email,
        string $phone_number,
        string $driver_amazon_id,
        string $position_name,
        string $jobsite_name,
        string $rol,
        Collection $jobsites,
        Collection $positions,
    ): Collection {
        $not_found = collect([]);

        try {
            $user_search = User::currentCompany()->where('driver_amazon_id', $driver_amazon_id)->first();
            if ($user_search === null) {
                $user = User::create([
                    'firstname' => $firstname,
                    'lastname' => $lastname,
                    'email' => $email,
                    'password' => '1',
                    'phone_number' => $phone_number,
                    'driver_amazon_id' => $driver_amazon_id,
                    'company_id' => auth()->user()->company_id,
                ]);

                $position = $positions->first(fn ($pos) => strtolower(trim($pos->name)) === strtolower(trim($position_name)));
                if ($position == null) {
                    $not_found->push($position_name.' is not a position');
                } else {
                    $user->positions()->attach($position->id);
                }

                $jobsite = $jobsites->first(fn ($job) => strtolower(trim($job->name)) === strtolower(trim($jobsite_name)));
                if ($jobsite == null) {
                    $not_found->push($jobsite_name.' is not a jobsite');
                } else {
                    $user->jobsites()->attach($jobsite->id);
                }

                $user->assignRole($rol);
                $user->notify(new SetPasswordNotification);

                return $not_found;
            }

            return $not_found;
        } catch (\Exception $e) {
            //            if(\Str::contains($e->getMessage(), 'users.users_email_unique')){
            //                $not_found->push('Email  already taken');
            //            } else {
            //                $not_found->push('Driver Amazon Id already taken');
            //            }
            return $not_found->push($e->getMessage());
        }
    }
}
