<?php

namespace Src\Application\Admin\Chat\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Src\Domain\Chat\Models\ChatMessage;

class ChatMessageResource extends JsonResource
{
    public function toArray($request)
    {
        $media = $this->relationLoaded('media') ? $this->getFirstMedia(ChatMessage::ATTACHMENT_COLLECTION) : null;

        return [
            'id' => $this->id,
            'body' => $this->body,
            'sender' => [
                'id' => $this->sender?->id,
                'firstname' => $this->sender?->firstname,
                'lastname' => $this->sender?->lastname,
                'role' => $this->sender?->roles->first()?->name ?? 'user',
            ],
            'chat_group_id' => $this->chat_group_id,
            'created_at' => $this->created_at,
            'attachment' => $media ? [
                'url' => $media->getFullUrl(),
                'name' => $media->name,
                'file_name' => $media->file_name,
                'mime_type' => $media->mime_type,
                'size' => $media->size,
                'kind' => ChatMessage::attachmentKindFor($media),
            ] : null,
        ];
    }
}
