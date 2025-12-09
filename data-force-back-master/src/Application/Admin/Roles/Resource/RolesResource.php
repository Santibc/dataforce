<?php

namespace Src\Application\Admin\Roles\Resource;

use Spatie\LaravelData\Data;

class RolesResource extends Data
{
    public function __construct(
        public int $id,
        public string $name,
    ) {}
}
