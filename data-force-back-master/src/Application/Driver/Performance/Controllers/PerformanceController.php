<?php

namespace Src\Application\Driver\Performance\Controllers;

use Src\Application\Driver\Performance\Data\GetPerformanceParams;
use Src\Application\Driver\Performance\Resource\PerformanceResource;
use Src\Domain\Performance\Models\Performance;
use Src\Domain\User\Models\User;

class PerformanceController
{
    public function get_performance(GetPerformanceParams $params): \Spatie\LaravelData\PaginatedDataCollection|\Spatie\LaravelData\CursorPaginatedDataCollection|\Spatie\LaravelData\DataCollection
    {
        $user = User::findOrFail($params->user_id);
        $performance = Performance::where('driver_amazon_id', '=', $user->driver_amazon_id)
            ->where('week', '=', $params->week)
            ->where('year', '=', $params->year)
            ->get();

        return PerformanceResource::collection($performance);
    }
}
