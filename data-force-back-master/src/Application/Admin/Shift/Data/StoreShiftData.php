<?php

namespace Src\Application\Admin\Shift\Data;

use Carbon\Carbon;
use Spatie\LaravelData\Data;

class StoreShiftData extends Data
{
    public function __construct(
        public string $name,
        public Carbon $from,
        public Carbon $to,
        public string $color,
        public int $jobsite_id,
        public int $user_id
    ) {}
}
