<?php

namespace Src\Application\Admin\Metrics\Data;

use Spatie\LaravelData\Data;

class GetMetricsParams extends Data
{
    public function __construct(
        public int|string $week,
        public int|string $year
    ) {}
}
