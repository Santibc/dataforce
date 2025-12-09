<?php

namespace Src\Application\Admin\Shift\Data;

use Carbon\Carbon;
use Spatie\LaravelData\Data;

class DeleteShiftData extends Data
{
    public function __construct(
        public ?int $user_id,
        public string|Carbon $from,
        public string|Carbon $to,
        public ?array $names,
    ) {}
}
