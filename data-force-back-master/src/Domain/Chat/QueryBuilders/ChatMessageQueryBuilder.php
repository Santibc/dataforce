<?php

namespace Src\Domain\Chat\QueryBuilders;

use Illuminate\Database\Eloquent\Builder;

class ChatMessageQueryBuilder extends Builder
{
    public function forGroup(int $groupId): self
    {
        return $this->where('chat_group_id', $groupId);
    }

    public function recent(int $months = 3): self
    {
        return $this->where('created_at', '>=', now()->subMonths($months));
    }

    public function afterMessage(int $messageId): self
    {
        return $this->where('id', '>', $messageId);
    }
}
