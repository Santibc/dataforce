<?php

namespace Src\Application\SuperAdmin\Company\Resources;

use Spatie\LaravelData\Data;

class CompanyInfoResource extends Data
{
    public function __construct(
        public int $id,
        public string $name,
        public string $address,
        public int $driver_amount,
        public int $fleat_size,
        public string $payroll,
    ) {}
}
