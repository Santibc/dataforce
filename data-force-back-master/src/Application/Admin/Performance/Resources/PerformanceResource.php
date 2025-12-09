<?php

namespace Src\Application\Admin\Performance\Resources;

use Spatie\LaravelData\Data;
use Src\Domain\Performance\Models\Performance;

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
        public ?string $overall_tier,
        public ?string $cdf,
        public ?string $dcr,
        public ?string $pod,
        public ?string $cc,
        public ?string $ced,
        public ?string $swc_ad,
        public ?string $dsb_dnr,
        public ?string $cc_o,
        public string $year,
        public string $week,
        public ?UserResourceForPerformance $user,
    ) {}

    public static function fromModel(Performance $performance): self
    {
        return new self(
            $performance->id,
            $performance->fico_score,
            $performance->seatbelt_off_rate,
            $performance->speeding_event_ratio,
            $performance->distraction_rate,
            $performance->following_distance_rate,
            $performance->signal_violations_rate,
            $performance->overall_tier,
            $performance->cdf,
            $performance->dcr,
            $performance->swc_pod,
            $performance->swc_cc,
            $performance->ced,
            $performance->swc_ad,
            $performance->dsb_dnr,
            $performance->cc,
            $performance->year,
            $performance->week,
            $performance->driver_amazon_id === null
                ? null
                : UserResourceForPerformance::fromModel($performance->user)
        );
    }
}
