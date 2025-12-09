<?php

namespace Tests\Application\Admin\Metrics\Controllers;

use Src\Application\Admin\Metrics\Controllers\MetricsController;
use Src\Domain\Performance\Models\Performance;
use Src\Domain\Performance\Models\Quality;
use Src\Domain\Performance\Models\SafetyAndCompliance;
use Src\Domain\Performance\Models\Team;
use Src\Domain\Performance\Models\TrailingWeeksPerformance;
use Src\Domain\User\Enums\Roles;
use Src\Domain\User\Models\User;
use Tests\TestCase;

class MetricsControllerTest extends TestCase
{
    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->withRole(Roles::ADMIN)->create();
        $this->actingAs($this->user);
    }

    /** @test */
    public function get_metrics(): void
    {
        $this->withoutExceptionHandling();

        $safety = SafetyAndCompliance::factory()->create([
            'company_id' => $this->user->company_id,
            'week' => 20,
            'year' => 2023,
        ]);
        $quality = Quality::factory()->create([
            'company_id' => $this->user->company_id,
            'week' => 20,
            'year' => 2023,
        ]);
        $team = Team::factory()->create([
            'company_id' => $this->user->company_id,
            'week' => 20,
            'year' => 2023,
        ]);

        $p = Performance::factory()->create([
            'driver_amazon_id' => $this->user->driver_amazon_id,
            'week' => 20,
            'year' => 2023,
        ]);

        $trailing_weeks_performance_low = TrailingWeeksPerformance::factory()->create([
            'driver_amazon_id' => $this->user->driver_amazon_id,
            'week' => 20,
            'year' => 2023,
            'performer_status' => 'Low Performer',
        ]);

        $user2 = User::factory()->create([
            'company_id' => $this->user->company_id,
        ]);

        $trailing_weeks_performance_normal = TrailingWeeksPerformance::factory()->create([
            'driver_amazon_id' => $user2->driver_amazon_id,
            'week' => 20,
            'year' => 2023,
            'performer_status' => 'Normal Performer',
        ]);

        $user3 = User::factory()->create([
            'company_id' => $this->user->company_id,
        ]);

        $trailing_weeks_performance_high = TrailingWeeksPerformance::factory()->create([
            'driver_amazon_id' => $user3->driver_amazon_id,
            'week' => 20,
            'year' => 2023,
            'performer_status' => 'High Performer',
        ]);

        $this->get(action([MetricsController::class, 'get_metrics']).'?week=20&year=2023')
            ->assertOk()
            ->assertExactJson([
                'best_drivers' => [
                    [
                        'id' => $p->id,
                        'driver_amazon_id' => $p->driver_amazon_id,
                        'overall_tier' => "$p->overall_tier",
                        'fico_score' => "$p->fico_score",
                        'seatbelt_off_rate' => "$p->seatbelt_off_rate",
                        'speeding_event_ratio' => "$p->speeding_event_ratio",
                        'distraction_rate' => "$p->distraction_rate",
                        'following_distance_rate' => "$p->following_distance_rate",
                        'signal_violations_rate' => "$p->signal_violations_rate",
                        'cdf' => "$p->cdf",
                        'dcr' => "$p->dcr",
                        'pod' => "$p->swc_pod",
                        'cc' => "$p->swc_cc",
                        'cc_o' => "$p->cc",
                        'ced' => "$p->ced",
                        'swc_ad' => "$p->swc_ad",
                        'dsb_dnr' => "$p->dsb_dnr",
                        'week' => $p->week,
                        'year' => $p->year,
                        'user_name' => $p->user->firstname.' '.$p->user->lastname,
                        'user_id' => $p->user->id,
                        'user_email' => $p->user->email,
                    ],
                ],
                'worst_drivers' => [
                    [
                        'id' => $p->id,
                        'driver_amazon_id' => $p->driver_amazon_id,
                        'overall_tier' => "$p->overall_tier",
                        'fico_score' => "$p->fico_score",
                        'seatbelt_off_rate' => "$p->seatbelt_off_rate",
                        'speeding_event_ratio' => "$p->speeding_event_ratio",
                        'distraction_rate' => "$p->distraction_rate",
                        'following_distance_rate' => "$p->following_distance_rate",
                        'signal_violations_rate' => "$p->signal_violations_rate",
                        'cdf' => "$p->cdf",
                        'dcr' => "$p->dcr",
                        'pod' => "$p->swc_pod",
                        'cc' => "$p->swc_cc",
                        'cc_o' => "$p->cc",
                        'ced' => "$p->ced",
                        'swc_ad' => "$p->swc_ad",
                        'dsb_dnr' => "$p->dsb_dnr",
                        'week' => $p->week,
                        'year' => $p->year,
                        'user_name' => $p->user->firstname.' '.$p->user->lastname,
                        'user_id' => $p->user->id,
                        'user_email' => $p->user->email,
                    ],
                ],
                'below_standard' => [
                    [
                        'id' => $trailing_weeks_performance_low->id,
                        'driver_amazon_id' => $trailing_weeks_performance_low->driver_amazon_id,
                        'week' => $trailing_weeks_performance_low->week,
                        'year' => $trailing_weeks_performance_low->year,

                        'fico_score' => $trailing_weeks_performance_low->fico_score,
                        'seatbelt_off_rate' => $trailing_weeks_performance_low->seatbelt_off_rate,
                        'speeding_event_ratio' => $trailing_weeks_performance_low->speeding_event_ratio,
                        'distraction_rate' => $trailing_weeks_performance_low->distraction_rate,
                        'following_distance_rate' => $trailing_weeks_performance_low->following_distance_rate,
                        'signal_violations_rate' => $trailing_weeks_performance_low->signal_violations_rate,

                        'cdf' => $trailing_weeks_performance_low->cdf,
                        'dcr' => $trailing_weeks_performance_low->dcr,
                        'dsb' => $trailing_weeks_performance_low->dsb,
                        'swc_pod' => $trailing_weeks_performance_low->swc_pod,
                        'swc_cc' => $trailing_weeks_performance_low->swc_cc,
                        'swc_ad' => $trailing_weeks_performance_low->swc_ad,

                        'performer_status' => $trailing_weeks_performance_low->performer_status,
                        'weeks_fantastic' => $trailing_weeks_performance_low->weeks_fantastic,
                        'weeks_great' => $trailing_weeks_performance_low->weeks_great,
                        'weeks_fair' => $trailing_weeks_performance_low->weeks_fair,
                        'weeks_poor' => $trailing_weeks_performance_low->weeks_poor,
                        'user_name' => $p->user->firstname.' '.$p->user->lastname,
                        'user_id' => $p->user->id,
                        'user_email' => $p->user->email,
                    ],
                    [
                        'id' => $trailing_weeks_performance_normal->id,
                        'driver_amazon_id' => $trailing_weeks_performance_normal->driver_amazon_id,
                        'week' => $trailing_weeks_performance_normal->week,
                        'year' => $trailing_weeks_performance_normal->year,

                        'fico_score' => $trailing_weeks_performance_normal->fico_score,
                        'seatbelt_off_rate' => $trailing_weeks_performance_normal->seatbelt_off_rate,
                        'speeding_event_ratio' => $trailing_weeks_performance_normal->speeding_event_ratio,
                        'distraction_rate' => $trailing_weeks_performance_normal->distraction_rate,
                        'following_distance_rate' => $trailing_weeks_performance_normal->following_distance_rate,
                        'signal_violations_rate' => $trailing_weeks_performance_normal->signal_violations_rate,

                        'cdf' => $trailing_weeks_performance_normal->cdf,
                        'dcr' => $trailing_weeks_performance_normal->dcr,
                        'dsb' => $trailing_weeks_performance_normal->dsb,
                        'swc_pod' => $trailing_weeks_performance_normal->swc_pod,
                        'swc_cc' => $trailing_weeks_performance_normal->swc_cc,
                        'swc_ad' => $trailing_weeks_performance_normal->swc_ad,

                        'performer_status' => $trailing_weeks_performance_normal->performer_status,
                        'weeks_fantastic' => $trailing_weeks_performance_normal->weeks_fantastic,
                        'weeks_great' => $trailing_weeks_performance_normal->weeks_great,
                        'weeks_fair' => $trailing_weeks_performance_normal->weeks_fair,
                        'weeks_poor' => $trailing_weeks_performance_normal->weeks_poor,
                        'user_name' => $trailing_weeks_performance_normal->user->firstname.' '.$trailing_weeks_performance_normal->user->lastname,
                        'user_id' => $trailing_weeks_performance_normal->user->id,
                        'user_email' => $trailing_weeks_performance_normal->user->email,
                    ],

                ],
                'safetys' => [
                    'value' => $safety->value,
                    'on_road_safety_score' => $safety->on_road_safety_score,
                    'safe_driving_metric' => $safety->safe_driving_metric,
                    'seatbelt_off_rate' => $safety->seatbelt_off_rate,
                    'speeding_event_rate' => $safety->speeding_event_rate,
                    'sign_violations_rate' => $safety->sign_violations_rate,
                    'distractions_rate' => $safety->distractions_rate,
                    'following_distance_rate' => $safety->following_distance_rate,
                    'breach_of_contract' => $safety->breach_of_contract,
                    'comprehensive_audit' => $safety->comprehensive_audit,
                    'working_hour_compliance' => $safety->working_hour_compliance,
                    'week' => $safety->week,
                    'year' => $safety->year,
                ],
                'qualitys' => [
                    'value' => $quality->value,
                    'customer_delivery_experience' => $quality->customer_delivery_experience,
                    'customer_escalation_defect' => $quality->customer_escalation_defect,
                    'customer_delivery_feedback' => $quality->customer_delivery_feedback,
                    'delivery_completion_rate' => $quality->delivery_completion_rate,
                    'delivered_and_received' => $quality->delivered_and_received,
                    'standard_work_compliance' => $quality->standard_work_compliance,
                    'photo_on_delivery' => $quality->photo_on_delivery,
                    'contact_compliance' => $quality->contact_compliance,
                    'attended_delivery_accuracy' => $quality->attended_delivery_accuracy,
                    'week' => $quality->week,
                    'year' => $quality->year,
                ],
                'teams' => [
                    'value' => $team->value,
                    'high_performers_share' => $team->high_performers_share,
                    'low_performers_share' => $team->low_performers_share,
                    'tenured_workforce' => $team->tenured_workforce,
                    'week' => $team->week,
                    'year' => $team->year,
                ],
            ]);
    }
}
