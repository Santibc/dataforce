<?php

namespace Src\Application\Driver\Shifts\Data;

use Carbon\Carbon;
use Spatie\LaravelData\Data;

class ConfirmShiftsParams extends Data
{
    public function __construct(
        public string|Carbon $from,
        public string|Carbon $to,
    ) {}
}
