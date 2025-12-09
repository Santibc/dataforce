<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Src\Domain\Performance\Models\Performance;
use Src\Domain\Performance\Models\Quality;
use Src\Domain\Performance\Models\SafetyAndCompliance;
use Src\Domain\Performance\Models\Team;

class CreatePerformanceAppSeeder extends Seeder
{

    public function run(): void
    {

        Performance::factory()->create([
            'driver_amazon_id' => 3,
            'week' => 7,
            'year' => 2024,
            'fico_score' => 840,
            'seatbelt_off_rate' => 0.0,
            'speeding_event_ratio' => 0.0,
            'distraction_rate' => 0.0,
            'following_distance_rate' => 0.0,
            'signal_violations_rate' => 0.0,
            'cdf' => 100,
            'dcr' => 99.6,
            'pod' => 99.7,
            'cc' => 100
        ]);
        Performance::factory()->create([
            'driver_amazon_id' => 3,
            'week' => 8,
            'year' => 2024,
            'fico_score' => 840,
            'seatbelt_off_rate' => 0.0,
            'speeding_event_ratio' => 0.0,
            'distraction_rate' => 0.0,
            'following_distance_rate' => 0.0,
            'signal_violations_rate' => 0.0,
            'cdf' => 100,
            'dcr' => 99.6,
            'pod' => 99.7,
            'cc' => 100
        ]);

        SafetyAndCompliance::factory()->create([
            'company_id' => 3,
            'week' => 7,
            'year' => 2024,
            'value' => 'Fantastic',
            'on_road_safety_score' => 'Fantastic',
            'safe_driving_metric' => '809 | Fantastic',
            'seatbelt_off_rate' => '2.2 events per 100 trips | Fantastic',
            'speeding_event_rate' => '1.1 events per 100 trips | Fantastic',
            'sign_violations_rate' => '6.6 events per 100 trips | Fantastic',
            'distractions_rate' => '0.0 events per 100 trips | Fantastic',
            'following_distance_rate' => '1.1 events per 100 trips | Fantastic',
            'breach_of_contract' => 'Compliant',
            'comprehensive_audit' => 'Compliant',
            'working_hour_compliance' => '100.0% | Fantastic',
        ]);
        Quality::factory()->create([
            'company_id' => 3,
            'week' => 7,
            'year' => 2024,
            'value' => 'Great',
            'customer_delivery_experience' => 'Great',
            'customer_escalation_defect' => '0 | Fantastic',
            'customer_delivery_feedback' => '93.02% | Poor',
            'delivery_completion_rate' => '99.60% | Fantastic',
            'delivered_and_received' => '20 | Fair',
            'standard_work_compliance' => 'Fantastic',
            'photo_on_delivery' => '99.33% | Fantastic',
            'contact_compliance' => '99.69% | Fantastic',
            'attended_delivery_accuracy' => '100.00% | Fantastic',
        ]);
        Team::factory()->create([
            'company_id' => 3,
            'week' => 7,
            'year' => 2024,
            'value' => 'Fair',
            'high_performers_share' => '57.99% | Fair',
            'low_performers_share' => '4.00% | Fair',
            'tenured_workforce' => '90.25% | Fantastic',
        ]);



    }

}
