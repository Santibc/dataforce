<?php

namespace Src\Application\Driver\Schedule\Resource;

use Spatie\LaravelData\Data;
use Src\Domain\Shift\Models\Shift;

class ScheduleResource extends Data
{
    public function __construct(
        public int $id,
        public string $name,
        public string $from,
        public string $to,
        public string $color,
        public bool $published,
        public bool $confirmed,
        public JobsiteResourceForSchedule $jobsite
    ) {}

    public static function fromModel(Shift $shift): self
    {
        return new self(
            $shift->id,
            $shift->name,
            $shift->from,
            $shift->to,
            $shift->color,
            $shift->published,
            $shift->confirmed,
            JobsiteResourceForSchedule::fromModel($shift->jobsite),
        );
    }
}
