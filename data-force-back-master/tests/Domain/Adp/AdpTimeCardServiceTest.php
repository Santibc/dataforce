<?php

namespace Tests\Domain\Adp;

use Carbon\Carbon;
use Illuminate\Support\Facades\Http;
use Src\Domain\Adp\Data\AdpTimeCardData;
use Src\Domain\Adp\Models\AdpConnection;
use Src\Domain\Adp\Models\AdpTimeCard;
use Src\Domain\Adp\Services\AdpTimeCardService;
use Src\Domain\Company\Models\Company;
use Src\Domain\User\Models\User;
use Tests\TestCase;

class AdpTimeCardServiceTest extends TestCase
{
    /** @test */
    public function it_parses_iso_8601_durations_to_minutes(): void
    {
        $this->assertSame(43, AdpTimeCardData::minutesFromIso('PT43M'));
        $this->assertSame(510, AdpTimeCardData::minutesFromIso('PT8H30M'));
        $this->assertSame(480, AdpTimeCardData::minutesFromIso('PT8H'));
        $this->assertSame(0, AdpTimeCardData::minutesFromIso(null));
    }

    /** @test */
    public function it_derives_period_total_from_daily_totals_when_open(): void
    {
        // Periodos "Open" (en curso) no traen totalPeriodTimeDuration ni periodTotals,
        // solo los dias trabajados: el total debe derivarse sumando esos dias.
        $card = AdpTimeCardData::fromAdp([
            'associateOID' => 'AOID-OPEN',
            'timePeriod' => ['startDate' => '2026-06-07', 'endDate' => '2026-06-20', 'periodStatus' => 'Open'],
            'dailyTotals' => [
                ['entryDate' => '2026-06-07', 'payCode' => ['codeValue' => 'REGULAR'], 'timeDuration' => 'PT10H21M'],
                ['entryDate' => '2026-06-08', 'payCode' => ['codeValue' => 'REGULAR'], 'timeDuration' => 'PT11H26M'],
            ],
        ]);

        $this->assertSame(621 + 686, $card->total_minutes);
    }

    /** @test */
    public function it_syncs_current_period_by_manager_and_respects_throttle(): void
    {
        $company = Company::factory()->create();
        $m = 'MGR-1';
        $d1 = User::factory()->create(['company_id' => $company->id, 'adp_linked' => true, 'adp_active' => true, 'adp_aoid' => 'AOID-1', 'adp_manager_aoid' => $m]);
        $d2 = User::factory()->create(['company_id' => $company->id, 'adp_linked' => true, 'adp_active' => true, 'adp_aoid' => 'AOID-2', 'adp_manager_aoid' => $m]);
        $this->makeConnection($company);

        Http::fake(function ($request) use ($m) {
            $url = urldecode($request->url());
            if (str_contains($url, '/auth/oauth/v2/token')) {
                return Http::response(['access_token' => 'fake', 'expires_in' => 3600], 200);
            }
            if (str_contains($url, "/workers/{$m}/team-time-cards")) {
                return Http::response(['teamTimeCards' => [
                    $this->teamMember('AOID-1'),
                    $this->teamMember('AOID-2'),
                ]], 200);
            }

            return Http::response('', 404);
        });

        $service = app(AdpTimeCardService::class);
        $result = $service->syncCurrentByManagers($company, force: true);

        $this->assertFalse($result['skipped']);
        $this->assertSame(1, $result['managers']);     // una sola llamada para los 2 drivers
        $this->assertSame(2, $result['time_cards']);
        $this->assertSame($d1->id, AdpTimeCard::where('adp_aoid', 'AOID-1')->first()->user_id);
        $this->assertSame($d2->id, AdpTimeCard::where('adp_aoid', 'AOID-2')->first()->user_id);

        // Segunda llamada sin force: el throttle evita consultar de nuevo.
        $again = $service->syncCurrentByManagers($company, throttleMinutes: 5);
        $this->assertTrue($again['skipped']);
    }

    /** @test */
    public function it_asks_the_team_period_by_date_because_adp_current_is_the_closed_one(): void
    {
        // ADP llama 'current' al periodo de nomina ya cerrado y 'next' al que
        // contiene hoy: si se pide sin filtro, la semana en curso llega vacia.
        // Por eso el refresco debe filtrar por fecha de inicio del periodo.
        $company = Company::factory()->create();
        $m = 'MGR-9';
        User::factory()->create(['company_id' => $company->id, 'adp_linked' => true, 'adp_active' => true, 'adp_aoid' => 'AOID-9', 'adp_manager_aoid' => $m]);
        $this->makeConnection($company);

        Http::fake(function ($request) use ($m) {
            if (str_contains($request->url(), '/auth/oauth/v2/token')) {
                return Http::response(['access_token' => 'fake', 'expires_in' => 3600], 200);
            }
            if (str_contains(urldecode($request->url()), "/workers/{$m}/team-time-cards")) {
                return Http::response(['teamTimeCards' => [$this->teamMember('AOID-9')]], 200);
            }

            return Http::response('', 404);
        });

        app(AdpTimeCardService::class)->syncCurrentByManagers($company, force: true);

        $expected = now()->subDays(AdpTimeCardService::CURRENT_WINDOW_DAYS)->toDateString();
        Http::assertSent(function ($request) use ($m, $expected) {
            $url = urldecode($request->url());

            return str_contains($url, "/workers/{$m}/team-time-cards")
                && str_contains($url, "timeCards/timePeriod/startDate ge '{$expected}'");
        });
    }

    /** @test */
    public function weekly_hours_apply_overtime_semaphore(): void
    {
        $company = Company::factory()->create(['overtime_threshold' => 40]);
        $driver = User::factory()->create(['company_id' => $company->id, 'adp_linked' => true, 'adp_aoid' => 'AOID-W']);

        // 35 horas esta semana (5 dias x 7h): debe quedar en naranja (>= 30 y < 40).
        $weekStart = now()->startOfWeek(Carbon::SUNDAY);
        $daily = [];
        for ($i = 0; $i < 5; $i++) {
            $daily[] = ['date' => $weekStart->copy()->addDays($i)->toDateString(), 'pay_code' => 'REGULAR', 'minutes' => 420];
        }
        AdpTimeCard::create([
            'company_id' => $company->id,
            'user_id' => $driver->id,
            'adp_aoid' => 'AOID-W',
            'period_start' => $weekStart->toDateString(),
            'period_end' => $weekStart->copy()->addDays(13)->toDateString(),
            'total_minutes' => 2100,
            'daily_totals' => $daily,
        ]);

        $result = app(AdpTimeCardService::class)->weeklyHours($company);

        $this->assertSame(40, $result['threshold']);
        $this->assertSame(30, $result['warning']);
        $row = collect($result['drivers'])->firstWhere('user_id', $driver->id);
        $this->assertSame(35.0, $row['hours']);
        $this->assertSame('orange', $row['status']);
    }

    private function teamMember(string $aoid): array
    {
        return [
            'associateOID' => $aoid,
            'timeCards' => [[
                'timeCardID' => 'TC-'.$aoid,
                'periodCode' => ['codeValue' => 'current'],
                'timePeriod' => ['startDate' => '2026-06-07', 'endDate' => '2026-06-20', 'periodStatus' => 'Open'],
                'associateOID' => $aoid,
                'totalPeriodTimeDuration' => 'PT8H',
                'periodTotals' => [['payCode' => ['codeValue' => 'REGULAR'], 'timeDuration' => 'PT8H']],
                'dailyTotals' => [['entryDate' => '2026-06-08', 'payCode' => ['codeValue' => 'REGULAR'], 'timeDuration' => 'PT8H']],
            ]],
        ];
    }

    private function makeConnection(Company $company): AdpConnection
    {
        return AdpConnection::create([
            'company_id' => $company->id,
            'client_id' => 'c',
            'client_secret' => 's',
            'certificate_pem' => "-----BEGIN CERTIFICATE-----\nX\n-----END CERTIFICATE-----",
            'private_key' => "-----BEGIN PRIVATE KEY-----\nY\n-----END PRIVATE KEY-----",
            'active' => true,
        ]);
    }
}
