<?php

namespace Tests\Application\Admin\Performance\Controllers;

use Illuminate\Http\UploadedFile;
use Src\Application\Admin\Performance\Controllers\PerformanceController;
use Src\Domain\Document\Models\Document;
use Src\Domain\Performance\Models\Performance;
use Src\Domain\User\Enums\Roles;
use Src\Domain\User\Models\User;
use Tests\TestCase;

class PerformanceControllerTest extends TestCase
{
    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->withRole(Roles::ADMIN)->create();
        $this->actingAs($this->user);
    }

    /** @test */
    public function import(): void
    {
        $this->withoutExceptionHandling();

        // Copia el archivo a la ubicación temporal para ser usado en la prueba
        $tempFilePath = sys_get_temp_dir().'/test_image_copy.jpg';
        copy(
            base_path('tests/Application/Admin/Performance/Files/test_new.pdf'),

            $tempFilePath
        );

        $a = new UploadedFile(
            $tempFilePath,
            'US_RLGM_DLF1_Week33_2024_en_DSPScorecard.pdf',
            null,
            null,
            true
        );

        User::factory()->create([
            'company_id' => $this->user->company_id,
            'driver_amazon_id' => 'A117GW2C2C2D45',
        ]);

        $this->post(action([PerformanceController::class, 'import']), ['file' => $a])
            ->assertOk();
        $this->assertDatabaseCount('performance', 1);

        $this->assertDatabaseHas('performance', [
            'serial_number' => '1',
            'document_id' => Document::first()->id,
            'driver_amazon_id' => 'A117GW2C2C2D45',
            'week' => 12,
            'year' => 2025,
            'overall_tier' => 'Fantastic',
            'delivered' => '317',
            'key_focus_area' => '',
            'fico_score' => 'Coming Soon',
            'seatbelt_off_rate' => '0.0',
            'speeding_event_ratio' => '0.0',
            'distraction_rate' => '0.0',
            'following_distance_rate' => '0.0',
            'signal_violations_rate' => '0.0',
            'cdf' => '0',
            'ced' => '0',
            'dcr' => '100.0 %',
            'dsb' => '0',
            'swc_pod' => '100.0 %',
            'psb' => 'Coming Soon',
            'dsb_dnr' => '0',
            'pod' => '221',
        ]);

        $this->assertDatabaseHas('documents', [
            'company_id' => $this->user->company_id,
            'user_id' => $this->user->id,
        ]);

        $document = Document::first();
        $this->assertNotNull($document->getFile());
    }

    /** @test */
    public function get_performance_user(): void
    {
        $user_1 = User::factory()->withRole(Roles::USER)->create([
            'company_id' => $this->user->company_id,
        ]);
        $performance_1v = Performance::factory()->create(
            ['driver_amazon_id' => $user_1->driver_amazon_id, 'week' => 20, 'year' => 2023]
        );
        $performance_1 = Performance::factory()->create(
            ['driver_amazon_id' => $user_1->driver_amazon_id, 'week' => 21, 'year' => 2023]
        );
        Performance::factory()->create();

        $this->get("api/admin/performance/{$user_1->id}")
            ->assertOk()
            ->assertExactJson([
                'id' => $user_1->id,
                'name' => $user_1->firstname.' '.$user_1->lastname,
                'driver_amazon_id' => $user_1->driver_amazon_id,
                'performances' => [
                    [
                        'id' => $performance_1->id,
                        'fico_score' => "$performance_1->fico_score",
                        'seatbelt_off_rate' => "$performance_1->seatbelt_off_rate",
                        'speeding_event_ratio' => "$performance_1->speeding_event_ratio",
                        'distraction_rate' => "$performance_1->distraction_rate",
                        'following_distance_rate' => "$performance_1->following_distance_rate",
                        'signal_violations_rate' => "$performance_1->signal_violations_rate",
                        'cdf' => "$performance_1->cdf",
                        'dcr' => "$performance_1->dcr",
                        'swc_ad' => "$performance_1->swc_ad",
                        'ced' => "$performance_1->ced",
                        'dsb_dnr' => "$performance_1->dsb_dnr",
                        'pod' => "$performance_1->swc_pod",
                        'cc' => "$performance_1->swc_cc",
                        'cc_o' => "$performance_1->cc",
                        'overall_tier' => "$performance_1->overall_tier",
                        'week' => $performance_1->week,
                        'year' => $performance_1->year,
                    ],
                    [
                        'id' => $performance_1v->id,
                        'fico_score' => "$performance_1v->fico_score",
                        'seatbelt_off_rate' => "$performance_1v->seatbelt_off_rate",
                        'speeding_event_ratio' => "$performance_1v->speeding_event_ratio",
                        'distraction_rate' => "$performance_1v->distraction_rate",
                        'following_distance_rate' => "$performance_1v->following_distance_rate",
                        'signal_violations_rate' => "$performance_1v->signal_violations_rate",
                        'cdf' => "$performance_1v->cdf",
                        'dcr' => "$performance_1v->dcr",
                        'swc_ad' => "$performance_1v->swc_ad",
                        'ced' => "$performance_1v->ced",
                        'dsb_dnr' => "$performance_1v->dsb_dnr",
                        'pod' => "$performance_1v->swc_pod",
                        'cc' => "$performance_1v->swc_cc",
                        'cc_o' => "$performance_1v->cc",
                        'overall_tier' => "$performance_1v->overall_tier",
                        'week' => $performance_1v->week,
                        'year' => $performance_1v->year,
                    ],
                ],
            ]);
    }

    /** @test */
    public function get_performance(): void
    {
        $this->withoutExceptionHandling();

        $user_1 = User::factory()->withRole(Roles::ADMIN)->create([
            'company_id' => $this->user->company_id,
        ]);
        $user_2 = User::factory()->withRole(Roles::ADMIN)->create([
            'company_id' => $this->user->company_id,
        ]);
        $user_3 = User::factory()->withRole(Roles::ADMIN)->create([
            'company_id' => $this->user->company_id,
        ]);
        $user_4 = User::factory()->withRole(Roles::ADMIN)->create([
            'company_id' => $this->user->company_id,
        ]);
        $user_5 = User::factory()->withRole(Roles::ADMIN)->create();

        $performance_1 = Performance::factory()->create(['driver_amazon_id' => $user_1->driver_amazon_id]);
        $performance_2 = Performance::factory()->create(['driver_amazon_id' => $user_2->driver_amazon_id]);
        $performance_3 = Performance::factory()->create(['driver_amazon_id' => $user_3->driver_amazon_id]);
        $performance_4 = Performance::factory()->create(['driver_amazon_id' => $user_4->driver_amazon_id]);
        Performance::factory()->create(['driver_amazon_id' => $user_5->driver_amazon_id]);

        $result = collect([
            [
                'id' => $performance_1->id,
                'fico_score' => "$performance_1->fico_score",
                'seatbelt_off_rate' => "$performance_1->seatbelt_off_rate",
                'speeding_event_ratio' => "$performance_1->speeding_event_ratio",
                'distraction_rate' => "$performance_1->distraction_rate",
                'following_distance_rate' => "$performance_1->following_distance_rate",
                'signal_violations_rate' => "$performance_1->signal_violations_rate",
                'overall_tier' => "$performance_1->overall_tier",
                'cdf' => "$performance_1->cdf",
                'dcr' => "$performance_1->dcr",
                'pod' => "$performance_1->swc_pod",
                'cc' => "$performance_1->swc_cc",
                'swc_ad' => "$performance_1->swc_ad",
                'ced' => "$performance_1->ced",
                'dsb_dnr' => "$performance_1->dsb_dnr",
                'cc_o' => "$performance_1->cc",
                'year' => "$performance_1->year",
                'week' => "$performance_1->week",
                'user' => [
                    'id' => $performance_1->user->id,
                    'name' => $performance_1->user->firstname.' '.$performance_1->user->lastname,
                    'driver_amazon_id' => $performance_1->user->driver_amazon_id,
                ],
            ],
            [
                'id' => $performance_2->id,
                'fico_score' => "$performance_2->fico_score",
                'seatbelt_off_rate' => "$performance_2->seatbelt_off_rate",
                'speeding_event_ratio' => "$performance_2->speeding_event_ratio",
                'distraction_rate' => "$performance_2->distraction_rate",
                'following_distance_rate' => "$performance_2->following_distance_rate",
                'signal_violations_rate' => "$performance_2->signal_violations_rate",
                'overall_tier' => "$performance_2->overall_tier",
                'cdf' => "$performance_2->cdf",
                'dcr' => "$performance_2->dcr",
                'pod' => "$performance_2->swc_pod",
                'cc' => "$performance_2->swc_cc",
                'swc_ad' => "$performance_2->swc_ad",
                'ced' => "$performance_2->ced",
                'dsb_dnr' => "$performance_2->dsb_dnr",
                'cc_o' => "$performance_2->cc",
                'year' => "$performance_2->year",
                'week' => "$performance_2->week",
                'user' => [
                    'id' => $performance_2->user->id,
                    'name' => $performance_2->user->firstname.' '.$performance_2->user->lastname,
                    'driver_amazon_id' => $performance_2->user->driver_amazon_id,
                ],
            ],
            [
                'id' => $performance_3->id,
                'fico_score' => "$performance_3->fico_score",
                'seatbelt_off_rate' => "$performance_3->seatbelt_off_rate",
                'speeding_event_ratio' => "$performance_3->speeding_event_ratio",
                'distraction_rate' => "$performance_3->distraction_rate",
                'following_distance_rate' => "$performance_3->following_distance_rate",
                'signal_violations_rate' => "$performance_3->signal_violations_rate",
                'overall_tier' => "$performance_3->overall_tier",
                'cdf' => "$performance_3->cdf",
                'dcr' => "$performance_3->dcr",
                'pod' => "$performance_3->swc_pod",
                'cc' => "$performance_3->swc_cc",
                'swc_ad' => "$performance_3->swc_ad",
                'ced' => "$performance_3->ced",
                'dsb_dnr' => "$performance_3->dsb_dnr",
                'cc_o' => "$performance_3->cc",
                'year' => "$performance_3->year",
                'week' => "$performance_3->week",
                'user' => [
                    'id' => $performance_3->user->id,
                    'name' => $performance_3->user->firstname.' '.$performance_3->user->lastname,
                    'driver_amazon_id' => $performance_3->user->driver_amazon_id,
                ],
            ],
            [
                'id' => $performance_4->id,
                'fico_score' => "$performance_4->fico_score",
                'seatbelt_off_rate' => "$performance_4->seatbelt_off_rate",
                'speeding_event_ratio' => "$performance_4->speeding_event_ratio",
                'distraction_rate' => "$performance_4->distraction_rate",
                'following_distance_rate' => "$performance_4->following_distance_rate",
                'signal_violations_rate' => "$performance_4->signal_violations_rate",
                'overall_tier' => "$performance_4->overall_tier",
                'cdf' => "$performance_4->cdf",
                'dcr' => "$performance_4->dcr",
                'pod' => "$performance_4->swc_pod",
                'cc' => "$performance_4->swc_cc",
                'swc_ad' => "$performance_4->swc_ad",
                'ced' => "$performance_4->ced",
                'dsb_dnr' => "$performance_4->dsb_dnr",
                'cc_o' => "$performance_4->cc",
                'year' => "$performance_4->year",
                'week' => "$performance_4->week",
                'user' => [
                    'id' => $performance_4->user->id,
                    'name' => $performance_4->user->firstname.' '.$performance_4->user->lastname,
                    'driver_amazon_id' => $performance_4->user->driver_amazon_id,
                ],
            ],
        ]);

        $result = $result->sortBy('user.name')->values()->toArray();

        $this->get(action([PerformanceController::class, 'get_performances']))
            ->assertOk()
            ->assertJson($result);

    }
}
