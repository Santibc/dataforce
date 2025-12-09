<?php

namespace Src\Application\Admin\Position\Data;

use Carbon\Carbon;
use Spatie\LaravelData\Data;

class StorePositionData extends Data
{
    public function __construct(
        public string $name,
        public Carbon $from,
        public Carbon $to,
        public string $color
    ) {}
}
