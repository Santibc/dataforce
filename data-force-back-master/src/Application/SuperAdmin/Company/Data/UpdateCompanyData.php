<?php

namespace Src\Application\SuperAdmin\Company\Data;

use Spatie\LaravelData\Data;

class UpdateCompanyData extends Data
{
    public function __construct(
        public string $name,
        public int $id,
        public string $address,
        public int $driver_amount,
        public int $fleat_size,
        public string $payroll,
    ) {}
}
