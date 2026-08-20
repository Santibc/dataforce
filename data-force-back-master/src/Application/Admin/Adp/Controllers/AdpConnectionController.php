<?php

namespace Src\Application\Admin\Adp\Controllers;

use Illuminate\Http\JsonResponse;
use Src\Application\Admin\Adp\Data\UpdateAdpConnectionData;
use Src\Domain\Adp\Models\AdpConnection;

class AdpConnectionController
{
    /**
     * Estado y datos guardados de la conexion de ADP de la compania.
     * Los secretos (client secret y private key) solo se devuelven enmascarados.
     */
    public function show(): JsonResponse
    {
        $connection = auth()->user()->company->adpConnection;

        return response()->json([
            'configured' => $connection?->isConfigured() ?? false,
            'active' => $connection?->active ?? true,
            'client_id' => $connection?->client_id,
            'base_url' => $connection?->base_url ?: 'https://api.adp.com',
            'token_url' => $connection?->token_url ?: 'https://accounts.adp.com/auth/oauth/v2/token',
            'token_expires_at' => $connection?->token_expires_at,
            // El certificado es la parte publica del par: se devuelve completo.
            'certificate_pem' => $connection?->certificate_pem,
            'has_certificate' => filled($connection?->certificate_pem),
            'has_client_secret' => filled($connection?->client_secret),
            'client_secret_preview' => $this->mask($connection?->client_secret),
            'has_private_key' => filled($connection?->private_key),
            'private_key_preview' => $this->maskPem($connection?->private_key),
            'updated_at' => $connection?->updated_at,
        ]);
    }

    /**
     * Crea o actualiza las credenciales de ADP de la compania.
     * Los secretos que lleguen vacios conservan el valor ya guardado.
     */
    public function update(UpdateAdpConnectionData $data): JsonResponse
    {
        $company = auth()->user()->company;

        $connection = $company->adpConnection ?: new AdpConnection;
        $connection->fill([
            'company_id' => $company->id,
            'client_id' => $data->client_id,
            'base_url' => $data->base_url ?: 'https://api.adp.com',
            'token_url' => $data->token_url ?: 'https://accounts.adp.com/auth/oauth/v2/token',
            'active' => $data->active ?? true,
        ]);

        foreach ([
            'client_secret' => $data->client_secret,
            'certificate_pem' => $data->certificate_pem,
            'private_key' => $data->private_key,
        ] as $field => $value) {
            if (filled($value)) {
                $connection->{$field} = $value;
            }
        }

        // Invalidar el token cacheado al cambiar credenciales.
        $connection->cached_token = null;
        $connection->token_expires_at = null;
        $connection->save();

        return response()->json(['message' => 'ADP connection saved successfully.']);
    }

    /**
     * Deja visibles solo los ultimos 4 caracteres de un secreto.
     */
    private function mask(?string $value): ?string
    {
        if (blank($value)) {
            return null;
        }

        return str_repeat('•', 8).substr($value, -4);
    }

    /**
     * Muestra unicamente la cabecera del PEM de la clave privada.
     */
    private function maskPem(?string $value): ?string
    {
        if (blank($value)) {
            return null;
        }

        $header = trim(strtok($value, "\n") ?: '');

        return $header."\n".str_repeat('•', 32)."\n(hidden)";
    }
}
