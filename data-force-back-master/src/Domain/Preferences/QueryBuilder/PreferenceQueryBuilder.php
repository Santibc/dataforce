<?php

namespace Src\Domain\Preferences\QueryBuilder;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class PreferenceQueryBuilder extends Builder
{
    public function fromDate(string|Carbon $from)
    {
        return $this->where('date', '>=', $from);
    }

    public function toDate(string|Carbon $to)
    {
        return $this->where('date', '<=', $to);
    }

    public function between(string|Carbon $from, string|Carbon $to)
    {
        return $this->where(fn ($q) => $q->fromDate($from)->toDate($to));
    }

    public function inDates(Collection $dates)
    {
        return $this->where(fn ($q) => $q->whereIn(DB::raw('DATE(`date`)'), $dates));
    }
}
