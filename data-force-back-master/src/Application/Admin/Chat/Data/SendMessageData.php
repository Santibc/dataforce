<?php

namespace Src\Application\Admin\Chat\Data;

use Spatie\LaravelData\Data;

class SendMessageData extends Data
{
    public function __construct(
        public string $body
    ) {}
}
