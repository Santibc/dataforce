<?php

namespace Src\Application\Admin\Performance\Resources;

use Spatie\LaravelData\Data;
use Src\Domain\User\Models\User;

class PerformanceUserResource extends Data
{
    public function __construct(
        public int $id,
        public string $name,
        public string $driver_amazon_id,
        public array $performances,
    ) {}

    public static function fromModel(User $user): self
    {
        return new self(
            $user->id,
            $user->firstname.' '.$user->lastname,
            $user->driver_amazon_id,
            $user->performance->map(fn ($p) => [
                'id' => $p->id,
                'fico_score' => $p->fico_score,
                'seatbelt_off_rate' => $p->seatbelt_off_rate,
                'speeding_event_ratio' => $p->speeding_event_ratio,
                'distraction_rate' => $p->distraction_rate,
                'following_distance_rate' => $p->following_distance_rate,
                'signal_violations_rate' => $p->signal_violations_rate,
                'cdf' => $p->cdf,
                'dcr' => $p->dcr,
                'pod' => $p->swc_pod,
                'cc' => $p->swc_cc,
                'cc_o' => $p->cc,
                'ced' => $p->ced,
                'swc_ad' => $p->swc_ad,
                'dsb_dnr' => $p->dsb_dnr,
                'overall_tier' => $p->overall_tier,
                'week' => $p->week,
                'year' => $p->year,
            ])->toArray()
        );
    }
}
