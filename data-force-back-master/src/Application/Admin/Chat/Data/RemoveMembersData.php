<?php

namespace Src\Application\Admin\Chat\Data;

use Spatie\LaravelData\Data;

class RemoveMembersData extends Data
{
    public function __construct(
        public array $member_ids
    ) {}
}
