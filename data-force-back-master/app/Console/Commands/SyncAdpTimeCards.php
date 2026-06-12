<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Src\Domain\Adp\Models\AdpConnection;
use Src\Domain\Adp\Services\AdpTimeCardService;

class SyncAdpTimeCards extends Command
{
    /**
     * @var string
     */
    protected $signature = 'adp:sync-time-cards {--company= : Solo esta compania (id)}';

    /**
     * @var string
     */
    protected $description = 'Sincroniza las horas trabajadas (time cards) de ADP para los drivers vinculados';

    public function handle(AdpTimeCardService $service): int
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
            if (! $company || ! $connection->isConfigured()) {
                continue;
            }

            $this->info("Horas ADP para compania #{$company->id} ({$company->name})...");

            try {
                $result = $service->syncCurrentByManagers($company, force: true);
                $this->info(sprintf(
                    '  Drivers: %d | Managers: %d | Time cards guardadas: %d | Errores: %d',
                    $result['drivers'] ?? 0,
                    $result['managers'] ?? 0,
                    $result['time_cards'] ?? 0,
                    count($result['errors'] ?? []),
                ));
            } catch (\Throwable $e) {
                $this->error("  Error: {$e->getMessage()}");
            }
        }

        return Command::SUCCESS;
    }
}
