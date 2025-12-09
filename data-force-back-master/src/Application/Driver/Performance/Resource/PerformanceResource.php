<?php

namespace Src\Application\Driver\Performance\Resource;

use Spatie\LaravelData\Data;

class PerformanceResource extends Data
{
    public function __construct(
        public int $id,
        public ?string $fico_score,
        public ?string $seatbelt_off_rate,
        public ?string $speeding_event_ratio,
        public ?string $distraction_rate,
        public ?string $following_distance_rate,
        public ?string $signal_violations_rate,
        public ?string $cdf,
        public ?string $dcr,
        public ?string $pod,
        public ?string $cc,
    ) {}
}
