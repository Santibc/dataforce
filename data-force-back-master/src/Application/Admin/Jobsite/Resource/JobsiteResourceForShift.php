<?php

namespace Src\Application\Admin\Jobsite\Resource;

use Spatie\LaravelData\Data;
use Src\Domain\Jobsite\Models\Jobsite;

class JobsiteResourceForShift extends Data
{
    public function __construct(
        public int $id,
        public string $name,
        public string $address_street,
        public string $state,
        public string $city,
        public string $zip_code,
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
        );
    }
}
