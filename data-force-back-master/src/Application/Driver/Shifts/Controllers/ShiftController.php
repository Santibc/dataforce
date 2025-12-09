<?php

namespace Src\Application\Driver\Shifts\Controllers;

use Illuminate\Support\Facades\DB;
use Src\Application\Driver\Shifts\Data\ConfirmShiftsParams;
use Src\Domain\Shift\Models\Shift;

class ShiftController
{
    public function confirm(ConfirmShiftsParams $params): void
    {
        $shifts = Shift::whereUserId(auth()->user()->id)
            ->between($params->from, $params->to)
            ->where('published', true)
            ->where('delete_after_published', false)
            ->get();

        DB::transaction(function () use ($shifts): void {
            foreach ($shifts as $shift) {
                $shift->update(['confirmed' => true]);
            }
        });

    }
}
