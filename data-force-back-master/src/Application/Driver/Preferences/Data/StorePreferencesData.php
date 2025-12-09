<?php

namespace Src\Application\Driver\Preferences\Data;

use Carbon\Carbon;
use Spatie\LaravelData\Attributes\Validation\Unique;
use Spatie\LaravelData\Data;

class StorePreferencesData extends Data
{
    public function __construct(
        public ?int $id,
        #[Unique('preferences', 'date')]
        public Carbon $date,
        public bool $available
    ) {}

    public static function createFromArray(array $data): self
    {
        return new self(
            id: $data['id'] ?? null,
            date: Carbon::parse($data['date']),
            available: $data['available']
        );
    }
}
