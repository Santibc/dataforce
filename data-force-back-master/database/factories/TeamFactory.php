<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Src\Domain\Company\Models\Company;
use Src\Domain\Document\Models\Document;
use Src\Domain\Performance\Models\Team;

class TeamFactory extends Factory
{

    protected $model = Team::class;

    public function definition()
    {
        return [
            'value' => $this->faker->name,
            'high_performers_share' => $this->faker->name,
            'low_performers_share' => $this->faker->name,
            'tenured_workforce' => $this->faker->name,
            'week' => $this->faker->randomNumber(),
            'year' => $this->faker->randomNumber(),
            'company_id' => Company::factory()->create()->id,
            'document_id' => Document::factory()->create()->id
        ];
    }

}
