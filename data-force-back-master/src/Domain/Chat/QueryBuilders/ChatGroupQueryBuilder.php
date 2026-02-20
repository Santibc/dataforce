<?php

namespace Src\Domain\Chat\QueryBuilders;

use Illuminate\Database\Eloquent\Builder;

class ChatGroupQueryBuilder extends Builder
{
    public function currentCompany(): self
    {
        return $this->where('company_id', auth()->user()->company_id);
    }

    public function forUser(int $userId): self
    {
        return $this->whereHas('activeMembers', fn ($q) => $q->where('user_id', $userId));
    }

    public function globalGroups(): self
    {
        return $this->where('type', 'global');
    }

    public function customGroups(): self
    {
        return $this->where('type', 'custom');
    }
}
