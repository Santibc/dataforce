<?php

namespace Src\Application\Admin\Chat\Data;

use Spatie\LaravelData\Data;

class StoreChatGroupData extends Data
{
    public function __construct(
        public string $name,
        public string $type,
        public string $mode,
        public bool $auto_add_new_members,
        public bool $show_history_to_new_members,
        public ?array $member_ids
    ) {}
}
