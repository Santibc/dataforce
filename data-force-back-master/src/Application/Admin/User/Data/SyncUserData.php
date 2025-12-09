<?php

namespace Src\Application\Admin\User\Data;

use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Spatie\LaravelData\Data;

class SyncUserData extends Data
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
