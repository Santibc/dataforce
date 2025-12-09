<?php

namespace Src\Application\Admin\Schedule\Data;

use Carbon\Carbon;
use Spatie\LaravelData\Data;

class ScheduleParams extends Data
{
    public function __construct(
        public int $jobsite_id,
        public string|Carbon $from,
        public string|Carbon $to,
        public ?array $name_positions,
        public ?array $users_id,
    ) {}
}
