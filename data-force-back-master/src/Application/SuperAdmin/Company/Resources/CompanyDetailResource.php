<?php

namespace Src\Application\SuperAdmin\Company\Resources;

use Spatie\LaravelData\Data;
use Src\Domain\Company\Models\Company;

class CompanyDetailResource extends Data
{
    public function __construct(
        public int $id,
        public string $name,
        public string $address,
        public int $driver_amount,
        public int $fleat_size,
        public string $payroll,
        public array $jobsites,
        public array $users,
        public array $positions,
        public bool $subscribed
    ) {}

    public static function fromModel(Company $company): self
    {
        return new self(
            $company->id,
            $company->name,
            $company->address,
            $company->driver_amount,
            $company->fleat_size,
            $company->payroll,
            $company->jobsites->map(fn ($j) => [
                'id' => $j->id,
                'name' => $j->name,
                'address_street' => $j->address_street,
                'state' => $j->state,
                'city' => $j->city,
                'zip_code' => $j->zip_code,
            ])->toArray(),
            $company->users->map(fn ($u) => [
                'id' => $u->id,
                'firstname' => $u->firstname,
                'lastname' => $u->lastname,
                'email' => $u->email,
                'phone_number' => $u->phone_number,
                'driver_amazon_id' => $u->driver_amazon_id,
                'roles' => $u->roles,
            ])->toArray(),
            $company->positions->map(fn ($p) => [
                'id' => $p->id,
                'name' => $p->name,
                'from' => $p->from,
                'color' => $p->color,
                'to' => $p->to,
            ])->toArray(),
            $company->subscribed('default')
        );
    }
}
