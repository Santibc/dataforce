<?php

namespace Src\Application\Admin\Adp\Controllers;

use Illuminate\Http\JsonResponse;
use Src\Application\Admin\Adp\Data\UpdateAdpConnectionData;
use Src\Domain\Adp\Models\AdpConnection;

class AdpConnectionController
{
    /**
     * Estado de la conexion de ADP de la compania (nunca expone secretos).
     */
    public function show(): JsonResponse
    {
        $connection = auth()->user()->company->adpConnection;

        return response()->json([
            'configured' => $connection?->isConfigured() ?? false,
            'active' => $connection?->active ?? false,
            'client_id' => $connection?->client_id,
            'base_url' => $connection?->base_url,
            'token_url' => $connection?->token_url,
            'token_expires_at' => $connection?->token_expires_at,
            'has_certificate' => filled($connection?->certificate_pem),
        ]);
    }

    /**
     * Crea o actualiza las credenciales de ADP de la compania.
     */
    public function update(UpdateAdpConnectionData $data): JsonResponse
    {
        $company = auth()->user()->company;

        $connection = $company->adpConnection ?: new AdpConnection;
        $connection->fill([
            'company_id' => $company->id,
            'client_id' => $data->client_id,
            'client_secret' => $data->client_secret,
            'certificate_pem' => $data->certificate_pem,
            'private_key' => $data->private_key,
            'base_url' => $data->base_url ?: 'https://api.adp.com',
            'token_url' => $data->token_url ?: 'https://accounts.adp.com/auth/oauth/v2/token',
            'active' => $data->active ?? true,
        ]);

        // Invalidar el token cacheado al cambiar credenciales.
        $connection->cached_token = null;
        $connection->token_expires_at = null;
        $connection->save();

        return response()->json(['message' => 'ADP connection saved successfully.']);
    }
}
