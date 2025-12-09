<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Src\Domain\Preferences\Models\Preference;
use Src\Domain\User\Models\User;

class PreferenceFactory extends Factory
{

    protected $model = Preference::class;

    public function definition()
    {
        return [
            'date'      => $this->faker->dateTime,
            'user_id'   => fn() => User::factory()->create()->id,
            'available' => false
        ];
    }

}
