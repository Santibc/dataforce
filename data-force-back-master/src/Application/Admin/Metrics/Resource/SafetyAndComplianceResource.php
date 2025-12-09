<?php

namespace Src\Application\Admin\Metrics\Resource;

use Spatie\LaravelData\Data;

class SafetyAndComplianceResource extends Data
{
    public function __construct(
        public ?string $value,
        public ?string $on_road_safety_score,
        public ?string $safe_driving_metric,
        public ?string $seatbelt_off_rate,
        public ?string $speeding_event_rate,
        public ?string $sign_violations_rate,
        public ?string $distractions_rate,
        public ?string $following_distance_rate,
        public ?string $breach_of_contract,
        public ?string $comprehensive_audit,
        public ?string $working_hour_compliance,
        public ?int $week,
        public ?int $year,
    ) {}
}
