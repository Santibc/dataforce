<?php

namespace Src\Application\Admin\DailyLog\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Src\Application\Admin\DailyLog\Data\StoreEventTypeData;
use Src\Application\Admin\DailyLog\Data\UpdateEventTypeData;
use Src\Application\Admin\DailyLog\Resources\EventTypeResource;
use Src\Domain\DailyLog\Models\EventType;

class EventTypeController
{
    public function index(Request $request)
    {
        $query = EventType::currentCompany()->orderBy('name');

        if (!$request->boolean('include_inactive')) {
            $query->active();
        }

        return EventTypeResource::collection($query->get());
    }

    public function store(StoreEventTypeData $data)
    {
        $user = auth()->user();
        $slug = $this->uniqueSlug($data->name, $user->company_id);

        $eventType = DB::transaction(function () use ($data, $slug, $user) {
            return EventType::create([
                'company_id' => $user->company_id,
                'name' => $data->name,
                'slug' => $slug,
                'default_severity' => $data->default_severity,
                'default_description' => $data->default_description,
                'default_action_taken' => $data->default_action_taken,
                'is_active' => $data->is_active,
            ]);
        });

        return new EventTypeResource($eventType);
    }

    public function update(int $id, UpdateEventTypeData $data)
    {
        $eventType = EventType::currentCompany()->findOrFail($id);

        $slug = $eventType->slug;
        if ($data->name !== $eventType->name) {
            $slug = $this->uniqueSlug($data->name, $eventType->company_id, $eventType->id);
        }

        DB::transaction(function () use ($eventType, $data, $slug) {
            $eventType->update([
                'name' => $data->name,
                'slug' => $slug,
                'default_severity' => $data->default_severity,
                'default_description' => $data->default_description,
                'default_action_taken' => $data->default_action_taken,
                'is_active' => $data->is_active,
            ]);
        });

        return new EventTypeResource($eventType->fresh());
    }

    public function destroy(int $id)
    {
        $eventType = EventType::currentCompany()->findOrFail($id);

        DB::transaction(fn () => $eventType->delete());
    }

    private function uniqueSlug(string $name, int $companyId, ?int $ignoreId = null): string
    {
        $base = Str::slug($name, '_');
        if ($base === '') {
            $base = 'event_type';
        }

        $slug = $base;
        $counter = 2;

        while (
            EventType::withTrashed()
                ->where('company_id', $companyId)
                ->where('slug', $slug)
                ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
                ->exists()
        ) {
            $slug = $base . '_' . $counter;
            $counter++;
        }

        return $slug;
    }
}
