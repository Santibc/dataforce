<?php

namespace Src\Application\Admin\Metrics\Resource;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

class GetMetricsResource extends Data
{
    public function __construct(
        public array $best_drivers,
        public array $worst_drivers,
        public array $below_standard,
        #[DataCollectionOf(SafetyAndComplianceResource::class)]
        public ?SafetyAndComplianceResource $safetys,
        #[DataCollectionOf(QualityResource::class)]
        public ?QualityResource $qualitys,
        #[DataCollectionOf(TeamResource::class)]
        public ?TeamResource $teams,
        #[DataCollectionOf(OverallStandingResource::class)]
        public ?OverallStandingResource $overall_standings,
    ) {}

    public static function fromModel(
        $best_drivers,
        $worst_drivers,
        $below_standard,
        $safetys,
        $quality,
        $team,
        $overall_standings,
    ): self {
        return new self(
            $best_drivers->map(fn ($p) => [
                'id' => $p->id,
                'driver_amazon_id' => $p->driver_amazon_id,
                'overall_tier' => $p->overall_tier,
                'fico_score' => $p->fico_score,
                'seatbelt_off_rate' => $p->seatbelt_off_rate,
                'speeding_event_ratio' => $p->speeding_event_ratio,
                'distraction_rate' => $p->distraction_rate,
                'following_distance_rate' => $p->following_distance_rate,
                'signal_violations_rate' => $p->signal_violations_rate,
                'cdf' => $p->cdf,
                'dcr' => $p->dcr,
                'pod' => $p->swc_pod,
                'psb' => $p->psb,
                'cc' => $p->swc_cc,
                'cc_o' => $p->cc,
                'ced' => $p->ced,
                'swc_ad' => $p->swc_ad,
                'dsb_dnr' => $p->dsb_dnr,
                'week' => $p->week,
                'year' => $p->year,
                'user_name' => $p->user->firstname.' '.$p->user->lastname,
                'user_id' => $p->user->id,
                'user_email' => $p->user->email,
            ])->toArray(),
            $worst_drivers->map(fn ($p) => [
                'id' => $p->id,
                'driver_amazon_id' => $p->driver_amazon_id,
                'overall_tier' => $p->overall_tier,
                'fico_score' => $p->fico_score,
                'seatbelt_off_rate' => $p->seatbelt_off_rate,
                'speeding_event_ratio' => $p->speeding_event_ratio,
                'distraction_rate' => $p->distraction_rate,
                'following_distance_rate' => $p->following_distance_rate,
                'signal_violations_rate' => $p->signal_violations_rate,
                'cdf' => $p->cdf,
                'dcr' => $p->dcr,
                'pod' => $p->swc_pod,
                'psb' => $p->psb,
                'cc' => $p->swc_cc,
                'cc_o' => $p->cc,
                'ced' => $p->ced,
                'swc_ad' => $p->swc_ad,
                'dsb_dnr' => $p->dsb_dnr,
                'week' => $p->week,
                'year' => $p->year,
                'user_name' => $p->user->firstname.' '.$p->user->lastname,
                'user_id' => $p->user->id,
                'user_email' => $p->user->email,
            ])->toArray(),
            $below_standard->map(fn ($p) => [
                'id' => $p->id,
                'driver_amazon_id' => $p->driver_amazon_id,
                'week' => $p->week,
                'year' => $p->year,
                'fico_score' => $p->fico_score,
                'seatbelt_off_rate' => $p->seatbelt_off_rate,
                'speeding_event_ratio' => $p->speeding_event_ratio,
                'distraction_rate' => $p->distraction_rate,
                'following_distance_rate' => $p->following_distance_rate,
                'signal_violations_rate' => $p->signal_violations_rate,
                'cdf' => $p->cdf,
                'dcr' => $p->dcr,
                'dsb' => $p->dsb,
                'swc_pod' => $p->swc_pod,
                'psb' => $p->psb,
                'swc_cc' => $p->swc_cc,
                'swc_ad' => $p->swc_ad,
                'performer_status' => $p->performer_status,
                'weeks_fantastic' => $p->weeks_fantastic,
                'weeks_great' => $p->weeks_great,
                'weeks_fair' => $p->weeks_fair,
                'weeks_poor' => $p->weeks_poor,
                'user_name' => $p->user->firstname.' '.$p->user->lastname,
                'user_id' => $p->user->id,
                'user_email' => $p->user->email,
            ])->toArray(),
            $safetys === null ? [] : SafetyAndComplianceResource::collection($safetys)->first(),
            $quality === null ? [] : QualityResource::collection($quality)->first(),
            $team === null ? [] : TeamResource::collection($team)->first(),
            $overall_standings === null ? [] : OverallStandingResource::collection($overall_standings)->first(),
        );
    }
}
