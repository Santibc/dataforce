<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Src\Domain\Company\Models\Company;
use Src\Domain\Document\Models\Document;
use Src\Domain\Performance\Models\OverallStanding;

class OverallStandingFactory extends Factory
{
    protected $model = OverallStanding::class;

    public function definition()
    {
        return [
            'value' => $this->faker->name,
            'week' => $this->faker->randomNumber(),
            'year' => $this->faker->randomNumber(),
            'company_id' => Company::factory()->create()->id,
            'document_id' => Document::factory()->create()->id
        ];
    }
}
