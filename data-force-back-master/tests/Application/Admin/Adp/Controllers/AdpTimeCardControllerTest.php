<?php

namespace Tests\Application\Admin\Adp\Controllers;

use Src\Domain\Adp\Models\AdpTimeCard;
use Src\Domain\User\Enums\Roles;
use Src\Domain\User\Models\User;
use Tests\TestCase;

class AdpTimeCardControllerTest extends TestCase
{
    // El APP_URL del proyecto esta malformado/usa un subpath; usamos URLs absolutas
    // a http://localhost para que el path resuelva a la raiz y haga match en los tests.
    private const BASE = 'http://localhost';

    /** @test */
    public function daily_endpoint_returns_hours_per_day_for_the_requested_range(): void
    {
        $admin = User::factory()->withRole(Roles::ADMIN)->create();
        $company = $admin->company;
        $company->update(['daily_hours_limit' => 12, 'daily_hours_warning' => 10]);

        $driver = User::factory()->create([
            'company_id' => $company->id, 'adp_linked' => true, 'adp_aoid' => 'AOID-C',
        ]);

        AdpTimeCard::create([
            'company_id' => $company->id,
            'user_id' => $driver->id,
            'adp_aoid' => 'AOID-C',
            'period_start' => '2026-08-16',
            'period_end' => '2026-08-29',
            'total_minutes' => 0,
            'daily_totals' => [
                ['date' => '2026-08-17', 'pay_code' => 'REGULAR', 'minutes' => 480],
                ['date' => '2026-08-17', 'pay_code' => 'OVERTIME', 'minutes' => 300],
                ['date' => '2026-08-18', 'pay_code' => 'REGULAR', 'minutes' => 620],
            ],
        ]);

        $this->actingAs($admin)
            ->getJson(self::BASE.'/api/admin/adp/time-cards/daily?from=2026-08-16&to=2026-08-22')
            ->assertOk()
            ->assertJson([
                'from' => '2026-08-16',
                'to' => '2026-08-22',
                'limit' => 12,
                'warning' => 10,
                'drivers' => [
                    [
                        'user_id' => $driver->id,
                        'days' => [
                            // 480 + 300 = 780 min = 13 h -> pasado el limite diario.
                            '2026-08-17' => ['minutes' => 780, 'hours' => 13, 'status' => 'red'],
                            // 620 min = 10.33 h -> aviso.
                            '2026-08-18' => ['minutes' => 620, 'hours' => 10.33, 'status' => 'orange'],
                        ],
                    ],
                ],
            ]);
    }

    /** @test */
    public function rolling_endpoint_returns_the_moving_window_totals(): void
    {
        $admin = User::factory()->withRole(Roles::ADMIN)->create();
        $company = $admin->company;
        $company->update(['rolling_hours_days' => 7, 'rolling_hours_limit' => 60]);

        $driver = User::factory()->create([
            'company_id' => $company->id, 'adp_linked' => true, 'adp_aoid' => 'AOID-RC',
        ]);

        $today = now()->startOfDay();

        AdpTimeCard::create([
            'company_id' => $company->id,
            'user_id' => $driver->id,
            'adp_aoid' => 'AOID-RC',
            'period_start' => $today->copy()->subDays(10)->toDateString(),
            'period_end' => $today->copy()->addDays(3)->toDateString(),
            'total_minutes' => 0,
            'daily_totals' => [
                ['date' => $today->copy()->subDays(3)->toDateString(), 'pay_code' => 'REGULAR', 'minutes' => 1830],
                ['date' => $today->copy()->subDays(1)->toDateString(), 'pay_code' => 'REGULAR', 'minutes' => 1830],
                // Fuera de la ventana de 7 dias: no debe sumar.
                ['date' => $today->copy()->subDays(9)->toDateString(), 'pay_code' => 'REGULAR', 'minutes' => 600],
            ],
        ]);

        $this->actingAs($admin)
            ->getJson(self::BASE.'/api/admin/adp/time-cards/rolling')
            ->assertOk()
            ->assertJson([
                'from' => $today->copy()->subDays(6)->toDateString(),
                'to' => $today->toDateString(),
                'days' => 7,
                'limit' => 60,
                'warning' => 51,
                'drivers' => [
                    ['user_id' => $driver->id, 'minutes' => 3660, 'hours' => 61, 'status' => 'red'],
                ],
            ]);
    }

    /** @test */
    public function daily_endpoint_caps_the_requested_range(): void
    {
        $admin = User::factory()->withRole(Roles::ADMIN)->create();

        $this->actingAs($admin)
            ->getJson(self::BASE.'/api/admin/adp/time-cards/daily?from=2026-08-01&to=2027-08-01')
            ->assertOk()
            ->assertJson(['from' => '2026-08-01', 'to' => '2026-09-01']);
    }
}
