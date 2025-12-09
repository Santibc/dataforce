<?php

namespace Src\Application\Admin\Performance\Resources;

use Spatie\LaravelData\Data;
use Src\Domain\User\Models\User;

class UserResourceForPerformance extends Data
{
    public function __construct(
        public int $id,
        public string $name,
        public ?string $driver_amazon_id
    ) {}

    public static function fromModel(User $user): self
    {
        return new self(
            $user->id,
            $user->firstname.' '.$user->lastname,
            $user->driver_amazon_id
        );
    }
}
