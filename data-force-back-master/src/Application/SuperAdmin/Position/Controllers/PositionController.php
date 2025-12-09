<?php

namespace Src\Application\SuperAdmin\Position\Controllers;

use Illuminate\Support\Facades\DB;
use Src\Application\SuperAdmin\Position\Data\UpdatePositionData;
use Src\Application\SuperAdmin\Position\Resources\PositionResource;
use Src\Domain\Position\Models\Position;

class PositionController
{
    public function update(UpdatePositionData $data): void
    {
        DB::transaction(function () use ($data): void {
            $position = Position::findOrFail($data->id);
            $position->update(
                [
                    'name' => $data->name,
                    'from' => $data->from,
                    'to' => $data->to,
                    'color' => $data->color,
                ]
            );
        });
    }

    public function destroy(int $position_id): void
    {
        DB::transaction(fn () => Position::where('id', $position_id)->delete());
    }

    public function show(int $position_id)
    {
        return PositionResource::from(Position::findOrFail($position_id));
    }
}
