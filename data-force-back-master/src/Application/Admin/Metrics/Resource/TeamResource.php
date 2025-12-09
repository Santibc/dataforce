<?php

namespace Src\Application\Admin\Metrics\Resource;

use Spatie\LaravelData\Data;

class TeamResource extends Data
{
    public function __construct(
        public ?string $value,
        public ?string $high_performers_share,
        public ?string $low_performers_share,
        public ?string $tenured_workforce,
        public ?int $week,
        public ?int $year,
    ) {}
}
