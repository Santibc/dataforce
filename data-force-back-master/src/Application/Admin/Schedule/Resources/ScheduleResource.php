<?php

namespace Src\Application\Admin\Schedule\Resources;

use Spatie\LaravelData\Data;
use Src\Domain\User\Models\User;

class ScheduleResource extends Data
{
    public function __construct(
        public int $cantidad_horas,
        public int $id,
        public string $firstname,
        public string $lastname,
        public string $email,
        public string $phone_number,
        public string $driver_amazon_id,
        public int $company_id,
        public array $preferences,
        public array $shifts
    ) {}

    public static function fromModel(User $user)
    {
        return new self(
            $user->shifts->totalHours(),
            $user->id,
            $user->firstname,
            $user->lastname,
            $user->email,
            $user->phone_number,
            $user->driver_amazon_id,
            $user->company_id,
            $user->preferences->map(fn ($p) => [
                'id' => $p->id,
                'available' => $p->available,
                'date' => $p->date,
            ])->toArray(),
            $user->shifts->map(fn ($s) => [
                'id' => $s->id,
                'name' => $s->name,
                'color' => $s->color,
                'published' => $s->published,
                'from' => $s->from,
                'to' => $s->to,
                'delete_after_published' => $s->delete_after_published,
                'confirmed' => $s->confirmed,
            ])->toArray(),
        );
    }
}
