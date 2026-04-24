<?php

namespace Src\Domain\DailyLog\QueryBuilder;

use Illuminate\Database\Eloquent\Builder;

class EventTypeQueryBuilder extends Builder
{
    public function currentCompany()
    {
        return $this->where('company_id', auth()->user()->company_id);
    }

    public function active()
    {
        return $this->where('is_active', true);
    }
}
