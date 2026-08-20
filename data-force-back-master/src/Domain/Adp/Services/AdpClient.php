<?php

namespace Src\Domain\Adp\Services;

use Illuminate\Http\Client\Pool;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;
use Src\Domain\Adp\Exceptions\AdpException;
use Src\Domain\Adp\Models\AdpConnection;

/**
 * Cliente HTTP de bajo nivel para ADP API Central (ADP Workforce Now).
 *
 * Se encarga de:
 *  - Autenticacion OAuth client_credentials con mutual TLS (certificado de cliente).
 *  - Cacheo del access token (TTL ~1h) reutilizandolo hasta que esta por expirar.
 *  - GET autenticado contra api.adp.com con reintento ante rate limit (429) y
 *    refresco de token si caduca (ADP puede responder 401 o, como known issue, 400).
 */
class AdpClient
{
    /** Renovar el token si le quedan menos de estos segundos de vida. */
    private const TOKEN_REFRESH_MARGIN = 300;

    /** Intentos maximos del GET ante 429 antes de devolver la respuesta. */
    private const MAX_ATTEMPTS = 4;

    /**
     * Devuelve un access token valido, reutilizando el cacheado mientras no expire.
     */
    public function getAccessToken(AdpConnection $connection, bool $forceRefresh = false): string
    {
        if (! $forceRefresh
            && filled($connection->cached_token)
            && $connection->token_expires_at
            && $connection->token_expires_at->isAfter(now()->addSeconds(self::TOKEN_REFRESH_MARGIN))
        ) {
            return $connection->cached_token;
        }

        return $this->requestToken($connection);
    }

    /**
     * Pide un token nuevo a ADP (client_credentials + mTLS) y lo cachea en la conexion.
     */
    public function requestToken(AdpConnection $connection): string
    {
        $response = $this->withCertificates($connection, fn (string $certPath, string $keyPath) => Http::asForm()
            ->withOptions(['cert' => $certPath, 'ssl_key' => $keyPath])
            ->timeout(30)
            ->post($connection->token_url, [
                'grant_type' => 'client_credentials',
                'client_id' => $connection->client_id,
                'client_secret' => $connection->client_secret,
            ]));

        if (! $response->successful() || blank($response->json('access_token'))) {
            throw new AdpException(
                'Could not obtain ADP token ('.$response->status().'): '.$response->body()
            );
        }

        $token = $response->json('access_token');
        $expiresIn = (int) ($response->json('expires_in') ?: 3600);

        $connection->forceFill([
            'cached_token' => $token,
            'token_expires_at' => now()->addSeconds($expiresIn),
        ])->save();

        return $token;
    }

    /**
     * GET autenticado contra api.adp.com. Maneja rate limit (429, respetando
     * Retry-After) y refresca el token una vez si ADP responde 401/400.
     */
    public function get(AdpConnection $connection, string $path, array $query = []): Response
    {
        $tokenRefreshed = false;

        for ($attempt = 1; ; $attempt++) {
            $token = $this->getAccessToken($connection);

            $response = $this->withCertificates($connection, fn (string $certPath, string $keyPath) => Http::withToken($token)
                ->withOptions(['cert' => $certPath, 'ssl_key' => $keyPath])
                ->withHeaders(['Accept' => 'application/json'])
                ->timeout(60)
                ->get(rtrim($connection->base_url, '/').$path, $query));

            // Rate limit: esperar (Retry-After o backoff exponencial) y reintentar.
            if ($response->status() === 429 && $attempt < self::MAX_ATTEMPTS) {
                $wait = (int) ($response->header('Retry-After') ?: min(30, 2 ** $attempt));
                sleep($wait);

                continue;
            }

            // Token caducado/invalido: forzar refresco y reintentar una sola vez.
            if (in_array($response->status(), [400, 401], true) && ! $tokenRefreshed) {
                $this->getAccessToken($connection, forceRefresh: true);
                $tokenRefreshed = true;

                continue;
            }

            return $response;
        }
    }

    /**
     * GET CONCURRENTE de varios paths con el mismo certificado y token. Procesa en
     * lotes de $concurrency para respetar el limite de ADP (<=10 concurrentes).
     * Acelera mucho cuando hay que consultar muchos drivers uno por uno.
     *
     * @param  string[]  $paths
     * @param  array<string, mixed>  $query  parametros aplicados a todas las peticiones
     * @return array<string, Response|null> [path => Response] (null si la peticion fallo)
     */
    public function getMany(AdpConnection $connection, array $paths, int $concurrency = 8, array $query = []): array
    {
        if (empty($paths)) {
            return [];
        }
        @set_time_limit(0);

        return $this->withCertificates($connection, function (string $certPath, string $keyPath) use ($connection, $paths, $concurrency, $query) {
            $token = $this->getAccessToken($connection);
            $base = rtrim($connection->base_url, '/');
            $results = [];

            foreach (array_chunk($paths, $concurrency) as $chunk) {
                $responses = Http::pool(fn (Pool $pool) => array_map(
                    fn ($path) => $pool
                        ->withToken($token)
                        ->withOptions(['cert' => $certPath, 'ssl_key' => $keyPath])
                        ->withHeaders(['Accept' => 'application/json'])
                        ->timeout(60)
                        ->get($base.$path, $query),
                    $chunk
                ));

                foreach (array_values($chunk) as $i => $path) {
                    $response = $responses[$i] ?? null;
                    $results[$path] = $response instanceof Response ? $response : null;
                }
            }

            return $results;
        });
    }

    /**
     * Materializa el certificado y la clave privada (cifrados en BD) a archivos
     * temporales, ejecuta el callback con sus rutas y los elimina al terminar.
     * Guzzle necesita rutas de archivo para las opciones cert/ssl_key.
     */
    private function withCertificates(AdpConnection $connection, callable $callback): mixed
    {
        if (blank($connection->certificate_pem) || blank($connection->private_key)) {
            throw new AdpException('The ADP connection has no certificate or private key configured.');
        }

        $dir = storage_path('app/adp');
        if (! is_dir($dir)) {
            mkdir($dir, 0700, true);
        }

        $certPath = tempnam($dir, 'adp_cert_');
        $keyPath = tempnam($dir, 'adp_key_');

        try {
            file_put_contents($certPath, $connection->certificate_pem);
            file_put_contents($keyPath, $connection->private_key);
            @chmod($certPath, 0600);
            @chmod($keyPath, 0600);

            return $callback($certPath, $keyPath);
        } finally {
            @unlink($certPath);
            @unlink($keyPath);
        }
    }
}
