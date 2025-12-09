<?php

namespace Src\Application\Driver\Coaching\Controllers;

use Illuminate\Support\Facades\DB;
use Src\Application\Driver\Coaching\Data\GetCoachingData;
use Src\Application\Driver\Coaching\Resource\CoachingResource;
use Src\Domain\Coaching\Models\Coaching;

class CoachingController
{
    public function get_coaching(GetCoachingData $params)
    {
        $coachings = Coaching::where('user_id', auth()->user()->id)
            ->where('year', $params->year)
            ->where('week', $params->week)
            ->orderBy('created_at', 'desc')
            ->get();

        return CoachingResource::collection($coachings);
    }

    public function read(int|string $coaching_id): void
    {
        DB::transaction(function () use ($coaching_id): void {
            $coaching = Coaching::findOrFail($coaching_id);
            if ($coaching) {
                $coaching->read = true;
                $coaching->save();
            }
        });
    }
}
