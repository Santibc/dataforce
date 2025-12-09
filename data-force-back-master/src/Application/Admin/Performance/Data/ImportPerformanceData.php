<?php

namespace Src\Application\Admin\Performance\Data;

use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Spatie\LaravelData\Data;

class ImportPerformanceData extends Data
{
    public function __construct(
        public UploadedFile $file,
    ) {}

    public static function fromRequest(Request $r): self
    {
        return new self(
            file: $r->file('file')
        );
    }
}
