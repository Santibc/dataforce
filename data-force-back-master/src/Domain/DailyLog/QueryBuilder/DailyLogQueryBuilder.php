<?php

namespace Src\Domain\DailyLog\QueryBuilder;

use Illuminate\Database\Eloquent\Builder;

class DailyLogQueryBuilder extends Builder
{
    public function currentCompany()
    {
        return $this->where('company_id', auth()->user()->company_id);
    }
}
