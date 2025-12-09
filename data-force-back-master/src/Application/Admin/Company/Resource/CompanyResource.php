<?php

namespace Src\Application\Admin\Company\Resource;

use Spatie\LaravelData\Data;

class CompanyResource extends Data
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
