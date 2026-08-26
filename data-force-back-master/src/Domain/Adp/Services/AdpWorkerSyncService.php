<?php

namespace Src\Domain\Adp\Services;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Src\Domain\Adp\Data\AdpWorkerData;
use Src\Domain\Adp\Exceptions\AdpException;
use Src\Domain\Adp\Models\AdpConnection;
use Src\Domain\Adp\Models\AdpSyncCandidate;
use Src\Domain\Company\Models\Company;
use Src\Domain\Jobsite\Models\Jobsite;
use Src\Domain\Position\Models\Position;
use Src\Domain\User\Enums\Roles;
use Src\Domain\User\Models\User;

/**
 * Sincroniza trabajadores de ADP (Worker Demographics v2) con los drivers de BosMetrics.
 *
 * Matching = OR: un worker coincide con un driver si CUALQUIERA de estos criterios
 * cuadra (prioridad de mayor a menor): adp_aoid ya guardado, amazon id (si /meta lo
 * detecto), email, telefono (ultimos 10 digitos) o nombre. Nunca se exige combinacion.
 * Los casos con >1 coincidencia se marcan "ambiguous" para que el admin elija.
 */
class AdpWorkerSyncService
{
    /** Menor numero = mayor confianza; se usa para elegir el match_type que se muestra por user. */
    private const MATCH_PRIORITY = [
        'aoid' => 1,
        'amazon_id' => 2,
        'email' => 3,
        'phone' => 4,
        'name' => 5,
    ];

    /** Tope de seguridad de paginas (100 registros c/u) para evitar bucles infinitos. */
    private const MAX_PAGES = 200;

    public function __construct(
        private readonly AdpClient $client,
    ) {
    }

    /**
     * Valida credenciales: pide token nuevo y prueba un GET minimo a worker-demographics.
     */
    public function testConnection(AdpConnection $connection): array
    {
        $token = $this->client->requestToken($connection);
        $response = $this->client->get($connection, '/hr/v2/worker-demographics', ['$top' => 1]);

        return [
            'token_ok' => filled($token),
            'status' => $response->status(),
            'ok' => $response->successful(),
            'sample_count' => $response->successful() ? count((array) $response->json('workers', [])) : 0,
            'error' => $response->successful() ? null : $response->body(),
        ];
    }

    /**
     * Trae TODOS los trabajadores paginando con OData ($top/$skip) hasta 204/lista vacia.
     *
     * @return Collection<int, AdpWorkerData>
     */
    public function fetchAllWorkers(AdpConnection $connection): Collection
    {
        $workers = collect();
        $top = 100;
        $skip = 0;

        for ($page = 0; $page < self::MAX_PAGES; $page++) {
            $response = $this->client->get($connection, '/hr/v2/worker-demographics', [
                '$top' => $top,
                '$skip' => $skip,
            ]);

            if ($response->status() === 204) {
                break;
            }

            if (! $response->successful()) {
                throw new AdpException(
                    'Error querying worker-demographics ('.$response->status().'): '.$response->body()
                );
            }

            $batch = (array) $response->json('workers', []);
            if (count($batch) === 0) {
                break;
            }

            foreach ($batch as $worker) {
                $workers->push(AdpWorkerData::fromAdp($worker));
            }

            if (count($batch) < $top) {
                break;
            }

            $skip += $top;
        }

        return $workers;
    }

    /**
     * Compara los workers de ADP con los drivers existentes y persiste los candidatos
     * en el staging (sin mutar usuarios). Devuelve los grupos para la pantalla de revision.
     */
    public function buildPreview(Company $company, ?Collection $workers = null): array
    {
        $connection = $this->connectionFor($company);
        $workers ??= $this->fetchAllWorkers($connection);

        // Solo procesar trabajadores ACTIVOS (los terminados/inactivos no interesan).
        $workers = $workers->filter(fn ($w) => $w->status === 'Active')->values();

        $index = $this->indexUsers($company);
        $usersById = $index['all']->keyBy('id');
        $matchedUserIds = [];
        $groups = ['matched' => [], 'ambiguous' => [], 'new' => []];

        foreach ($workers as $worker) {
            $matches = $this->matchWorker($worker, $index);
            $userIds = array_keys($matches);
            $matchedUserIds = [...$matchedUserIds, ...$userIds];

            $classification = match (true) {
                count($userIds) === 0 => AdpSyncCandidate::CLASS_NEW,
                count($userIds) === 1 => AdpSyncCandidate::CLASS_MATCHED,
                default => AdpSyncCandidate::CLASS_AMBIGUOUS,
            };

            $possibleMatches = array_map(fn ($m) => [
                'user_id' => $m['user']->id,
                'match_type' => $m['type'],
            ], array_values($matches));

            $candidate = $this->persistCandidate($company, $worker, $classification, $possibleMatches);

            // Ya resuelto (vinculado / creado / ignorado): no se muestra en la revision.
            if ($candidate->status !== AdpSyncCandidate::STATUS_PENDING) {
                continue;
            }

            $bucket = match ($classification) {
                AdpSyncCandidate::CLASS_NEW => 'new',
                AdpSyncCandidate::CLASS_MATCHED => 'matched',
                default => 'ambiguous',
            };
            $groups[$bucket][] = $this->hydrateCandidate($candidate, $usersById);
        }

        $onlyInBosmetrics = $index['all']
            ->reject(fn ($u) => in_array($u->id, $matchedUserIds, true))
            ->map(fn ($u) => $this->userSummary($u))
            ->values()
            ->all();

        return [
            'amazon_id_available' => $workers->contains(fn ($w) => filled($w->amazon_id)),
            'counts' => [
                'matched' => count($groups['matched']),
                'ambiguous' => count($groups['ambiguous']),
                'new' => count($groups['new']),
                'only_in_bosmetrics' => count($onlyInBosmetrics),
            ],
            'matched' => $groups['matched'],
            'ambiguous' => $groups['ambiguous'],
            'new' => $groups['new'],
            'only_in_bosmetrics' => $onlyInBosmetrics,
        ];
    }

    /**
     * Refresca datos no destructivos de los drivers ya vinculados (adp_aoid presente).
     * Lo usa el cron: solo rellena huecos, nunca pisa lo que el admin edito.
     */
    public function refreshLinkedWorkers(Company $company, Collection $workers): int
    {
        $byAoid = $company->users()->whereNotNull('adp_aoid')->get()->keyBy('adp_aoid');
        $updated = 0;

        foreach ($workers as $worker) {
            $user = $byAoid->get($worker->aoid);
            if (! $user) {
                continue;
            }

            $dirty = false;
            if (! $user->adp_linked) {
                $user->adp_linked = true;
                $dirty = true;
            }
            $isActive = $worker->status === 'Active';
            if ($user->adp_active !== $isActive) {
                $user->adp_active = $isActive;
                $dirty = true;
            }
            if (blank($user->adp_worker_id) && filled($worker->worker_id)) {
                $user->adp_worker_id = $worker->worker_id;
                $dirty = true;
            }
            if (blank($user->adp_manager_aoid) && filled($worker->manager_aoid)) {
                $user->adp_manager_aoid = $worker->manager_aoid;
                $dirty = true;
            }
            if (blank($user->phone_number) && $worker->primaryPhone()) {
                $user->phone_number = $worker->primaryPhone();
                $dirty = true;
            }

            if ($dirty) {
                $user->save();
                $updated++;
            }
        }

        return $updated;
    }

    /**
     * Aplica las decisiones del admin desde la pantalla de revision.
     *
     * @param  array  $decisions  cada item: ['aoid'=>, 'action'=>'link|create|ignore',
     *                            'user_id'?, 'driver_amazon_id'?, 'firstname'?, 'lastname'?,
     *                            'email'?, 'phone_number'?, 'position_id'?, 'jobsite_id'?]
     */
    public function confirm(Company $company, array $decisions): array
    {
        $result = ['linked' => 0, 'created' => 0, 'ignored' => 0, 'errors' => []];

        DB::transaction(function () use ($company, $decisions, &$result): void {
            foreach ($decisions as $decision) {
                $aoid = data_get($decision, 'aoid');
                $action = data_get($decision, 'action');

                $candidate = AdpSyncCandidate::where('company_id', $company->id)
                    ->where('adp_aoid', $aoid)
                    ->first();

                if (! $candidate) {
                    $result['errors'][] = "Candidate {$aoid} not found.";

                    continue;
                }

                try {
                    if ($action === 'link') {
                        $user = $this->applyLink($company, $candidate, $decision);
                        $candidate->update(['status' => AdpSyncCandidate::STATUS_LINKED, 'resolved_user_id' => $user->id]);
                        $result['linked']++;
                    } elseif ($action === 'create') {
                        $user = $this->applyCreate($company, $candidate, $decision);
                        $candidate->update(['status' => AdpSyncCandidate::STATUS_CREATED, 'resolved_user_id' => $user->id]);
                        $result['created']++;
                    } elseif ($action === 'ignore') {
                        $candidate->update(['status' => AdpSyncCandidate::STATUS_IGNORED]);
                        $result['ignored']++;
                    } else {
                        $result['errors'][] = "Invalid action for {$aoid}: {$action}.";
                    }
                } catch (\Throwable $e) {
                    $result['errors'][] = "Error with {$aoid}: ".$e->getMessage();
                }
            }

        });

        // El conteo de licencias (Stripe) es secundario: si la suscripcion esta en mal
        // estado (incomplete_expired, etc.) no debe revertir la sincronizacion ya aplicada.
        try {
            \SubscriptionService::updateSeats(
                $company,
                $company->users()->where('firstName', '<>', 'Bos Metrics Admin')->count()
            );
        } catch (\Throwable $e) {
            $result['errors'][] = 'Drivers synced, but seat count could not be updated: '.$e->getMessage();
        }

        return $result;
    }

    /**
     * Crea EN LOTE todos los candidatos nuevos ACTIVOS pendientes (omitiendo emails ya
     * usados o duplicados). Usa inserts masivos para ser rapido aunque sean cientos:
     * un insert para los usuarios, uno para los roles y un update para los candidatos.
     */
    public function bulkCreateActive(Company $company): array
    {
        @set_time_limit(0);

        $candidates = AdpSyncCandidate::where('company_id', $company->id)
            ->where('classification', AdpSyncCandidate::CLASS_NEW)
            ->where('status', AdpSyncCandidate::STATUS_PENDING)
            ->get()
            ->filter(fn ($c) => data_get($c->payload, 'status') === 'Active');

        // Emails ya tomados (email es unique global): se omiten.
        $candidateEmails = $candidates
            ->map(fn ($c) => mb_strtolower((string) data_get($c->payload, 'emails.0')))
            ->filter()
            ->unique()
            ->all();
        $taken = User::whereIn('email', $candidateEmails)
            ->pluck('email')
            ->map(fn ($e) => mb_strtolower($e))
            ->all();

        // AOIDs ya vinculados EN ESTA COMPANIA: el mismo trabajador puede existir en
        // otra compania (cuenta de ADP compartida), pero no dos veces en la misma.
        $linkedAoids = $company->users()
            ->whereNotNull('adp_aoid')
            ->pluck('adp_aoid')
            ->all();

        $password = Hash::make(Str::random(40)); // placeholder compartido (todos deben resetear)
        $now = now();
        $rows = [];
        $aoids = [];
        $skipped = 0;

        foreach ($candidates as $candidate) {
            $email = data_get($candidate->payload, 'emails.0');
            $key = mb_strtolower((string) $email);
            if (blank($email) || in_array($key, $taken, true) || in_array($candidate->adp_aoid, $linkedAoids, true)) {
                $skipped++;

                continue;
            }
            $taken[] = $key; // evita duplicados dentro del mismo lote
            $linkedAoids[] = $candidate->adp_aoid;

            $rows[] = [
                'firstname' => data_get($candidate->payload, 'firstname'),
                'lastname' => data_get($candidate->payload, 'lastname'),
                'email' => $email,
                'password' => $password,
                'phone_number' => data_get($candidate->payload, 'phones.0'),
                'driver_amazon_id' => data_get($candidate->payload, 'amazon_id'),
                'company_id' => $company->id,
                'adp_aoid' => $candidate->adp_aoid,
                'adp_worker_id' => data_get($candidate->payload, 'worker_id'),
                'adp_linked' => true,
                'adp_active' => true,
                'adp_manager_aoid' => data_get($candidate->payload, 'manager_aoid'),
                'created_at' => $now,
                'updated_at' => $now,
            ];
            $aoids[] = $candidate->adp_aoid;
        }

        if (empty($rows)) {
            return ['created' => 0, 'skipped' => $skipped];
        }

        DB::transaction(function () use ($rows, $aoids, $company): void {
            foreach (array_chunk($rows, 500) as $chunk) {
                User::insert($chunk);
            }

            $created = User::where('company_id', $company->id)
                ->whereIn('adp_aoid', $aoids)
                ->get(['id', 'adp_aoid']);

            // Rol 'user' en lote.
            $roleId = \Spatie\Permission\Models\Role::where('name', Roles::USER)
                ->where('guard_name', 'web')
                ->value('id');
            if ($roleId) {
                $roleRows = $created->map(fn ($u) => [
                    'role_id' => $roleId,
                    'model_type' => $u->getMorphClass(),
                    'model_id' => $u->id,
                ])->all();
                foreach (array_chunk($roleRows, 500) as $chunk) {
                    DB::table('model_has_roles')->insertOrIgnore($chunk);
                }
            }

            // Marcar candidatos como creados.
            $byAoid = $created->keyBy('adp_aoid');
            foreach ($aoids as $aoid) {
                $user = $byAoid->get($aoid);
                if ($user) {
                    AdpSyncCandidate::where('company_id', $company->id)
                        ->where('adp_aoid', $aoid)
                        ->update(['status' => AdpSyncCandidate::STATUS_CREATED, 'resolved_user_id' => $user->id]);
                }
            }
        });

        try {
            \SubscriptionService::updateSeats(
                $company,
                $company->users()->where('firstName', '<>', 'Bos Metrics Admin')->count()
            );
        } catch (\Throwable $e) {
            // El conteo de licencias es secundario; no debe afectar la creacion.
        }

        return ['created' => count($rows), 'skipped' => $skipped];
    }

    public function hydrateCandidate(AdpSyncCandidate $candidate, Collection $usersById): array
    {
        $possible = $candidate->possible_matches ?? [];

        return [
            'id' => $candidate->id,
            'adp_aoid' => $candidate->adp_aoid,
            'classification' => $candidate->classification,
            'status' => $candidate->status,
            'resolved_user_id' => $candidate->resolved_user_id,
            'worker' => $candidate->payload,
            'possible_matches' => array_map(function ($m) use ($usersById) {
                $user = $usersById->get($m['user_id']);

                return [
                    'user_id' => $m['user_id'],
                    'match_type' => $m['match_type'],
                    'user' => $user ? $this->userSummary($user) : null,
                ];
            }, $possible),
        ];
    }

    // ----------------------------------------------------------------------------------

    private function connectionFor(Company $company): AdpConnection
    {
        $connection = $company->adpConnection;

        if (! $connection || ! $connection->active || ! $connection->isConfigured()) {
            throw new AdpException('This company has no active ADP connection configured. Set it up in ADP Settings.');
        }

        return $connection;
    }

    /**
     * Indexa los users de la compania por cada criterio de matching (listas para colisiones).
     */
    private function indexUsers(Company $company): array
    {
        $users = $company->users()->get();

        $index = [
            'all' => $users,
            'by_aoid' => [],
            'by_amazon' => [],
            'by_email' => [],
            'by_phone' => [],
            'by_name' => [],
        ];

        foreach ($users as $user) {
            if (filled($user->adp_aoid)) {
                $index['by_aoid'][$user->adp_aoid] = $user;
            }
            if (filled($user->driver_amazon_id)) {
                $index['by_amazon'][mb_strtolower(trim($user->driver_amazon_id))][] = $user;
            }
            if (filled($user->email)) {
                $index['by_email'][mb_strtolower(trim($user->email))][] = $user;
            }
            if ($phoneKey = AdpWorkerData::phoneKey($user->phone_number)) {
                $index['by_phone'][$phoneKey][] = $user;
            }
            $nameKey = trim(mb_strtolower(trim((string) $user->firstname).' '.trim((string) $user->lastname)));
            if ($nameKey !== '') {
                $index['by_name'][$nameKey][] = $user;
            }
        }

        return $index;
    }

    /**
     * Devuelve [user_id => ['user'=>User, 'type'=>string, 'rank'=>int]] con el mejor
     * (mas prioritario) match_type por usuario, aplicando la logica OR.
     */
    private function matchWorker(AdpWorkerData $worker, array $index): array
    {
        $matches = [];

        $add = function (User $user, string $type) use (&$matches): void {
            $rank = self::MATCH_PRIORITY[$type];
            if (! isset($matches[$user->id]) || $rank < $matches[$user->id]['rank']) {
                $matches[$user->id] = ['user' => $user, 'type' => $type, 'rank' => $rank];
            }
        };

        if (isset($index['by_aoid'][$worker->aoid])) {
            $add($index['by_aoid'][$worker->aoid], 'aoid');
        }

        if ($worker->amazon_id) {
            foreach ($index['by_amazon'][mb_strtolower(trim($worker->amazon_id))] ?? [] as $user) {
                $add($user, 'amazon_id');
            }
        }

        foreach ($worker->emails as $email) {
            foreach ($index['by_email'][$email] ?? [] as $user) {
                $add($user, 'email');
            }
        }

        foreach ($worker->phones as $phone) {
            $key = AdpWorkerData::phoneKey($phone);
            foreach ($index['by_phone'][$key] ?? [] as $user) {
                $add($user, 'phone');
            }
        }

        if ($nameKey = $worker->fullNameKey()) {
            foreach ($index['by_name'][$nameKey] ?? [] as $user) {
                $add($user, 'name');
            }
        }

        return $matches;
    }

    private function persistCandidate(Company $company, AdpWorkerData $worker, string $classification, array $possibleMatches): AdpSyncCandidate
    {
        $candidate = AdpSyncCandidate::firstOrNew([
            'company_id' => $company->id,
            'adp_aoid' => $worker->aoid,
        ]);

        $candidate->payload = $worker->toArray();
        $candidate->possible_matches = $possibleMatches;
        $candidate->classification = $classification;

        // No pisar una decision ya tomada (linked/created/ignored); solo (re)evaluar pendientes/nuevos.
        if (! $candidate->exists || $candidate->status === AdpSyncCandidate::STATUS_PENDING) {
            $isLinkedByAoid = count($possibleMatches) === 1 && $possibleMatches[0]['match_type'] === 'aoid';

            if ($isLinkedByAoid) {
                $candidate->status = AdpSyncCandidate::STATUS_LINKED;
                $candidate->resolved_user_id = $possibleMatches[0]['user_id'];
            } else {
                $candidate->status = AdpSyncCandidate::STATUS_PENDING;
            }
        }

        $candidate->save();

        return $candidate;
    }

    private function applyLink(Company $company, AdpSyncCandidate $candidate, array $decision): User
    {
        $user = $company->users()->findOrFail(data_get($decision, 'user_id'));
        $worker = $candidate->payload;

        $user->adp_aoid = $candidate->adp_aoid;
        $user->adp_worker_id = data_get($worker, 'worker_id');
        $user->adp_linked = true;
        $user->adp_active = data_get($worker, 'status') === 'Active';
        $user->adp_manager_aoid = data_get($worker, 'manager_aoid');
        $user->phone_number = $user->phone_number ?: data_get($worker, 'phones.0');

        // Completar el amazon id solo si el driver no lo tenia (manual o desde ADP).
        if (blank($user->driver_amazon_id)) {
            $user->driver_amazon_id = data_get($decision, 'driver_amazon_id') ?: data_get($worker, 'amazon_id');
        }

        $user->save();

        return $user;
    }

    private function applyCreate(Company $company, AdpSyncCandidate $candidate, array $decision): User
    {
        $worker = $candidate->payload;

        $email = data_get($decision, 'email') ?: data_get($worker, 'emails.0');
        if (blank($email)) {
            throw new AdpException('The worker has no email in ADP; an email is required to create the driver.');
        }

        // El AOID solo puede repetirse entre companias distintas (cuenta de ADP
        // compartida), nunca dentro de la misma: ahi ya existe ese driver.
        $sameCompany = $company->users()->where('adp_aoid', $candidate->adp_aoid)->first();
        if ($sameCompany) {
            throw new AdpException(
                "The ADP worker {$candidate->adp_aoid} is already linked to {$sameCompany->firstname} {$sameCompany->lastname} in this company."
            );
        }

        // El email es el usuario de acceso: tiene que ser unico en todo el sistema.
        if ($owner = User::where('email', $email)->first()) {
            throw new AdpException(
                "The email {$email} is already used by another user ({$owner->firstname} {$owner->lastname}"
                .($owner->company_id === $company->id ? '' : ' in company '.($owner->company?->name ?: $owner->company_id))
                .'). Change the email to create this driver.'
            );
        }

        $user = User::create([
            'firstname' => data_get($decision, 'firstname') ?: data_get($worker, 'firstname'),
            'lastname' => data_get($decision, 'lastname') ?: data_get($worker, 'lastname'),
            'email' => $email,
            // Placeholder seguro: no enviamos invitacion al sincronizar (el admin la dispara luego).
            'password' => Hash::make(Str::random(40)),
            'phone_number' => data_get($decision, 'phone_number') ?: data_get($worker, 'phones.0'),
            'driver_amazon_id' => data_get($decision, 'driver_amazon_id') ?: data_get($worker, 'amazon_id'),
            'company_id' => $company->id,
            'adp_aoid' => $candidate->adp_aoid,
            'adp_worker_id' => data_get($worker, 'worker_id'),
            'adp_linked' => true,
            'adp_active' => data_get($worker, 'status') === 'Active',
            'adp_manager_aoid' => data_get($worker, 'manager_aoid'),
        ]);

        $user->assignRole(Roles::USER);

        if ($positionId = data_get($decision, 'position_id')) {
            if ($position = Position::where('company_id', $company->id)->find($positionId)) {
                $user->positions()->attach($position->id);
            }
        }

        if ($jobsiteId = data_get($decision, 'jobsite_id')) {
            if ($jobsite = Jobsite::find($jobsiteId)) {
                $user->jobsites()->attach($jobsite->id);
            }
        }

        return $user;
    }

    private function userSummary(User $user): array
    {
        return [
            'id' => $user->id,
            'firstname' => $user->firstname,
            'lastname' => $user->lastname,
            'email' => $user->email,
            'phone_number' => $user->phone_number,
            'driver_amazon_id' => $user->driver_amazon_id,
            'adp_aoid' => $user->adp_aoid,
        ];
    }
}
