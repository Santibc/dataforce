<?php

namespace Src\Application\Driver\Coaching\Data;

use Spatie\LaravelData\Data;

class GetCoachingData extends Data
{
    public function __construct(
        public string|int $week,
        public string|int $year
    ) {}
}
