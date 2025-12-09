<?php

namespace Src\Application\Admin\Jobsite\Data;

use Spatie\LaravelData\Data;

class StoreJobsiteData extends Data
{
    public function __construct(
        public string $name,
        public string $address_street,
        public string $state,
        public string $city,
        public string $zip_code,
        public array $users_id
    ) {}
}
