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
        return $this->where('week', '>=', $week_from)
            ->where('year', '>=', $year_from)
            ->where('week', '<=', $week_to)
            ->where('year', '<=', $year_to);
    }
}
