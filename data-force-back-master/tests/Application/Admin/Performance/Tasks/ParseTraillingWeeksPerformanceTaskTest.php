<?php

namespace Tests\Application\Admin\Performance\Tasks;

use Src\Application\Admin\Performance\Tasks\ParseTrailingWeeksPerformanceTask;
use Src\Domain\Document\Models\Document;
use Src\Domain\User\Enums\Roles;
use Src\Domain\User\Models\User;
use Tests\TestCase;

class ParseTraillingWeeksPerformanceTaskTest extends TestCase
{
    private User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->withRole(Roles::ADMIN)->create();
        $this->actingAs($this->user);
    }

    /** @test */
    public function parse_trailing_weeks(): void
    {
        $path = base_path('tests/Application/Admin/Performance/Files/parsed-trailing-weeks-page.json');
        $json = collect(json_decode(file_get_contents($path), true));

        $doc = Document::factory()->create();

        $user1 = User::factory()->create([
            'company_id' => $this->user->company_id,
            'driver_amazon_id' => 'AOIYNGAZA069D',
        ]);

        $user2 = User::factory()->create([
            'company_id' => $this->user->company_id,
            'driver_amazon_id' => 'A21KTJ2J25HWOK',
        ]);

        $user3 = User::factory()->create([
            'company_id' => $this->user->company_id,
            'driver_amazon_id' => 'A2SHFASVNCZYRV',
        ]);

        $year = 2024;
        $week = 4;
        ParseTrailingWeeksPerformanceTask::handle($json, $week, $year, $doc->id);

        $cells = $json[2]['cells'];

        $this->assertDatabaseHas('trailing_weeks_performances', [
            'driver_amazon_id' => $user1->driver_amazon_id,
            'week' => $week,
            'year' => $year,

            'fico_score' => $cells[2]['text'],
            'seatbelt_off_rate' => $cells[3]['text'],
            'speeding_event_ratio' => $cells[4]['text'],
            'distraction_rate' => $cells[5]['text'],
            'following_distance_rate' => $cells[6]['text'],
            'signal_violations_rate' => $cells[7]['text'],

            'cdf' => $cells[8]['text'],
            'dcr' => $cells[9]['text'],
            'dsb' => $cells[10]['text'],
            'swc_pod' => $cells[11]['text'],
            'swc_cc' => $cells[12]['text'],
            'swc_ad' => $cells[13]['text'],

            'performer_status' => $cells[14]['text'],
            'weeks_fantastic' => intval($cells[15]['text']),
            'weeks_great' => intval($cells[16]['text']),
            'weeks_fair' => intval($cells[17]['text']),
            'weeks_poor' => intval($cells[18]['text']),
            'document_id' => $doc->id,
        ]);

        $this->assertDatabaseHas('trailing_weeks_performances', [
            'driver_amazon_id' => $user2->driver_amazon_id,
            'week' => $week,
            'year' => $year,

            'fico_score' => $cells[21]['text'],
            'seatbelt_off_rate' => $cells[22]['text'],
            'speeding_event_ratio' => $cells[23]['text'],
            'distraction_rate' => $cells[24]['text'],
            'following_distance_rate' => $cells[25]['text'],
            'signal_violations_rate' => $cells[26]['text'],

            'cdf' => $cells[27]['text'],
            'dcr' => $cells[28]['text'],
            'dsb' => $cells[29]['text'],
            'swc_pod' => $cells[30]['text'],
            'swc_cc' => $cells[31]['text'],
            'swc_ad' => $cells[32]['text'],

            'performer_status' => $cells[33]['text'],
            'weeks_fantastic' => intval($cells[34]['text']),
            'weeks_great' => intval($cells[35]['text']),
            'weeks_fair' => intval($cells[36]['text']),
            'weeks_poor' => intval($cells[37]['text']),
            'document_id' => $doc->id,
        ]);

        $this->assertDatabaseHas('trailing_weeks_performances', [
            'driver_amazon_id' => $user3->driver_amazon_id,
            'week' => $week,
            'year' => $year,

            'fico_score' => $cells[40]['text'],
            'seatbelt_off_rate' => $cells[41]['text'],
            'speeding_event_ratio' => $cells[42]['text'],
            'distraction_rate' => $cells[43]['text'],
            'following_distance_rate' => $cells[44]['text'],
            'signal_violations_rate' => $cells[45]['text'],

            'cdf' => $cells[46]['text'],
            'dcr' => $cells[47]['text'],
            'dsb' => $cells[48]['text'],
            'swc_pod' => $cells[49]['text'],
            'swc_cc' => $cells[50]['text'],
            'swc_ad' => $cells[51]['text'],

            'performer_status' => $cells[52]['text'],
            'weeks_fantastic' => intval($cells[53]['text']),
            'weeks_great' => intval($cells[54]['text']),
            'weeks_fair' => intval($cells[55]['text']),
            'weeks_poor' => intval($cells[56]['text']),
            'document_id' => $doc->id,
        ]);
    }
}
