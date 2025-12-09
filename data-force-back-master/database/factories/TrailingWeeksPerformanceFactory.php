<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Src\Domain\Document\Models\Document;
use Src\Domain\Performance\Models\TrailingWeeksPerformance;
use Src\Domain\User\Models\User;

class TrailingWeeksPerformanceFactory extends Factory
{
    protected $model = TrailingWeeksPerformance::class;

    public function definition()
    {
        return [
            'driver_amazon_id' => User::factory()->create(['driver_amazon_id' => 'ABC123'])->driver_amazon_id,
            'year' => $this->faker->year(),
            'week' => $this->faker->randomNumber(),

            'fico_score' => $this->faker->text(5),
            'seatbelt_off_rate' => $this->faker->text(5),
            'speeding_event_ratio' => $this->faker->text(5),
            'distraction_rate' => $this->faker->text(5),
            'following_distance_rate' => $this->faker->text(5),
            'signal_violations_rate' => $this->faker->text(5),

            'cdf' => $this->faker->text(5),
            'dcr' => $this->faker->text(5),
            'dsb' => $this->faker->text(5),
            'swc_pod' => $this->faker->text(5),
            'swc_cc' => $this->faker->text(5),
            'swc_ad' => $this->faker->text(5),

            'performer_status' => $this->faker->randomElement($array = array ('High Performer','Low Performer','Normal Performer')),
            'weeks_fantastic' => $this->faker->randomNumber(),
            'weeks_great' => $this->faker->randomNumber(),
            'weeks_fair' => $this->faker->randomNumber(),
            'weeks_poor' => $this->faker->randomNumber(),
            'document_id' => Document::factory()

        ];
    }
}
