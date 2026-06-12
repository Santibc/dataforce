<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Src\Domain\Adp\Models\AdpConnection;
use Src\Domain\Adp\Services\AdpWorkerSyncService;

class SyncAdpWorkers extends Command
{
    /**
     * @var string
     */
    protected $signature = 'adp:sync-workers {--company= : Sincronizar solo esta compania (id)}';

    /**
     * @var string
     */
    protected $description = 'Sincroniza trabajadores de ADP: refresca los drivers vinculados y deja los nuevos como candidatos pendientes de revision (no crea automaticamente)';

    public function handle(AdpWorkerSyncService $service): int
    {
        $connections = AdpConnection::query()
            ->where('active', true)
            ->when($this->option('company'), fn ($q, $id) => $q->where('company_id', $id))
            ->with('company')
            ->get();

        if ($connections->isEmpty()) {
            $this->info('No hay conexiones de ADP activas.');

            return Command::SUCCESS;
        }

        foreach ($connections as $connection) {
            $company = $connection->company;
            if (! $company) {
                continue;
            }

            $this->info("Sincronizando ADP para compania #{$company->id} ({$company->name})...");

            if (! $connection->isConfigured()) {
                $this->warn('  Conexion incompleta, se omite.');

                continue;
            }

            try {
                $workers = $service->fetchAllWorkers($connection);
                $refreshed = $service->refreshLinkedWorkers($company, $workers);
                $preview = $service->buildPreview($company, $workers);

                $this->info(sprintf(
                    '  Trabajadores ADP: %d | Refrescados: %d | Nuevos por revisar: %d | Ambiguos: %d',
                    $workers->count(),
                    $refreshed,
                    $preview['counts']['new'],
                    $preview['counts']['ambiguous'],
                ));
            } catch (\Throwable $e) {
                $this->error("  Error: {$e->getMessage()}");
            }
        }

        return Command::SUCCESS;
    }
}
