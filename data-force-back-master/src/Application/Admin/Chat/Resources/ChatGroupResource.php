<?php

namespace Src\Application\Admin\Chat\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ChatGroupResource extends JsonResource
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
                'body' => $latestMessage->body,
                'sender_name' => $latestMessage->sender?->firstname . ' ' . $latestMessage->sender?->lastname,
                'created_at' => $latestMessage->created_at,
            ] : null,
            'unread_count' => $this->unread_count ?? 0,
            'is_super_admin_group' => $this->company_id === null,
            'created_at' => $this->created_at,
        ];
    }
}
