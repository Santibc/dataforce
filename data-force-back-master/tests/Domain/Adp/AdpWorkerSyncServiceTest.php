<?php

namespace Tests\Domain\Adp;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Notification;
use Spatie\Permission\Models\Role;
use Src\Domain\Adp\Models\AdpConnection;
use Src\Domain\Adp\Services\AdpWorkerSyncService;
use Src\Domain\Company\Models\Company;
use Src\Domain\User\Enums\Roles;
use Src\Domain\User\Models\User;
use Tests\TestCase;

class AdpWorkerSyncServiceTest extends TestCase
{
    /** @test */
    public function build_preview_classifies_workers_with_or_matching(): void
    {
        Role::firstOrCreate(['name' => Roles::USER, 'guard_name' => 'web']);
        $company = Company::factory()->create();

        // Driver existente: matchea por email Y por telefono (con formato distinto).
        $jose = User::factory()->create([
            'company_id' => $company->id,
            'firstname' => 'Jose', 'lastname' => 'Contreras',
            'email' => 'jose@example.com', 'phone_number' => '561-788-0086',
            'driver_amazon_id' => 'NA13', 'adp_aoid' => null,
        ]);

        // Dos drivers para forzar ambiguedad: uno cuadra por email, otro por telefono.
        $userByEmail = User::factory()->create([
            'company_id' => $company->id, 'firstname' => 'Equis', 'lastname' => 'Persona',
            'email' => 'ambi@example.com', 'phone_number' => '111-111-1111',
        ]);
        $userByPhone = User::factory()->create([
            'company_id' => $company->id, 'firstname' => 'Ye', 'lastname' => 'Persona',
            'email' => 'otro@example.com', 'phone_number' => '(555) 000-1111',
        ]);

        $workers = [
            $this->adpWorker('AOID-MATCH', 'Jose', 'Contreras', 'jose@example.com', '5617880086'),
            $this->adpWorker('AOID-NEW', 'Nuevo', 'Trabajador', 'nuevo@example.com', '9999999999'),
            $this->adpWorker('AOID-AMBI', 'Ambiguo', 'Caso', 'ambi@example.com', '5550001111'),
        ];

        $this->makeConnection($company);
        $this->fakeAdp($workers);

        $preview = app(AdpWorkerSyncService::class)->buildPreview($company);

        $this->assertSame(1, $preview['counts']['matched']);
        $this->assertSame(1, $preview['counts']['new']);
        $this->assertSame(1, $preview['counts']['ambiguous']);

        // El matched corresponde a Jose (por email/telefono, logica OR).
        $matched = $preview['matched'][0];
        $this->assertSame('AOID-MATCH', $matched['adp_aoid']);
        $this->assertSame($jose->id, $matched['possible_matches'][0]['user_id']);

        // El ambiguo lista a los DOS candidatos posibles para que el admin elija.
        $ambiguousUserIds = collect($preview['ambiguous'][0]['possible_matches'])->pluck('user_id')->all();
        $this->assertContains($userByEmail->id, $ambiguousUserIds);
        $this->assertContains($userByPhone->id, $ambiguousUserIds);

        // El nuevo queda persistido como candidato pendiente en el staging.
        $this->assertDatabaseHas('adp_sync_candidates', [
            'company_id' => $company->id, 'adp_aoid' => 'AOID-NEW', 'classification' => 'new', 'status' => 'pending',
        ]);
    }

    /** @test */
    public function confirm_links_and_creates_without_sending_notifications(): void
    {
        Notification::fake();
        Role::firstOrCreate(['name' => Roles::USER, 'guard_name' => 'web']);
        $company = Company::factory()->create();

        $jose = User::factory()->create([
            'company_id' => $company->id, 'firstname' => 'Jose', 'lastname' => 'Contreras',
            'email' => 'jose@example.com', 'phone_number' => '5617880086', 'adp_aoid' => null,
        ]);

        $workers = [
            $this->adpWorker('AOID-MATCH', 'Jose', 'Contreras', 'jose@example.com', '5617880086'),
            $this->adpWorker('AOID-NEW', 'Nuevo', 'Driver', 'nuevo@example.com', '9999999999'),
        ];

        $this->makeConnection($company);
        $this->fakeAdp($workers);

        $service = app(AdpWorkerSyncService::class);
        $service->buildPreview($company);

        $result = $service->confirm($company, [
            ['aoid' => 'AOID-MATCH', 'action' => 'link', 'user_id' => $jose->id],
            ['aoid' => 'AOID-NEW', 'action' => 'create'],
        ]);

        $this->assertSame(1, $result['linked']);
        $this->assertSame(1, $result['created']);
        $this->assertEmpty($result['errors']);

        // Jose quedo vinculado por AOID.
        $this->assertSame('AOID-MATCH', $jose->fresh()->adp_aoid);

        // Se creo el nuevo driver con rol user, en la company y vinculado a su AOID.
        $nuevo = User::where('email', 'nuevo@example.com')->first();
        $this->assertNotNull($nuevo);
        $this->assertSame('AOID-NEW', $nuevo->adp_aoid);
        $this->assertSame($company->id, $nuevo->company_id);
        $this->assertTrue($nuevo->hasRole(Roles::USER));

        // Decision del usuario: NO se envia ninguna notificacion al sincronizar.
        Notification::assertNothingSent();

        // Tras confirmar, un nuevo preview ya NO muestra los resueltos (vinculados/creados).
        $preview = $service->buildPreview($company);
        $this->assertSame(0, $preview['counts']['matched']);
        $this->assertSame(0, $preview['counts']['new']);
    }

    /** @test */
    public function bulk_create_active_creates_only_new_active_drivers(): void
    {
        Role::firstOrCreate(['name' => Roles::USER, 'guard_name' => 'web']);
        $company = Company::factory()->create();
        $this->makeConnection($company);

        // 2 activos + 1 terminado, ninguno matchea (la compania no tiene drivers).
        $workers = [
            $this->adpWorker('AOID-A1', 'Active', 'One', 'active1@example.com', '1111111111', 'Active'),
            $this->adpWorker('AOID-A2', 'Active', 'Two', 'active2@example.com', '2222222222', 'Active'),
            $this->adpWorker('AOID-T1', 'Term', 'Three', 'term@example.com', '3333333333', 'Terminated'),
        ];
        $this->fakeAdp($workers);

        $service = app(AdpWorkerSyncService::class);
        $service->buildPreview($company);

        $result = $service->bulkCreateActive($company);

        $this->assertSame(2, $result['created']); // solo los activos
        $this->assertDatabaseHas('users', [
            'email' => 'active1@example.com', 'company_id' => $company->id, 'adp_aoid' => 'AOID-A1', 'adp_linked' => 1,
        ]);
        $this->assertDatabaseHas('users', ['email' => 'active2@example.com', 'adp_aoid' => 'AOID-A2']);
        $this->assertDatabaseMissing('users', ['email' => 'term@example.com']); // terminado NO se crea

        $this->assertTrue(User::where('email', 'active1@example.com')->first()->hasRole(Roles::USER));
    }

    /**
     * Construye un worker crudo con la estructura anidada de /hr/v2/worker-demographics.
     */
    private function adpWorker(string $aoid, string $given, string $family, ?string $email, ?string $phone, string $status = 'Active'): array
    {
        $communication = [];
        if ($email) {
            $communication['emails'] = [['emailUri' => $email]];
        }
        if ($phone) {
            $communication['mobiles'] = [['formattedNumber' => $phone]];
        }

        return [
            'associateOID' => $aoid,
            'workerID' => ['idValue' => 'W'.$aoid],
            'person' => [
                'legalName' => ['givenName' => $given, 'familyName1' => $family],
                'communication' => $communication,
            ],
            'workerStatus' => ['statusCode' => ['codeValue' => $status]],
            'workAssignments' => [[
                'hireDate' => '2024-01-01',
                'positionID' => 'POS1',
                'assignmentStatus' => ['statusCode' => ['codeValue' => 'A']],
            ]],
        ];
    }

    /**
     * Intercepta las llamadas de ADP: token, /meta y la paginacion de worker-demographics.
     */
    private function fakeAdp(array $workers): void
    {
        Http::fake(function ($request) use ($workers) {
            $url = urldecode($request->url());

            if (str_contains($url, '/auth/oauth/v2/token')) {
                return Http::response(['access_token' => 'fake-token', 'expires_in' => 3600], 200);
            }
            if (str_contains($url, '/worker-demographics/meta')) {
                return Http::response(['meta' => ['queryCriteria' => []]], 200);
            }
            if (str_contains($url, '/worker-demographics')) {
                // Primera pagina ($skip=0) devuelve los workers; el resto, fin de coleccion (204).
                if (str_contains($url, '$skip=0')) {
                    return Http::response(['workers' => $workers], 200);
                }

                return Http::response('', 204);
            }

            return Http::response('', 404);
        });
    }

    private function makeConnection(Company $company): AdpConnection
    {
        return AdpConnection::create([
            'company_id' => $company->id,
            'client_id' => 'client-123',
            'client_secret' => 'secret-123',
            'certificate_pem' => "-----BEGIN CERTIFICATE-----\nFAKE\n-----END CERTIFICATE-----",
            'private_key' => "-----BEGIN PRIVATE KEY-----\nFAKE\n-----END PRIVATE KEY-----",
            'active' => true,
        ]);
    }
}
