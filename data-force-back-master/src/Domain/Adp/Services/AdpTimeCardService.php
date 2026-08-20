<?php

namespace Src\Domain\Adp\Services;

use Carbon\Carbon;
use Src\Domain\Adp\Data\AdpTimeCardData;
use Src\Domain\Adp\Exceptions\AdpException;
use Src\Domain\Adp\Models\AdpConnection;
use Src\Domain\Adp\Models\AdpTimeCard;
use Src\Domain\Company\Models\Company;
use Src\Domain\User\Models\User;

/**
 * Fase 2: horas trabajadas (Time & Attendance) de ADP.
 *
 * - Refresco del periodo actual (lista/calendario): se hace por MANAGER via
 *   team-time-cards (una llamada trae a todo el equipo) con throttle, para no
 *   saturar la API. Ver syncCurrentByManagers().
 * - Historico de un driver (perfil): por el endpoint individual, iterando fechas.
 *   Ver syncWorkerHistory().
 * - Horas de la semana (domingo-sabado) con semaforo de overtime: weeklyHours().
 */
class AdpTimeCardService
{
    /** Minutos de throttle por defecto para el refresco incremental. */
    public const DEFAULT_THROTTLE_MINUTES = 5;

    /**
     * Dias hacia atras que se piden en el refresco incremental.
     *
     * OJO: ADP llama 'current' al periodo de nomina que esta EN PROCESO (el que
     * ya cerro y falta pagar), no al que contiene la fecha de hoy; el periodo en
     * curso lo devuelve como 'next'. Por eso el refresco NO puede depender del
     * periodCode: se filtra por fecha de inicio (>= hoy - 21 dias), lo que cubre
     * el periodo actual y el anterior aunque la nomina sea quincenal.
     */
    public const CURRENT_WINDOW_DAYS = 21;

    public function __construct(
        private readonly AdpClient $client,
    ) {
    }

    /**
     * Time cards de un trabajador por AOID (endpoint individual).
     * $period: 'current'|'previous'|'next'; $startDateFrom: 'YYYY-MM-DD' (rango historico).
     *
     * @return array<int, AdpTimeCardData>
     */
    public function fetchTimeCards(AdpConnection $connection, string $aoid, ?string $period = null, ?string $startDateFrom = null): array
    {
        $query = [];
        if ($period) {
            $query['$filter'] = "timeCards/periodCode/codeValue eq '{$period}'";
        } elseif ($startDateFrom) {
            $query['$filter'] = "timeCards/timePeriod/startDate ge '{$startDateFrom}'";
        }

        $response = $this->client->get($connection, "/time/v2/workers/{$aoid}/time-cards", $query);

        if ($response->status() === 204) {
            return [];
        }
        if (! $response->successful()) {
            throw new AdpException("Error fetching time-cards for {$aoid} ({$response->status()}): ".$response->body());
        }

        return array_map(fn ($tc) => AdpTimeCardData::fromAdp($tc), (array) $response->json('timeCards', []));
    }

    /**
     * Time cards de TODO el equipo de un manager (una sola llamada).
     *
     * $startDateFrom ('YYYY-MM-DD') acota los periodos por fecha de inicio; sin el,
     * ADP devuelve solo el periodo 'current' (que puede ser uno ya cerrado).
     * El filtro se prefija con 'timeCards/' (con 'teamTimeCards/' ADP responde 400).
     *
     * @return array<string, array<int, AdpTimeCardData>> [associateOID => AdpTimeCardData[]]
     */
    public function fetchTeamTimeCards(AdpConnection $connection, string $managerAoid, ?string $startDateFrom = null): array
    {
        $query = $startDateFrom
            ? ['$filter' => "timeCards/timePeriod/startDate ge '{$startDateFrom}'"]
            : [];

        $response = $this->client->get($connection, "/time/v2/workers/{$managerAoid}/team-time-cards", $query);

        if ($response->status() === 204) {
            return [];
        }
        if (! $response->successful()) {
            throw new AdpException("Error fetching team-time-cards for {$managerAoid} ({$response->status()}): ".$response->body());
        }

        $byAoid = [];
        foreach ((array) $response->json('teamTimeCards', []) as $member) {
            $aoid = data_get($member, 'associateOID');
            if (! $aoid) {
                continue;
            }
            foreach ((array) data_get($member, 'timeCards', []) as $tc) {
                $tc['associateOID'] = data_get($tc, 'associateOID') ?: $aoid;
                $byAoid[$aoid][] = AdpTimeCardData::fromAdp($tc);
            }
        }

        return $byAoid;
    }

    /**
     * Refresca el periodo actual de los drivers vinculados, agrupando por manager
     * (team-time-cards). Aplica throttle: si se sincronizo hace menos de N minutos
     * y no es forzado, no consulta ADP. Lo usan las cargas de pagina (cada 5 min).
     */
    public function syncCurrentByManagers(Company $company, bool $force = false, int $throttleMinutes = self::DEFAULT_THROTTLE_MINUTES): array
    {
        // Traer las horas de muchos drivers puede tardar; no dejar que PHP corte el proceso.
        @set_time_limit(0);
        $connection = $this->connectionFor($company);

        if (! $force
            && $connection->time_cards_synced_at
            && $connection->time_cards_synced_at->gt(now()->subMinutes($throttleMinutes))
        ) {
            return ['skipped' => true, 'reason' => 'throttled', 'synced_at' => $connection->time_cards_synced_at];
        }

        // Solo drivers ACTIVOS (los terminados no trabajan; no se consultan).
        $drivers = $company->users()
            ->where('adp_linked', true)
            ->where('adp_active', true)
            ->whereNotNull('adp_aoid')
            ->get();
        $byAoid = $drivers->keyBy('adp_aoid');
        $managers = $drivers->pluck('adp_manager_aoid')->filter()->unique()->values();

        $result = ['skipped' => false, 'drivers' => $drivers->count(), 'managers' => $managers->count(), 'time_cards' => 0, 'errors' => []];
        $covered = [];

        // Ventana de fechas: incluye el periodo en curso (que ADP marca 'next').
        $from = now()->subDays(self::CURRENT_WINDOW_DAYS)->toDateString();
        $result['from'] = $from;

        // 1) Por manager (eficiente): trae a todo el equipo de una.
        foreach ($managers as $managerAoid) {
            try {
                foreach ($this->fetchTeamTimeCards($connection, $managerAoid, $from) as $aoid => $cards) {
                    $user = $byAoid->get($aoid);
                    if (! $user) {
                        continue; // miembro del equipo que no es driver vinculado: ignorar
                    }
                    foreach ($cards as $card) {
                        $this->persist($company, $card, $user);
                        $result['time_cards']++;
                    }
                    $covered[$aoid] = true;
                }
            } catch (\Throwable $e) {
                $result['errors'][] = "Manager {$managerAoid}: ".$e->getMessage();
            }
        }

        // 2) Drivers no cubiertos por el equipo: individual pero EN PARALELO (concurrente).
        $pending = $drivers->reject(fn ($d) => isset($covered[$d->adp_aoid]))->values();
        if ($pending->isNotEmpty()) {
            $byPath = [];
            foreach ($pending as $driver) {
                $byPath["/time/v2/workers/{$driver->adp_aoid}/time-cards"] = $driver;
            }

            $query = ['$filter' => "timeCards/timePeriod/startDate ge '{$from}'"];

            foreach ($this->client->getMany($connection, array_keys($byPath), query: $query) as $path => $response) {
                $driver = $byPath[$path] ?? null;
                if (! $driver) {
                    continue;
                }
                if (! $response || ! $response->successful()) {
                    $result['errors'][] = "AOID {$driver->adp_aoid}: ".($response ? 'HTTP '.$response->status() : 'no response');

                    continue;
                }
                foreach ((array) $response->json('timeCards', []) as $tc) {
                    $this->persist($company, AdpTimeCardData::fromAdp($tc), $driver);
                    $result['time_cards']++;
                }
            }
        }

        $connection->forceFill(['time_cards_synced_at' => now()])->save();
        $result['synced_at'] = now();

        return $result;
    }

    /**
     * Trae el historico completo de un driver (perfil), iterando el filtro de fecha
     * hacia adelante por tandas hasta no obtener periodos nuevos. Bajo demanda.
     */
    public function syncWorkerHistory(Company $company, User $user, ?string $from = null, int $throttleMinutes = 60): int
    {
        // El historico de un driver puede tener muchos periodos; sin limite de tiempo.
        @set_time_limit(0);
        $connection = $this->connectionFor($company);
        if (blank($user->adp_aoid)) {
            return 0;
        }

        // Throttle: el historico viejo no cambia; no re-consultar si se hizo hace poco.
        if (! $from
            && $user->adp_history_synced_at
            && $user->adp_history_synced_at->gt(now()->subMinutes($throttleMinutes))
        ) {
            return 0;
        }

        $cursor = $from ?: now()->subYear()->startOfYear()->toDateString();
        $today = now()->toDateString();
        $saved = 0;
        $seen = [];

        for ($guard = 0; $guard < 40; $guard++) {
            $cards = $this->fetchTimeCards($connection, $user->adp_aoid, null, $cursor);
            if (! $cards) {
                break;
            }

            $newInBatch = 0;
            $maxStart = $cursor;
            foreach ($cards as $card) {
                if (! $card->period_start || isset($seen[$card->period_start])) {
                    continue;
                }
                $seen[$card->period_start] = true;
                $this->persist($company, $card, $user);
                $saved++;
                $newInBatch++;
                if ($card->period_start > $maxStart) {
                    $maxStart = $card->period_start;
                }
            }

            if ($newInBatch === 0) {
                break;
            }

            $cursor = Carbon::parse($maxStart)->addDay()->toDateString();
            if ($cursor > $today) {
                break;
            }
        }

        $user->forceFill(['adp_history_synced_at' => now()])->save();

        return $saved;
    }

    /**
     * Horas trabajadas de la semana (domingo a sabado) por driver vinculado, con
     * semaforo de overtime: 'red' si >= limite de la compania, 'orange' si >= (limite-10).
     */
    public function weeklyHours(Company $company, ?Carbon $weekRef = null): array
    {
        $ref = $weekRef ? $weekRef->copy() : now();
        $start = $ref->startOfWeek(Carbon::SUNDAY);
        $end = $start->copy()->addDays(6);
        $startStr = $start->toDateString();
        $endStr = $end->toDateString();

        $threshold = (int) ($company->overtime_threshold ?: 40);
        $warning = max(0, $threshold - 10);

        $drivers = $company->users()->where('adp_linked', true)->get();

        // Time cards cuyo periodo solapa la semana.
        $cards = AdpTimeCard::where('company_id', $company->id)
            ->whereNotNull('user_id')
            ->whereDate('period_start', '<=', $endStr)
            ->whereDate('period_end', '>=', $startStr)
            ->get();

        $minutesByUser = [];
        foreach ($cards as $card) {
            foreach (($card->daily_totals ?? []) as $day) {
                $date = $day['date'] ?? null;
                if (! $date || $date < $startStr || $date > $endStr) {
                    continue;
                }
                $minutesByUser[$card->user_id] = ($minutesByUser[$card->user_id] ?? 0) + (int) ($day['minutes'] ?? 0);
            }
        }

        $rows = $drivers->map(function (User $user) use ($minutesByUser, $threshold, $warning) {
            $minutes = $minutesByUser[$user->id] ?? 0;
            $hours = round($minutes / 60, 2);

            return [
                'user_id' => $user->id,
                'minutes' => $minutes,
                'hours' => $hours,
                'status' => $hours >= $threshold ? 'red' : ($hours >= $warning ? 'orange' : 'normal'),
            ];
        })->values()->all();

        return [
            'week_start' => $startStr,
            'week_end' => $endStr,
            'threshold' => $threshold,
            'warning' => $warning,
            'drivers' => $rows,
        ];
    }

    public function persist(Company $company, AdpTimeCardData $card, ?User $user = null): AdpTimeCard
    {
        return AdpTimeCard::updateOrCreate(
            [
                'company_id' => $company->id,
                'adp_aoid' => $card->aoid,
                'period_start' => $card->period_start,
            ],
            [
                'user_id' => $user?->id,
                'time_card_id' => $card->time_card_id,
                'period_code' => $card->period_code,
                'period_end' => $card->period_end,
                'period_status' => $card->period_status,
                'processing_status' => $card->processing_status,
                'total_minutes' => $card->total_minutes,
                'period_totals' => $card->period_totals,
                'daily_totals' => $card->daily_totals,
                'exceptions' => $card->exceptions,
                'synced_at' => now(),
            ]
        );
    }

    private function connectionFor(Company $company): AdpConnection
    {
        $connection = $company->adpConnection;

        if (! $connection || ! $connection->active || ! $connection->isConfigured()) {
            throw new AdpException('This company has no active ADP connection configured. Set it up in ADP Settings.');
        }

        return $connection;
    }
}
