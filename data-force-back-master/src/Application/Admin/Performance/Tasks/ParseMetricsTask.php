<?php

namespace Src\Application\Admin\Performance\Tasks;

use Illuminate\Support\Collection;
use Src\Domain\Performance\Models\OverallStanding;
use Src\Domain\Performance\Models\Quality;
use Src\Domain\Performance\Models\SafetyAndCompliance;
use Src\Domain\Performance\Models\Team;

class ParseMetricsTask
{
    public static function handle(Collection $prediction, int $week, int $year, int $document_id): void
    {
        $tables = $prediction->filter(fn ($p) => array_key_exists('cells', $p));
        $safety = new SafetyAndCompliance;
        $quality = new Quality;
        $team = new Team;
        $overallStanding = new OverallStanding;

        $safetyDict = collect([
            'Safe Driving Metric' => 'safe_driving_metric',
            'Seatbelt - Off Rate' => 'seatbelt_off_rate',
            'Speeding Event Rate' => 'speeding_event_rate',
            'Signal Violations Rate' => 'sign_violations_rate',
            'Distractions Rate' => 'distractions_rate',
            'Following Distance Rate' => 'following_distance_rate',
            'Breach of Contract' => 'breach_of_contract',
            'Comprehensive Audit' => 'comprehensive_audit',
            'Working Hour Compliance' => 'working_hour_compliance',
        ]);
        $qualityDict = collect([
            'Delivery Completion Rate' => 'delivery_completion_rate',
            'Delivery Success Behaviors' => 'delivered_and_received',
            'Standard Work Compliance' => 'standard_work_compliance',
            'Photo - On - Delivery' => 'photo_on_delivery',
            'Contact Compliance' => 'contact_compliance',
            'Attended Delivery Accuracy' => 'attended_delivery_accuracy',
            'Customer Escalation Defect' => 'customer_escalation_defect',
            'Customer Delivery Feedback' => 'customer_delivery_feedback',
        ]);
        $teamDict = collect([
            'High Performers Share' => 'high_performers_share',
            'Low Performers Share' => 'low_performers_share',
            'Tenured Workforce' => 'tenured_workforce',
        ]);
        $tables->each(function ($table) use (&$safety, &$quality, &$team, $safetyDict, $qualityDict, $teamDict): void {
            collect($table['cells'])->groupBy('row')->each(function ($columns) use (&$safety, &$quality, &$team, $safetyDict, $qualityDict, $teamDict): void {

                $key = $safetyDict->first(fn (string $x, string $key) => str_contains($columns[0]['text'], $key));
                if ($key) {
                    $safety[$key] = $columns[1]['text'];

                    return;
                }
                $key = $qualityDict->first(fn (string $x, string $key) => str_contains($columns[0]['text'], $key));
                if ($key) {
                    $quality[$key] = $columns[1]['text'];

                    return;
                }

                $key = $qualityDict->first(fn (string $x, string $key) => isset($columns[2]) && str_contains($columns[2]['text'], $key));
                if ($key) {
                    $quality[$key] = $columns[3]['text'];

                    return;
                }

                $key = $teamDict->first(fn (string $x, string $key) => str_contains($columns[0]['text'], $key));
                if ($key) {
                    $team[$key] = $columns[1]['text'];

                    return;
                }

                $key = $teamDict->first(fn (string $x, string $key) => isset($columns[2]) && str_contains($columns[2]['text'], $key));
                if ($key) {
                    $quality[$key] = $columns[3]['text'];

                    return;
                }
            });

        });

        $company_id = auth()->user()->company_id;

        $safetyValue = $prediction->firstWhere('label', '=', 'Safety_and_compliance');
        $safety->value = $safetyValue['ocr_text'] ?? null;
        $safety->week = $week;
        $safety->year = $year;
        $safety->company_id = $company_id;
        $safety->document_id = $document_id;
        $safety->save();

        $qualityValue = $prediction->firstWhere('label', '=', 'Quality');
        $quality->value = $qualityValue['ocr_text'] ?? null;
        $customer_delivery_experience = $prediction->firstWhere('label', '=', 'Customer_delivery_experience');
        $quality->customer_delivery_experience = $customer_delivery_experience['ocr_text'] ?? null;
        $quality->week = $week;
        $quality->year = $year;
        $quality->company_id = $company_id;
        $quality->document_id = $document_id;
        $quality->save();

        $teamValue = $prediction->firstWhere('label', '=', 'Team');
        $team->value = $teamValue['ocr_text'] ?? null;
        $team->week = $week;
        $team->year = $year;
        $team->company_id = $company_id;
        $team->document_id = $document_id;
        $team->save();

        $overallStandingValue = $prediction->firstWhere('label', '=', 'Overall_standing');
        $overallStanding->value = $overallStandingValue['ocr_text'] ?? null;
        $overallStanding->week = $week;
        $overallStanding->year = $year;
        $overallStanding->company_id = $company_id;
        $overallStanding->document_id = $document_id;
        $overallStanding->save();
    }
}
