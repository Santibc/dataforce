<?php

namespace Src\Application\Admin\Coaching\Data;

use Spatie\LaravelData\Data;

class StoreCoachingData extends Data
{
    public function __construct(
        public string $subject,
        public int $week,
        public int $year,
        public string $category,
        public string $content,
        public array $users,
        public string $type
    ) {}
}
