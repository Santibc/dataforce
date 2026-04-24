<?php

namespace Src\Application\Admin\DailyLog\Data;

use Spatie\LaravelData\Data;

class UpdateEventTypeData extends Data
{
    public function __construct(
        public string $name,
        public ?string $default_severity = null,
        public ?string $default_description = null,
        public ?string $default_action_taken = null,
        public bool $is_active = true,
    ) {}
}
