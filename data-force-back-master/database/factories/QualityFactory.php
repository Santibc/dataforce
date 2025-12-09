<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Src\Domain\Document\Models\Document;
use Src\Domain\Performance\Models\Quality;
use Src\Domain\Company\Models\Company;

class QualityFactory extends Factory
{

    protected $model = Quality::class;

    public function definition()
    {
        return [
            'value' => $this->faker->name,
            'customer_delivery_experience' => $this->faker->name,
            'customer_escalation_defect' => $this->faker->name,
            'customer_delivery_feedback' => $this->faker->name,
            'delivery_completion_rate' => $this->faker->name,
            'delivered_and_received' => $this->faker->name,
            'standard_work_compliance' => $this->faker->name,
            'photo_on_delivery' => $this->faker->name,
            'contact_compliance' => $this->faker->name,
            'attended_delivery_accuracy' => $this->faker->name,
            'week' => $this->faker->randomNumber(),
            'year' => $this->faker->randomNumber(),
            'company_id' => Company::factory()->create()->id,
            'document_id' => Document::factory()
        ];
    }

}
