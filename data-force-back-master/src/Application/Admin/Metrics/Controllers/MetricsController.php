<?php

namespace Src\Application\Admin\Metrics\Controllers;

use Src\Application\Admin\Metrics\Data\GetMetricsParams;
use Src\Application\Admin\Metrics\Resource\GetMetricsResource;
use Src\Domain\Performance\Models\OverallStanding;
use Src\Domain\Performance\Models\Performance;
use Src\Domain\Performance\Models\Quality;
use Src\Domain\Performance\Models\SafetyAndCompliance;
use Src\Domain\Performance\Models\Team;
use Src\Domain\Performance\Models\TrailingWeeksPerformance;

class MetricsController
{
    public function get_metrics(GetMetricsParams $params)
    {
        $performances = Performance::whereHas('user', function ($query): void {
            $query->where('company_id', auth()->user()->company_id);
        })
            ->with('user')
            ->where('week', '=', $params->week)
            ->where('year', '=', $params->year)
            ->get();

        $below_standard = TrailingWeeksPerformance::whereHas('user', function ($query): void {
            $query->where('company_id', auth()->user()->company_id);
        })
            ->with('user')
            ->where('week', '=', $params->week)
            ->where('year', '=', $params->year)
            ->whereIn('performer_status', ['Low Performer', 'Normal Performer'])
            ->orderByRaw('FIELD(performer_status,"Low Performer","Normal Performer")')
            ->get();

        $best_drivers = $performances->take(5);
        $worst_drivers = $performances->take(-10)->reverse()->values();

        $safetys = SafetyAndCompliance::currentCompany()
            ->where('week', '=', $params->week)
            ->where('year', '=', $params->year)
            ->get();
        $qualitys = Quality::currentCompany()
            ->where('week', '=', $params->week)
            ->where('year', '=', $params->year)
            ->get();
        $teams = Team::currentCompany()
            ->where('week', '=', $params->week)
            ->where('year', '=', $params->year)
            ->get();
        $overall_standings = OverallStanding::currentCompany()
            ->where('week', '=', $params->week)
            ->where('year', '=', $params->year)
            ->get();

        return GetMetricsResource::fromModel(
            $best_drivers,
            $worst_drivers,
            $below_standard,
            $safetys,
            $qualitys,
            $teams,
            $overall_standings
        );
    }
}
