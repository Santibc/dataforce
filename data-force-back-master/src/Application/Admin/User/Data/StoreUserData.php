<?php

namespace Src\Application\Admin\User\Data;

use Spatie\LaravelData\Attributes\Validation\Unique;
use Spatie\LaravelData\Data;

class StoreUserData extends Data
{
    public function __construct(
        public string $firstname,
        public string $lastname,
        #[Unique('users', 'email')]
        public string $email,
        public ?string $password,
        public ?string $phone_number,
        public ?string $driver_amazon_id,
        public array $roles,
        public array $positions_id,
        public ?array $jobsites_id
    ) {}
}
