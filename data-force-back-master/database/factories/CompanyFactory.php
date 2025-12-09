<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Src\Domain\Company\Models\Company;

class CompanyFactory extends Factory
{
    protected $model = Company::class;

    public function definition()
    {
        return [
            'name'  => $this->faker->name,
            'address' => $this->faker->address,
            'driver_amount' => $this->faker->randomFloat(0, 0, 100),
            'fleat_size' => $this->faker->randomFloat(0, 0, 100),
            'payroll' => 'ADP',
        ];
    }
}
