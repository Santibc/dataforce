<?php

namespace Src\Application\Driver\Schedule\Data;

use Carbon\Carbon;
use Spatie\LaravelData\Data;

class ScheduleParams extends Data
{
    public function __construct(
        public string|Carbon $from,
        public string|Carbon $to,
    ) {}
}
