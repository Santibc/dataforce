<?php

namespace Src\Application\Admin\Adp\Data;

use Spatie\LaravelData\Data;

class UpdateAdpConnectionData extends Data
{
    public function __construct(
        public string $client_id,
        public string $client_secret,
        public string $certificate_pem,
        public string $private_key,
        public ?string $base_url,
        public ?string $token_url,
        public ?bool $active,
    ) {
    }

    public static function rules(): array
    {
        return [
            'client_id' => ['required', 'string'],
            'client_secret' => ['required', 'string'],
            // PEM del certificado y de la clave privada (texto multilinea).
            'certificate_pem' => ['required', 'string'],
            'private_key' => ['required', 'string'],
            'base_url' => ['nullable', 'url'],
            'token_url' => ['nullable', 'url'],
            'active' => ['nullable', 'boolean'],
        ];
    }
}
