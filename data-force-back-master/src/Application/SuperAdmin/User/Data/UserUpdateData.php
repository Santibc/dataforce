<?php

namespace Src\Application\SuperAdmin\User\Data;

use Illuminate\Http\Request;
use Spatie\LaravelData\Attributes\Validation\Unique;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Support\Validation\References\RouteParameterReference;

class UserUpdateData extends Data
{
    public function __construct(
        public int $id,
        public string $firstname,
        public string $lastname,
        #[Unique('users', ignore: new RouteParameterReference('user'))]
        public string $email,
        public ?string $phone_number,
        public ?string $driver_amazon_id,
        public array $roles,
        public array $positions_id,
        public ?array $jobsites_id
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            id: $request->route('user'),
            firstname: $request->firstname,
            lastname: $request->lastname,
            email: $request->email,
            phone_number: $request->phone_number,
            driver_amazon_id: $request->driver_amazon_id,
            roles: $request->roles,
            positions_id: $request->positions_id,
            jobsites_id: $request->jobsites_id
        );
    }
}
