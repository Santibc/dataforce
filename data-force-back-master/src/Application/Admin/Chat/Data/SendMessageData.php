<?php

namespace Src\Application\Admin\Chat\Data;

use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Spatie\LaravelData\Data;

class SendMessageData extends Data
{
    public function __construct(
        public ?string $body = null,
        public ?UploadedFile $attachment = null,
    ) {}

    public static function fromRequest(Request $r): self
    {
        $body = $r->input('body');

        return new self(
            body: is_string($body) && trim($body) !== '' ? $body : null,
            attachment: $r->file('attachment'),
        );
    }

    public static function rules(): array
    {
        return [
            'body' => ['nullable', 'string', 'max:5000', 'required_without:attachment'],
            'attachment' => [
                'nullable',
                'file',
                'max:10240',
                'mimes:jpeg,jpg,png,webp,pdf,doc,docx,xls,xlsx',
                'required_without:body',
            ],
        ];
    }
}
