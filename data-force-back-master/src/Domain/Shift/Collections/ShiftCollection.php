<?php

namespace Src\Domain\Shift\Collections;

use Illuminate\Database\Eloquent\Collection;
use Src\Domain\Shift\Models\Shift;

class ShiftCollection extends Collection
{
    public function totalHours(): int
    {
        return $this->sum(fn (Shift $shift) => $shift->delete_after_published
                                ? 0
                                : $shift->from->diffInHours($shift->to)
        );
    }
}
