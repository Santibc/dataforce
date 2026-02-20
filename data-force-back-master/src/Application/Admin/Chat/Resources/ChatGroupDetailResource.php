<?php

namespace Src\Application\Admin\Chat\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ChatGroupDetailResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'type' => $this->type,
            'mode' => $this->mode,
            'auto_add_new_members' => $this->auto_add_new_members,
            'show_history_to_new_members' => $this->show_history_to_new_members,
            'members_count' => $this->activeMembers()->count(),
            'members' => $this->users->map(fn ($user) => [
                'id' => $user->id,
                'firstname' => $user->firstname,
                'lastname' => $user->lastname,
                'email' => $user->email,
                'roles' => $user->roles->map(fn ($r) => $r->name),
            ]),
            'created_by' => $this->creator ? [
                'id' => $this->creator->id,
                'firstname' => $this->creator->firstname,
                'lastname' => $this->creator->lastname,
            ] : null,
            'created_at' => $this->created_at,
        ];
    }
}
