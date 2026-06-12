<?php

namespace Src\Domain\Adp\Data;

use Spatie\LaravelData\Data;

/**
 * Representacion normalizada de una time card de ADP (Time & Attendance) para
 * un trabajador y un periodo de pago. Las duraciones de ADP vienen en ISO-8601
 * (p. ej. "PT8H30M") y aqui se convierten a minutos.
 */
class AdpTimeCardData extends Data
{
    public function __construct(
        public string $aoid,
        public ?string $worker_id,
        public ?string $time_card_id,
        public ?string $period_code,
        public ?string $period_start,
        public ?string $period_end,
        public ?string $period_status,
        public ?string $processing_status,
        public int $total_minutes,
        /** @var array<int, array{pay_code: string, minutes: int}> */
        public array $period_totals,
        /** @var array<int, array{date: ?string, pay_code: string, minutes: int}> */
        public array $daily_totals,
        public array $exceptions,
    ) {
    }

    public static function fromAdp(array $tc): self
    {
        $periodTotals = [];
        foreach ((array) data_get($tc, 'periodTotals', []) as $pt) {
            $periodTotals[] = [
                'pay_code' => (string) data_get($pt, 'payCode.codeValue', ''),
                'minutes' => self::minutesFromIso(data_get($pt, 'timeDuration')),
            ];
        }

        $dailyTotals = [];
        foreach ((array) data_get($tc, 'dailyTotals', []) as $dt) {
            $dailyTotals[] = [
                'date' => data_get($dt, 'entryDate'),
                'pay_code' => (string) data_get($dt, 'payCode.codeValue', ''),
                'minutes' => self::minutesFromIso(data_get($dt, 'timeDuration')),
            ];
        }

        $total = self::minutesFromIso(data_get($tc, 'totalPeriodTimeDuration'));
        if ($total === 0 && $periodTotals) {
            $total = array_sum(array_column($periodTotals, 'minutes'));
        }
        // Periodos "Open" (en curso) no traen total: se deriva de los dias trabajados.
        if ($total === 0 && $dailyTotals) {
            $total = array_sum(array_column($dailyTotals, 'minutes'));
        }

        return new self(
            aoid: (string) data_get($tc, 'associateOID'),
            worker_id: data_get($tc, 'workerID.idValue'),
            time_card_id: data_get($tc, 'timeCardID'),
            period_code: data_get($tc, 'periodCode.codeValue'),
            period_start: data_get($tc, 'timePeriod.startDate'),
            period_end: data_get($tc, 'timePeriod.endDate'),
            period_status: data_get($tc, 'timePeriod.periodStatus'),
            processing_status: data_get($tc, 'processingStatusCode.codeValue'),
            total_minutes: $total,
            period_totals: $periodTotals,
            daily_totals: $dailyTotals,
            exceptions: (array) data_get($tc, 'exceptionCounts', []),
        );
    }

    /**
     * Convierte una duracion ISO-8601 (PT#H#M#S) a minutos totales.
     */
    public static function minutesFromIso(?string $iso): int
    {
        if (! $iso || ! preg_match('/^P(?:T)?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/', $iso, $m)) {
            return 0;
        }

        $hours = (int) ($m[1] ?? 0);
        $minutes = (int) ($m[2] ?? 0);
        $seconds = (int) ($m[3] ?? 0);

        return $hours * 60 + $minutes + (int) round($seconds / 60);
    }
}
