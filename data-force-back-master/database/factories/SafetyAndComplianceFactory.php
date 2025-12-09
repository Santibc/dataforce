<?php

namespace Database\Factories;

use Src\Domain\Company\Models\Company;
use Src\Domain\Document\Models\Document;
use Src\Domain\Performance\Models\SafetyAndCompliance;
use Illuminate\Database\Eloquent\Factories\Factory;

class SafetyAndComplianceFactory extends Factory
{

    protected $model = SafetyAndCompliance::class;

    public function definition()
    {
        return [
            'value' => $this->faker->name,
            'on_road_safety_score' => $this->faker->name,
            'safe_driving_metric' => $this->faker->name,
            'seatbelt_off_rate' => $this->faker->name,
            'speeding_event_rate' => $this->faker->name,
            'sign_violations_rate' => $this->faker->name,
            'distractions_rate' => $this->faker->name,
            'following_distance_rate' => $this->faker->name,
            'breach_of_contract' => $this->faker->name,
            'comprehensive_audit' => $this->faker->name,
            'working_hour_compliance' => $this->faker->name,
            'week' => $this->faker->randomNumber(),
            'year' => $this->faker->randomNumber(),
            'company_id' => Company::factory()->create()->id,
            'document_id' => Document::factory()

        ];
    }

}
