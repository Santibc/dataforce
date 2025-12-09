<?php

namespace Src\Application\Admin\Position\Controllers;

use Illuminate\Support\Facades\DB;
use Src\Application\Admin\Position\Data\StorePositionData;
use Src\Application\Admin\Position\Data\UpdatePositionData;
use Src\Application\Admin\Position\Resource\PositionResource;
use Src\Domain\Position\Models\Position;

class PositionController
{
    public function store(StorePositionData $data): void
    {
        DB::transaction(function () use ($data): void {
            $position = Position::currentCompany()->where('name', $data->name)->first();
            if ($position == null) {
                Position::create(
                    [
                        'name' => $data->name,
                        'from' => $data->from,
                        'to' => $data->to,
                        'color' => $data->color,
                        'company_id' => auth()->user()->company_id,
                    ]
                );
            }
        });
    }

    public function update(UpdatePositionData $data): void
    {
        DB::transaction(function () use ($data): void {
            $position = Position::currentCompany()->findOrFail($data->id);
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

    public function show(int $position_id)
    {
        return PositionResource::from(Position::currentCompany()->findOrFail($position_id));
    }

    public function index()
    {
        return PositionResource::collection(Position::currentCompany()->get());
    }

    public function destroy(int $position_id): void
    {
        DB::transaction(fn () => Position::currentCompany()->where('id', $position_id)->delete());
    }
}
