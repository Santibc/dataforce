<?php

namespace Src\Application\Admin\Jobsite\Data;

use Spatie\LaravelData\Data;

class UpdateJobsiteData extends Data
{
    public function __construct(
        public int $id,
        public string $name,
        public string $address_street,
        public string $state,
        public string $city,
        public string $zip_code,
        public array $users_id
    ) {}
}
