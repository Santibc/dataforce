<?php

namespace Src\Application\Admin\Adp\Data;

use Illuminate\Validation\Rule;
use Spatie\LaravelData\Data;

class UpdateAdpConnectionData extends Data
{
    public function __construct(
        public string $client_id,
        public ?string $client_secret,
        public ?string $certificate_pem,
        public ?string $private_key,
        public ?string $base_url,
        public ?string $token_url,
        public ?bool $active,
    ) {
    }

    public static function rules(): array
    {
        // Si la compania ya tiene credenciales guardadas, los secretos son
        // opcionales: al llegar vacios se conservan los que ya estan en la BD.
        $required = Rule::requiredIf(
            fn () => ! (auth()->user()?->company?->adpConnection?->isConfigured() ?? false)
        );

        return [
            'client_id' => ['required', 'string'],
            'client_secret' => [$required, 'nullable', 'string'],
            // PEM del certificado y de la clave privada (texto multilinea).
            'certificate_pem' => [$required, 'nullable', 'string'],
            'private_key' => [$required, 'nullable', 'string'],
            'base_url' => ['nullable', 'url'],
            'token_url' => ['nullable', 'url'],
            'active' => ['nullable', 'boolean'],
        ];
    }
}
