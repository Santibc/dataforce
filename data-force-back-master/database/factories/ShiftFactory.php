<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

use Src\Domain\Jobsite\Models\Jobsite;
use Src\Domain\Shift\Models\Shift;
use Src\Domain\User\Models\User;

class ShiftFactory extends Factory
{

    protected $model = Shift::class;
    public function definition(): array
    {
        return [
            'name'          => $this->faker->name,
            'from'          => $this->faker->dateTime,
            'to'            => $this->faker->dateTime,
            'color'         => $this->faker->hexColor,
            'published'     => false,
            'user_id'       => User::factory(),
            'jobsite_id'    => Jobsite::factory(),
        ];
    }
}
