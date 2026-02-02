<?php

namespace Src\Domain\Performance\QueryBuilders;

use Illuminate\Database\Eloquent\Builder;

class PerformanceQueryBuilder extends Builder
{
    public function currentCompany()
    {
        return $this->where('company_id', auth()->user()->company_id);
    }

    public function betweenOrEqualDates(int|string $week_from, int|string $year_from, int|string $week_to, int|string $year_to): PerformanceQueryBuilder
    {
        return $this->where(function ($query) use ($week_from, $year_from) {
            $query->where('year', '>', $year_from)
                ->orWhere(function ($q) use ($week_from, $year_from) {
                    $q->where('year', '=', $year_from)
                        ->where('week', '>=', $week_from);
                });
        })->where(function ($query) use ($week_to, $year_to) {
            $query->where('year', '<', $year_to)
                ->orWhere(function ($q) use ($week_to, $year_to) {
                    $q->where('year', '=', $year_to)
                        ->where('week', '<=', $week_to);
                });
        });
    }
}
