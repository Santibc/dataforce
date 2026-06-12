<?php

namespace Src\Application\Admin\Adp\Controllers;

use Illuminate\Http\JsonResponse;
use Src\Application\Admin\Adp\Data\ConfirmAdpSyncData;
use Src\Domain\Adp\Exceptions\AdpException;
use Src\Domain\Adp\Models\AdpSyncCandidate;
use Src\Domain\Adp\Services\AdpWorkerSyncService;
use Src\Domain\User\Models\User;

class AdpSyncController
{
    public function __construct(
        private readonly AdpWorkerSyncService $service,
    ) {
    }

    /**
     * Valida las credenciales: pide token y prueba un GET minimo a worker-demographics.
     */
    public function testConnection(): JsonResponse
    {
        $connection = auth()->user()->company->adpConnection;

        if (! $connection || ! $connection->isConfigured()) {
            return response()->json(['ok' => false, 'error' => 'No ADP connection configured.'], 422);
        }

        try {
            return response()->json($this->service->testConnection($connection));
        } catch (AdpException $e) {
            return response()->json(['ok' => false, 'error' => $e->getMessage()], 422);
        }
    }

    /**
     * Trae los trabajadores de ADP, los compara con los drivers y devuelve los grupos
     * para la pantalla de revision (matched / ambiguous / new / only_in_bosmetrics).
     */
    public function preview(): JsonResponse
    {
        try {
            return response()->json($this->service->buildPreview(auth()->user()->company));
        } catch (AdpException $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }

    /**
     * Candidatos pendientes en el staging (los que dejo el cron o un preview previo).
     */
    public function candidates(): JsonResponse
    {
        $company = auth()->user()->company;

        $candidates = AdpSyncCandidate::where('company_id', $company->id)
            ->where('status', AdpSyncCandidate::STATUS_PENDING)
            ->get();

        $userIds = $candidates
            ->flatMap(fn ($c) => collect($c->possible_matches ?? [])->pluck('user_id'))
            ->unique()
            ->all();
        $usersById = User::whereIn('id', $userIds)->get()->keyBy('id');

        return response()->json([
            'candidates' => $candidates->map(fn ($c) => $this->service->hydrateCandidate($c, $usersById))->all(),
        ]);
    }

    /**
     * Aplica las decisiones del admin (link / create / ignore).
     */
    public function confirm(ConfirmAdpSyncData $data): JsonResponse
    {
        $result = $this->service->confirm(auth()->user()->company, $data->decisions->toArray());

        return response()->json($result);
    }

    /**
     * Crea en lote todos los trabajadores nuevos ACTIVOS pendientes (insert masivo).
     */
    public function bulkCreateActive(): JsonResponse
    {
        try {
            return response()->json($this->service->bulkCreateActive(auth()->user()->company));
        } catch (AdpException $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }
}
