<?php

namespace Src\Domain\Position\QueryBuilder;

use Illuminate\Database\Eloquent\Builder;

class PositionQueryBuilder extends Builder
{
    public function currentCompany()
    {
        return $this->where('company_id', auth()->user()->company_id);
    }
}
