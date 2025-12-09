<?php

namespace Src\Application\Admin\User\Resources;

use Spatie\LaravelData\Data;
use Src\Domain\User\Models\User;

class UserResourceForShift extends Data
{
    public function __construct(
        public int $id,
        public string $firstname,
        public string $lastname,
        public string $email,
        public string $phone_number,
        public string $driver_amazon_id,
        public int $company_id
    ) {}

    public static function fromModel(User $user): self
    {
        return new self(
            $user->id,
            $user->firstname,
            $user->lastname,
            $user->email,
            $user->phone_number,
            $user->driver_amazon_id,
            $user->company_id,
        );
    }
}
