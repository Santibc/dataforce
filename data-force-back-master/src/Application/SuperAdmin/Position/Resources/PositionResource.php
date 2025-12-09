<?php

namespace Src\Application\SuperAdmin\Position\Resources;

use Spatie\LaravelData\Data;

class PositionResource extends Data
{
    public function __construct(
        public int $id,
        public string $name,
        public string $from,
        public string $to,
        public string $color,
    ) {}
}
