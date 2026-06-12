<?php

namespace Src\Application\Admin\Adp\Data;

use Spatie\LaravelData\Data;

/**
 * Una decision del admin sobre un trabajador de ADP en la pantalla de revision.
 * action: link (vincular a user_id), create (crear driver nuevo) o ignore.
 */
class AdpSyncDecisionData extends Data
{
    public function __construct(
        public string $aoid,
        public string $action,
        public ?int $user_id,
        public ?string $firstname,
        public ?string $lastname,
        public ?string $email,
        public ?string $phone_number,
        public ?string $driver_amazon_id,
        public ?int $position_id,
        public ?int $jobsite_id,
    ) {
    }

    public static function rules(): array
    {
        return [
            'aoid' => ['required', 'string'],
            'action' => ['required', 'in:link,create,ignore'],
            'user_id' => ['nullable', 'integer', 'required_if:action,link'],
            'email' => ['nullable', 'email'],
        ];
    }
}
