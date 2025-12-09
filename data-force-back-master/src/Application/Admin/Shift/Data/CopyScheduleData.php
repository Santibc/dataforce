<?php

namespace Src\Application\Admin\Shift\Data;

use Carbon\Carbon;
use Spatie\LaravelData\Attributes\Validation\In;
use Spatie\LaravelData\Data;

class CopyScheduleData extends Data
{
    public function __construct(
        public int $jobsite_id,
        public ?int $user_id,
        public string|Carbon $from,
        public string|Carbon $to,
        public ?array $names,
        public bool $overwrite,
        #[In([1, 2, 0])]
        public int $weeks
    ) {}
}
