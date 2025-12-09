<?php

namespace Tests\Application\Admin\Performance\Tasks;

use Src\Application\Admin\Performance\Tasks\ParseMetricsTask;
use Src\Domain\Document\Models\Document;
use Src\Domain\User\Enums\Roles;
use Src\Domain\User\Models\User;
use Tests\TestCase;

class ParseMetricsTaskTest extends TestCase
{
    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->withRole(Roles::ADMIN)->create();
        $this->actingAs($this->user);
    }

    /** @test */
    public function parse_metrics(): void
    {
        $path = base_path('tests/Application/Admin/Performance/Files/parsed_metrics.json');
        $json = collect(json_decode(file_get_contents($path), true));

        $doc = Document::factory()->create();

        $company_id = $this->user->company_id;

        $year = 2024;
        $week = 4;
        ParseMetricsTask::handle($json, $week, $year, $doc->id);

        $this->assertDatabaseHas('safetys_and_compliances', [
            'value' => 'Fantastic',
            'on_road_safety_score' => null,
            'safe_driving_metric' => '839 | Fantastic',
            'seatbelt_off_rate' => 'Coming Soon',
            'speeding_event_rate' => 'Coming Soon',
            'sign_violations_rate' => 'Coming Soon',
            'distractions_rate' => 'Coming Soon',
            'following_distance_rate' => 'Coming Soon',
            'breach_of_contract' => 'Compliant',
            'comprehensive_audit' => 'Compliant',
            'working_hour_compliance' => '100.0 % | Fantastic',
            'week' => $week,
            'year' => $year,
            'company_id' => $company_id,
            'document_id' => $doc->id,
        ]);

        $this->assertDatabaseHas('qualitys', [
            'value' => 'Fantastic',
            'customer_delivery_experience' => 'Great',
            'delivery_completion_rate' => '99.45 % | Fantastic',
            'delivered_and_received' => '362 | Great',
            'standard_work_compliance' => 'Fantastic',
            'photo_on_delivery' => '98.69 % | Fantastic',
            'contact_compliance' => '99.94 % | Fantastic',
            'attended_delivery_accuracy' => '100.00 % | Fantastic',
            'customer_escalation_defect' => '0 | Fantastic',
            'customer_delivery_feedback' => '93.36 % | Poor',
            'week' => $week,
            'year' => $year,
            'company_id' => $company_id,
            'document_id' => $doc->id,
        ]);

        $this->assertDatabaseHas('teams', [
            'value' => 'Great',
            'high_performers_share' => '83.33 % | Fantastic',
            'low_performers_share' => '0.00 % | Fantastic',
            'tenured_workforce' => 'Coming Soon',
            'week' => $week,
            'year' => $year,
            'company_id' => $company_id,
            'document_id' => $doc->id,
        ]);
    }
}
