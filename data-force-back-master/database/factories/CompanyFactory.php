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
            // Mismos defaults que la BD, para que el modelo en memoria coincida con lo
            // que devuelve la API en los tests que comparan el JSON campo a campo.
            'overtime_threshold' => 40,
            'daily_hours_limit' => 12,
            'daily_hours_warning' => 10,
        ];
    }
}
