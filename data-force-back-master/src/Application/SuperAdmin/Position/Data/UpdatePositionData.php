<?php

namespace Src\Application\SuperAdmin\Position\Data;

use Carbon\Carbon;
use Spatie\LaravelData\Data;

class UpdatePositionData extends Data
{
    public function __construct(
        public int $id,
        public string $name,
        public Carbon $from,
        public Carbon $to,
        public string $color,
    ) {}
}
