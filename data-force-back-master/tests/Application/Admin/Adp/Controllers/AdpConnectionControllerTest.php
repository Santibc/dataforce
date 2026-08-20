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
    public function show_returns_saved_data_to_prefill_the_form_and_secrets_are_kept_when_resaving_blank(): void
    {
        $admin = User::factory()->withRole(Roles::ADMIN)->create();
        $certificate = '-----BEGIN CERTIFICATE-----
X
-----END CERTIFICATE-----';

        $this->actingAs($admin)->putJson(self::BASE.'/api/admin/adp/connection', [
            'client_id' => '7601a239-test',
            'client_secret' => 'super-secret-value',
            'certificate_pem' => $certificate,
            'private_key' => '-----BEGIN PRIVATE KEY-----
Y
-----END PRIVATE KEY-----',
            'base_url' => 'https://api.adp.com',
        ])->assertOk();

        // Al volver a entrar, la pantalla recibe los datos guardados: client id,
        // urls, certificado completo y los secretos solo enmascarados.
        $response = $this->actingAs($admin->fresh())
            ->getJson(self::BASE.'/api/admin/adp/connection')
            ->assertOk();

        $response->assertJson([
            'client_id' => '7601a239-test',
            'base_url' => 'https://api.adp.com',
            'token_url' => 'https://accounts.adp.com/auth/oauth/v2/token',
            'certificate_pem' => $certificate,
            'has_client_secret' => true,
            'has_private_key' => true,
        ]);
        $this->assertStringEndsWith('alue', $response->json('client_secret_preview'));
        $this->assertStringNotContainsString('super-secret-value', $response->getContent());

        // Guardar de nuevo sin escribir los secretos NO los borra.
        $this->actingAs($admin->fresh())->putJson(self::BASE.'/api/admin/adp/connection', [
            'client_id' => '7601a239-updated',
        ])->assertOk();

        $connection = AdpConnection::where('company_id', $admin->company_id)->first();
        $this->assertSame('7601a239-updated', $connection->client_id);
        $this->assertSame('super-secret-value', $connection->client_secret);
        $this->assertTrue($connection->isConfigured());
    }

    /** @test */
    public function first_time_configuration_requires_the_secrets(): void
    {
        $admin = User::factory()->withRole(Roles::ADMIN)->create();

        $this->actingAs($admin)
            ->putJson(self::BASE.'/api/admin/adp/connection', ['client_id' => 'only-id'])
            ->assertStatus(422)
            ->assertJson(fn ($json) => $json->has('messages')->etc());

        // El handler del proyecto devuelve los errores como lista de mensajes.
        $messages = implode(' ', $this->actingAs($admin->fresh())
            ->putJson(self::BASE.'/api/admin/adp/connection', ['client_id' => 'only-id'])
            ->json('messages'));

        $this->assertStringContainsString('client secret', $messages);
        $this->assertStringContainsString('certificate pem', $messages);
        $this->assertStringContainsString('private key', $messages);
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
