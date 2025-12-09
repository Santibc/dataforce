<?php

namespace Src\Application\Admin\Shift\Data;

use Carbon\Carbon;
use Spatie\LaravelData\Data;

class PublishShiftData extends Data
{
    public function __construct(
        public int $jobsite_id,
        public string|Carbon $from,
        public string|Carbon $to,
        public ?array $names,
        public ?int $user_id
    ) {}
}
