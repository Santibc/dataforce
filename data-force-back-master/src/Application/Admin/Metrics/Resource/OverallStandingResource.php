<?php

namespace Src\Application\Admin\Metrics\Resource;

use Spatie\LaravelData\Data;

class OverallStandingResource extends Data
{
    public function __construct(
        public ?string $value,
        public ?int $week,
        public ?int $year,
    ) {}
}
