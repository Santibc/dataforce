<?php

namespace Src\Application\Driver\Preferences\Resource;

use Spatie\LaravelData\Data;
use Src\Domain\Preferences\Models\Preference;

class PreferencesResource extends Data
{
    public function __construct(
        public int $id,
        public bool $available,
        public string $date
    ) {}

    public static function fromModel(Preference $preference): self
    {
        return new self(
            $preference->id,
            $preference->available,
            $preference->date,
        );
    }
}
