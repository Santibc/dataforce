<?php

namespace Src\Application\Driver\Schedule\Controllers;

use Src\Application\Driver\Schedule\Data\ScheduleParams;
use Src\Application\Driver\Schedule\Resource\ScheduleResource;
use Src\Domain\Shift\Models\Shift;

class ScheduleController
{
    public function get_schedule(ScheduleParams $params)
    {
        $shifts = Shift::between($params->from, $params->to)
            ->whereUserId(auth()->user()->id)
            ->where('published', true)
            ->where('delete_after_published', false)
            ->with('jobsite')
            ->orderBy('from')
            ->get();

        return ScheduleResource::collection($shifts);
    }
}
