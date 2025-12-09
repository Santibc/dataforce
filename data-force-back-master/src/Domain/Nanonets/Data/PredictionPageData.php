<?php

namespace Src\Domain\Nanonets\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

class PredictionPageData extends Data
{
    public function __construct(
        public string $label,
        public string $type,
        public string $ocr_text,
        #[DataCollectionOf(CellData::class)]
        public ?array $cells,
    ) {}
}
