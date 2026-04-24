<?php

namespace Src\Application\Admin\DailyLog\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class EventTypeResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'default_severity' => $this->default_severity,
            'default_description' => $this->default_description,
            'default_action_taken' => $this->default_action_taken,
            'is_active' => (bool) $this->is_active,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
