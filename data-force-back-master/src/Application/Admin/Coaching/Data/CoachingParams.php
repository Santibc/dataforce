<?php

namespace Src\Application\Admin\Coaching\Data;

use Spatie\LaravelData\Data;

class CoachingParams extends Data
{
    public function __construct(
        public int|string $week_from,
        public int|string $week_to,
        public int|string $year,
    ) {}
}
