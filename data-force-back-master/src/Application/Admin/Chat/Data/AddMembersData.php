<?php

namespace Src\Application\Admin\Chat\Data;

use Spatie\LaravelData\Data;

class AddMembersData extends Data
{
    public function __construct(
        public array $member_ids
    ) {}
}
