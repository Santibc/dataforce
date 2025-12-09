<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Src\Domain\Company\Models\Company;
use Src\Domain\Document\Models\Document;
use Src\Domain\Performance\Models\PickupQuality;

class PickupQualityFactory extends Factory
{
    protected $model = PickupQuality::class;

    public function definition()
    {
        return [
            'value' => $this->faker->name,
            'pickup_success_behavior' => $this->faker->sentence(),
            'week' => $this->faker->randomNumber(),
            'year' => $this->faker->randomNumber(),
            'company_id' => Company::factory()->create()->id,
            'document_id' => Document::factory()->create()->id
        ];
    }
}
