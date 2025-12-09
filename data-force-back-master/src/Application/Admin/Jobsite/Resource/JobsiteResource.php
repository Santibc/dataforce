<?php

namespace Src\Application\Admin\Jobsite\Resource;

use Spatie\LaravelData\Data;
use Src\Domain\Jobsite\Models\Jobsite;

class JobsiteResource extends Data
{
    public function __construct(
        public int $id,
        public string $name,
        public string $address_street,
        public string $state,
        public string $city,
        public string $zip_code,
        public array $users
    ) {}

    public static function fromModel(Jobsite $jobsite): self
    {
        return new self(
            $jobsite->id,
            $jobsite->name,
            $jobsite->address_street,
            $jobsite->state,
            $jobsite->city,
            $jobsite->zip_code,
            $jobsite->users->map(fn ($user) => [
                'id' => $user->id,
                'firstname' => $user->firstname,
                'lastname' => $user->lastname,
                'email' => $user->email,
                'phone_number' => $user->phone_number,
                'driver_amazon_id' => $user->driver_amazon_id,
                'positions' => $user->positions->map(fn ($position) => [
                    'name' => $position->name,
                    'color' => $position->color,
                ]),
            ])->toArray()
        );
    }
}
