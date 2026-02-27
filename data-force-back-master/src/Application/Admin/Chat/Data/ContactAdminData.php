<?php

namespace Src\Application\Admin\Chat\Data;

use Spatie\LaravelData\Data;

class ContactAdminData extends Data
{
    public function __construct(
        public string $name
    ) {}
}
