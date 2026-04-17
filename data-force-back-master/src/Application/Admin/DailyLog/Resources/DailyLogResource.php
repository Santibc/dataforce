<?php

namespace Src\Application\Admin\DailyLog\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class DailyLogResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'date' => $this->date->format('Y-m-d'),
            'driver_id' => $this->driver_id,
            'driver_name' => $this->driver ? $this->driver->firstname . ' ' . $this->driver->lastname : '',
            'event_type' => $this->event_type,
            'description' => $this->description,
            'severity' => $this->severity,
            'action_taken' => $this->action_taken,
            'admin_id' => $this->admin_id,
            'admin_name' => $this->admin ? $this->admin->firstname . ' ' . $this->admin->lastname : '',
            'status' => $this->status,
            'submitted_at' => $this->submitted_at?->toISOString(),
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
