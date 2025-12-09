<?php

namespace Database\Factories;
use Illuminate\Database\Eloquent\Factories\Factory;
use Src\Domain\Coaching\Models\Coaching;
use Src\Domain\User\Models\User;

class CoachingFactory extends Factory
{

    protected $model = Coaching::class;

    public function definition()
    {
        return [
            'subject' => $this->faker->name,
            'year' => 2023,
            'week' => 20,
            'category' => $this->faker->name,
            'content' => $this->faker->name,
            'user_id' => User::factory()->create()->id,
            'type'  => 'coach',
            'read' => false
        ];
    }

}
