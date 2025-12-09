<?php

namespace Src\Application\Admin\Shift\Resource;

use Spatie\LaravelData\Data;
use Src\Application\Admin\Jobsite\Resource\JobsiteResourceForShift;
use Src\Application\Admin\User\Resources\UserResourceForShift;
use Src\Domain\Shift\Models\Shift;

class ShiftResource extends Data
{
    public function __construct(
        public int $id,
        public string $name,
        public string $from,
        public string $to,
        public string $color,
        public bool $published,
        public UserResourceForShift $user,
        public JobsiteResourceForShift $jobsite
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
            UserResourceForShift::fromModel($shift->user),
            JobsiteResourceForShift::fromModel($shift->jobsite),
        );
    }
}
