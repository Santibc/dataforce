<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Src\Domain\Document\Models\Document;
use Src\Domain\Performance\Models\Performance;
use Src\Domain\User\Models\User;

class PerformanceFactory extends Factory
{
    protected $model = Performance::class;

    public function definition()
    {
        return [
            'fico_score' => $this->faker->randomFloat(1, 0, 1000),
            'seatbelt_off_rate' => $this->faker->randomFloat(1, 0, 1000),
            'speeding_event_ratio' => $this->faker->randomFloat(1, 0, 1000),
            'distraction_rate' => $this->faker->randomFloat(1, 0, 1000),
            'following_distance_rate' => $this->faker->randomFloat(1, 0, 1000),
            'signal_violations_rate' => $this->faker->randomFloat(1, 0, 1000),
            'overall_tier' => $this->faker->name,
            'cdf' => $this->faker->randomFloat(1, 0, 1000),
            'dcr' => $this->faker->randomFloat(1, 0, 1000),
            'pod' => $this->faker->randomFloat(1, 0, 1000),
            'cc' => $this->faker->randomFloat(1, 0, 1000),

            'delivered' => $this->faker->randomFloat(0, 0, 1000),
            'week' => $this->faker->randomFloat(0, 0, 1000),
            'year' => $this->faker->randomFloat(0, 0, 1000),
            'key_focus_area' => $this->faker->name,
            'ced' => $this->faker->randomFloat(1, 0, 1000),
            'dsb' => $this->faker->randomFloat(1, 0, 1000),
            'swc_pod' => $this->faker->randomFloat(1, 0, 1000),
            'swc_cc' => $this->faker->randomFloat(1, 0, 1000),
            'swc_ad' => $this->faker->randomFloat(1, 0, 1000),
            'dsb_dnr' => $this->faker->randomFloat(1, 0, 1000),

            'driver_amazon_id' => User::factory()->create(['driver_amazon_id' => 'ABC123'])->driver_amazon_id,
            'document_id' => Document::factory()
        ];
    }
}
