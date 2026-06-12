<?php

namespace Tests\Application\Admin\Adp\Controllers;

use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;
use Src\Domain\Adp\Models\AdpConnection;
use Src\Domain\User\Enums\Roles;
use Src\Domain\User\Models\User;
use Tests\TestCase;

class AdpConnectionControllerTest extends TestCase
{
    // El APP_URL del proyecto esta malformado/usa un subpath; usamos URLs absolutas
    // a http://localhost para que el path resuelva a la raiz y haga match en los tests.
    private const BASE = 'http://localhost';

    /** @test */
    public function admin_can_save_and_read_adp_connection_without_leaking_secrets(): void
    {
        $admin = User::factory()->withRole(Roles::ADMIN)->create();

        $payload = [
            'client_id' => '7601a239-test',
            'client_secret' => 'super-secret-value',
            'certificate_pem' => "-----BEGIN CERTIFICATE-----\nX\n-----END CERTIFICATE-----",
            'private_key' => "-----BEGIN PRIVATE KEY-----\nY\n-----END PRIVATE KEY-----",
        ];

        $this->actingAs($admin)->putJson(self::BASE.'/api/admin/adp/connection', $payload)->assertOk();

        // El secreto se guarda CIFRADO en BD (la columna no contiene el valor en claro).
        $row = DB::table('adp_connections')->where('company_id', $admin->company_id)->first();
        $this->assertNotNull($row);
        $this->assertStringNotContainsString('super-secret-value', (string) $row->client_secret);

        // El modelo lo descifra correctamente.
        $connection = AdpConnection::where('company_id', $admin->company_id)->first();
        $this->assertSame('super-secret-value', $connection->client_secret);
        $this->assertTrue($connection->isConfigured());

        // El endpoint show reporta el estado pero NO expone secretos.
        // (user fresco: en un request real la relacion adpConnection se carga de cero)
        $response = $this->actingAs($admin->fresh())->getJson(self::BASE.'/api/admin/adp/connection')->assertOk();
        $response->assertJson([
            'configured' => true,
            'active' => true,
            'has_certificate' => true,
            'client_id' => '7601a239-test',
        ]);
        $this->assertStringNotContainsString('super-secret-value', $response->getContent());
    }

    /** @test */
    public function manager_role_cannot_access_adp_endpoints(): void
    {
        // 'manager' pasa el grupo admin general pero NO el sub-grupo de ADP (admin/owner).
        Role::firstOrCreate(['name' => 'manager', 'guard_name' => 'web']);
        $manager = User::factory()->withRole('manager')->create();

        $this->actingAs($manager)->getJson(self::BASE.'/api/admin/adp/connection')->assertForbidden();
    }
}
