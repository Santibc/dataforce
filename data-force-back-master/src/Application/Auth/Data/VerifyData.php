<?php

namespace Src\Application\Auth\Data;

use Spatie\LaravelData\Attributes\FromRouteParameter;
use Spatie\LaravelData\Data;

class VerifyData extends Data
{
    public function __construct(
        #[FromRouteParameter('id')]
        public string $id,
        #[FromRouteParameter('hash')]
        public string $hash,
    ) {}
}
