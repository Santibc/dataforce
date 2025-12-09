<?php

namespace Src\Application\Admin\Company\Data;

use Spatie\LaravelData\Attributes\Validation\Unique;
use Spatie\LaravelData\Data;

class RegisterCompanyData extends Data
{
    public function __construct(
        #[Unique('companies', 'name')]
        public string $name,
        public string $address,
        public int $driver_amount,
        public int $fleat_size,
        public string $payroll,
        public string $firstname,
        public string $lastname,
        #[Unique('users', 'email')]
        public string $email,
        public ?string $password,
        public ?string $phone_number,
    ) {}
}
