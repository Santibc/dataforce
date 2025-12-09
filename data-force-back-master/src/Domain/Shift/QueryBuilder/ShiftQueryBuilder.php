<?php

namespace Src\Domain\Shift\QueryBuilder;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class ShiftQueryBuilder extends Builder
{
    public function fromDate(string|Carbon $from)
    {
        return $this->where('from', '>=', $from);
    }

    public function toDate(string|Carbon $to)
    {
        return $this->where('to', '<=', $to);
    }

    public function between(string|Carbon $from, string|Carbon $to)
    {
        return $this->where(fn ($q) => $q->fromDate($from)->toDate($to));
    }

    public function inDates(Collection $dates)
    {
        return $this->where(fn ($q) => $q->whereIn(DB::raw('DATE(`from`)'), $dates)
            ->orWhereIn(DB::raw('DATE(`to`)'), $dates));
    }
}
