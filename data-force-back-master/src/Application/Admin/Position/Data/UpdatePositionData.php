<?php

namespace Src\Application\Admin\Position\Data;

use Carbon\Carbon;
use Spatie\LaravelData\Attributes\Validation\Unique;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Support\Validation\References\RouteParameterReference;

class UpdatePositionData extends Data
{
    public function __construct(
        public int $id,
        #[Unique('positions', ignore: new RouteParameterReference('position'))]
        public string $name,
        public Carbon $from,
        public Carbon $to,
        public string $color,
    ) {}
}
