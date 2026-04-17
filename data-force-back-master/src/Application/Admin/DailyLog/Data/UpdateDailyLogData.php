<?php

namespace Src\Application\Admin\DailyLog\Data;

use Spatie\LaravelData\Data;

class UpdateDailyLogData extends Data
{
    public function __construct(
        public int $driver_id,
        public string $event_type,
        public ?string $description,
        public string $severity,
        public ?string $action_taken,
    ) {}
}
