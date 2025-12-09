<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Src\Domain\Company\Models\Company;
use Src\Domain\Position\Models\Position;

class PositionFactory extends Factory
{

    protected $model = Position::class;

    public function definition()
    {
        return [
            'name'       => $this->faker->name,
            'from'       => $this->faker->dateTime,
            'to'         => $this->faker->dateTime,
            'color'      => $this->faker->hexColor,
            'company_id' => Company::factory()->create()->id

        ];
    }

}
