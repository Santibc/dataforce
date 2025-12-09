<?php

namespace Src\Application\Driver\Preferences\Data;

use Carbon\Carbon;
use Spatie\LaravelData\Data;

class GetPreferecesParams extends Data
{
    public function __construct(
        public string|Carbon $from,
        public string|Carbon $to,
    ) {}
}
