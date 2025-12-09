<?php

namespace Src\Application\Driver\Performance\Data;

use Spatie\LaravelData\Data;

class GetPerformanceParams extends Data
{
    public function __construct(
        public string|int $week,
        public string|int $year,
        public string|int $user_id
    ) {}
}
