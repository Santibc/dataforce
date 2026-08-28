<?php

namespace Src\Application\Admin\Adp\Controllers;

use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Src\Domain\Adp\Exceptions\AdpException;
use Src\Domain\Adp\Models\AdpTimeCard;
use Src\Domain\Adp\Services\AdpTimeCardService;
use Src\Domain\Company\Models\Company;
use Src\Domain\User\Models\User;

class AdpTimeCardController
{
    /** Tope de dias que puede pedir el calendario de una sola vez. */
    private const MAX_DAILY_RANGE_DAYS = 31;

    public function __construct(
        private readonly AdpTimeCardService $service,
    ) {
    }

    /**
     * Boton "Sincronizar horas" (modulo de sincronizacion): trae el periodo actual
     * de todos los drivers vinculados, agrupando por manager. Forzado (sin throttle).
     */
    public function sync(): JsonResponse
    {
        try {
            return response()->json(
                $this->service->syncCurrentByManagers(auth()->user()->company, force: true)
            );
        } catch (AdpException $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }

    /**
     * Horas de la semana (domingo-sabado) por driver, con semaforo de overtime.
     * Antes de calcular, refresca el periodo actual desde ADP con throttle (5 min).
     * Lo llaman la lista de usuarios y el calendario al cargar.
     */
    public function weekly(Request $request): JsonResponse
    {
        $week = $request->input('week') ? Carbon::parse($request->input('week')) : null;

        return response()->json($this->service->weeklyHours(auth()->user()->company, $week));
    }

    /**
     * Refresca SOLO el periodo de la semana actual desde ADP (throttle de 5 min) y
     * devuelve las horas ya recalculadas. Lo llaman la lista y el calendario en segundo
     * plano al cargar, para no bloquear la vista.
     */
    public function refreshWeekly(Request $request): JsonResponse
    {
        $company = auth()->user()->company;

        try {
            $this->service->syncCurrentByManagers($company);
        } catch (AdpException $e) {
            // Si el refresco falla, devolvemos igual lo que haya en BD.
        }

        $week = $request->input('week') ? Carbon::parse($request->input('week')) : null;

        return response()->json($this->service->weeklyHours($company, $week));
    }

    /**
     * Horas por DIA de cada driver en el rango pedido, con semaforo diario.
     * Lo llama el calendario para pintar cada celda. Solo lee de BD.
     */
    public function daily(Request $request): JsonResponse
    {
        [$from, $to] = $this->dailyRange($request);

        return response()->json($this->service->dailyHours(auth()->user()->company, $from, $to));
    }

    /**
     * Refresca desde ADP (throttle de 5 min) y devuelve las horas por dia ya
     * recalculadas. Lo llama el calendario en segundo plano al cargar y al cambiar
     * de semana, para no bloquear la vista.
     */
    public function refreshDaily(Request $request): JsonResponse
    {
        $company = auth()->user()->company;

        try {
            $this->service->syncCurrentByManagers($company);
        } catch (AdpException $e) {
            // Si el refresco falla, devolvemos igual lo que haya en BD.
        }

        [$from, $to] = $this->dailyRange($request);

        return response()->json($this->service->dailyHours($company, $from, $to));
    }

    /**
     * Rango del calendario. Sin parametros cae a la semana actual (domingo-sabado);
     * se acota a 31 dias para no traer periodos enormes de una.
     *
     * @return array{0: Carbon, 1: Carbon}
     */
    private function dailyRange(Request $request): array
    {
        $from = $request->input('from')
            ? Carbon::parse($request->input('from'))->startOfDay()
            : now()->startOfWeek(Carbon::SUNDAY);

        $to = $request->input('to')
            ? Carbon::parse($request->input('to'))->startOfDay()
            : $from->copy()->addDays(6);

        if ($to->lt($from)) {
            $to = $from->copy();
        }
        if ($from->diffInDays($to) > self::MAX_DAILY_RANGE_DAYS) {
            $to = $from->copy()->addDays(self::MAX_DAILY_RANGE_DAYS);
        }

        return [$from, $to];
    }

    /**
     * Historico de horas de un driver (perfil). Trae de ADP bajo demanda y devuelve
     * las time cards guardadas, filtrables por fecha.
     */
    public function history(Request $request, int $userId): JsonResponse
    {
        $company = auth()->user()->company;
        $user = $company->users()->findOrFail($userId);

        return response()->json($this->readHistory($company, $user, $request));
    }

    /**
     * Trae el historico de horas del driver desde ADP (con throttle) y devuelve el
     * resultado. Lo llama el perfil en segundo plano, sin bloquear la vista.
     */
    public function historyRefresh(Request $request, int $userId): JsonResponse
    {
        $company = auth()->user()->company;
        $user = $company->users()->findOrFail($userId);

        try {
            if ($user->adp_linked && filled($user->adp_aoid)) {
                $this->service->syncWorkerHistory($company, $user, $request->input('from'));
            }
        } catch (AdpException $e) {
            // continuar con lo que haya en BD
        }

        return response()->json($this->readHistory($company, $user->fresh(), $request));
    }

    /**
     * Lee las horas guardadas del driver (rapido), filtrando por rango si se indica.
     */
    private function readHistory(Company $company, User $user, Request $request): array
    {
        $cards = AdpTimeCard::where('company_id', $company->id)
            ->where('user_id', $user->id)
            ->when($request->input('from'), fn ($q, $d) => $q->whereDate('period_end', '>=', $d))
            ->when($request->input('to'), fn ($q, $d) => $q->whereDate('period_start', '<=', $d))
            ->orderByDesc('period_start')
            ->get();

        return [
            'user_id' => $user->id,
            'time_cards' => $cards,
            'total_minutes' => $cards->sum('total_minutes'),
            'total_hours' => round($cards->sum('total_minutes') / 60, 2),
        ];
    }
}
