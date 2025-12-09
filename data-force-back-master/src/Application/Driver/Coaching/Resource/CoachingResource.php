<?php

namespace Src\Application\Driver\Coaching\Resource;

use Spatie\LaravelData\Data;

class CoachingResource extends Data
{
    public function __construct(
        public int $id,
        public string $subject,
        public int $year,
        public int $week,
        public string $category,
        public string $content,
        public int $user_id,
        public string $type,
        public bool $read
    ) {}
}
