<?php

namespace Src\Domain\Nanonets\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

class PerformancePageData extends Data
{
    public function __construct(
        public string $message,
        #[DataCollectionOf(PredictionPageData::class)]
        public ?array $prediction,
        public int $page,
    ) {}
}
