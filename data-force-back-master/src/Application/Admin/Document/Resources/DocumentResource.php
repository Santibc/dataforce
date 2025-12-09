<?php

namespace Src\Application\Admin\Document\Resources;

use DateTime;
use Spatie\LaravelData\Data;
use Src\Domain\Document\Models\Document;

class DocumentResource extends Data
{
    public function __construct(
        public int $id,
        public string $name,
        public ?int $size,
        public ?string $type,
        public int $performance_count,
        public array $imported_by,
        public DateTime $updated_at,
    ) {}

    public static function fromModel(Document $document)
    {
        $file = $document->getFile();

        return new self(
            id: $document->id,
            name: $document->name,
            size: $file?->size,
            type: $file?->mime_type,
            performance_count: $document->performance_count,
            imported_by: [
                'id' => $document->user_id,
                'email' => $document->user->email,
            ],
            updated_at: $document->updated_at
        );
    }
}
