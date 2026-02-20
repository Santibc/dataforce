<?php

namespace Src\Application\Admin\Chat\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ChatMessageResource extends JsonResource
{
    public function toArray($request)
    {
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
        ];
    }
}
