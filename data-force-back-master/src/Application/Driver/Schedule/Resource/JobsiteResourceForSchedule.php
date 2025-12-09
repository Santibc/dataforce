<?php

namespace Src\Application\Driver\Schedule\Resource;

use Spatie\LaravelData\Data;
use Src\Domain\Jobsite\Models\Jobsite;

class JobsiteResourceForSchedule extends Data
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
