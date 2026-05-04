<?php

namespace Src\Application\SuperAdmin\Chat\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Src\Domain\Chat\Models\ChatMessage;

class SuperAdminChatGroupResource extends JsonResource
{
    public function toArray($request)
    {
        $latestMessage = $this->relationLoaded('latestMessage') ? $this->latestMessage : null;

        return [
            'id' => $this->id,
            'name' => $this->name,
            'type' => $this->type,
            'mode' => $this->mode,
            'auto_add_new_members' => $this->auto_add_new_members,
            'show_history_to_new_members' => $this->show_history_to_new_members,
            'members_count' => $this->active_members_count ?? $this->activeMembers()->count(),
            'last_message' => $latestMessage ? [
                'id' => $latestMessage->id,
                'body' => self::resolveLastMessagePreview($latestMessage),
                'sender_name' => $latestMessage->sender?->firstname . ' ' . $latestMessage->sender?->lastname,
                'created_at' => $latestMessage->created_at,
            ] : null,
            'unread_count' => $this->unread_count ?? 0,
            'is_super_admin_group' => true,
            'created_at' => $this->created_at,
        ];
    }

    private static function resolveLastMessagePreview(ChatMessage $message): string
    {
        if (is_string($message->body) && trim($message->body) !== '') {
            return $message->body;
        }

        if ($message->relationLoaded('media')) {
            $media = $message->getFirstMedia(ChatMessage::ATTACHMENT_COLLECTION);
            if ($media) {
                return ChatMessage::attachmentKindFor($media) === 'image'
                    ? '📎 Imagen'
                    : '📄 Documento';
            }
        }

        return '';
    }
}
