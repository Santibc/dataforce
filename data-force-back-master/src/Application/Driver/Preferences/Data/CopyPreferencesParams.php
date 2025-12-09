<?php

namespace Src\Application\Driver\Preferences\Data;

use Carbon\Carbon;
use Spatie\LaravelData\Data;

class CopyPreferencesParams extends Data
{
    public function __construct(
        public string|Carbon $date
    ) {}
}
