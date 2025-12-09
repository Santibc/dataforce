<?php

namespace Src\Domain\Nanonets\Data;

use Spatie\LaravelData\Data;

class CellData extends Data
{
    public function __construct(
        public int $row,
        public int $col,
        public string $label,
        public string $text
    ) {}
}
