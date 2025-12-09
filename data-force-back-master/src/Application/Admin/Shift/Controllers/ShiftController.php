<?php

namespace Src\Application\Admin\Shift\Controllers;

use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Src\Application\Admin\Shift\Data\CopyScheduleData;
use Src\Application\Admin\Shift\Data\DeleteShiftData;
use Src\Application\Admin\Shift\Data\StoreShiftData;
use Src\Application\Admin\Shift\Data\UpdateShiftData;
use Src\Application\Admin\Shift\Notifications\ShiftChangeNotification;
use Src\Application\Admin\Shift\Notifications\TypeShift;
use Src\Application\Admin\Shift\Resource\ShiftResource;
use Src\Domain\Company\Models\Company;
use Src\Domain\Jobsite\Models\Jobsite;
use Src\Domain\Shift\Models\Shift;
use Src\Domain\User\Models\User;
use Src\Shared\Tasks\SendNotificationTask;

class ShiftController
{
    public function store(StoreShiftData $data): void
    {
        $userCompanyId = auth()->user()->company_id;
        if (
            $userCompanyId !== Jobsite::findOrFail($data->jobsite_id)->company_id ||
            $userCompanyId !== User::findOrFail($data->user_id)->company_id
        ) {
            throw new \Exception('Server Error', 500);
        }

        DB::transaction(function () use ($data): void {
            Shift::create(
                [
                    'name' => $data->name,
                    'from' => $data->from,
                    'to' => $data->to,
                    'color' => $data->color,
                    'published' => false,
                    'delete_after_published' => false,
                    'jobsite_id' => $data->jobsite_id,
                    'user_id' => $data->user_id,
                ]
            );
        });
    }

    public function update(UpdateShiftData $data): void
    {
        $userCompanyId = auth()->user()->company_id;
        if (
            $userCompanyId !== Jobsite::findOrFail($data->jobsite_id)->company_id ||
            $userCompanyId !== User::findOrFail($data->user_id)->company_id
        ) {
            throw new \Exception('Server Error', 500);
        }
        DB::transaction(function () use ($data): void {
            $shift = Shift::findOrFail($data->id);
            $last_from = $shift->from->copy();
            $last_to = $shift->to->copy();
            $shift->update(
                [
                    'name' => $data->name,
                    'from' => $data->from,
                    'to' => $data->to,
                    'color' => $data->color,
                    'jobsite' => $data->jobsite_id,
                    'user_id' => $data->user_id,
                    'confirmed' => false,
                ]
            );
            if ($shift->published) {
                SendNotificationTask::notifyEdit($shift->user_id, $shift->from, $shift->name);
                $user_find = User::findOrFail($shift->user_id);
                $user_find->notify(new ShiftChangeNotification(
                    'Schedule Update: Changes to Your Shift',
                    TypeShift::UPDATE,
                    $user_find->firstname.' '.$user_find->lastname,
                    Company::findOrFail(auth()->user()->company_id)->name,
                    $shift->from->format('m/d/Y'),
                    $shift->from->format('H:i'),
                    auth()->user()->firstname.' '.auth()->user()->lastname,
                    $shift->name,
                    $last_from->format('m/d/Y'),
                    $last_from->format('H:i'),
                    $last_to->format('H:i'),
                    $shift->to->format('H:i')
                ));
            }
        });
    }

    public function show(int $shift_id)
    {
        return ShiftResource::from(Shift::findOrFail($shift_id));
    }

    public function index()
    {
        return ShiftResource::collection(Shift::all());
    }

    public function destroy(int $shift_id): void
    {
        $userCompanyId = auth()->user()->company_id;
        $data = Shift::findOrFail($shift_id);
        if (
            $userCompanyId !== Jobsite::findOrFail($data->jobsite_id)->company_id ||
            $userCompanyId !== User::findOrFail($data->user_id)->company_id
        ) {
            throw new \Exception('Server Error', 500);
        }
        DB::transaction(function () use ($shift_id): void {
            $shift = Shift::findOrFail($shift_id);
            if ($shift->published) {
                $shift->update(['delete_after_published' => true]);
                SendNotificationTask::notifyDeleted($shift->user_id, $shift->from, $shift->name);
                $user_find = User::findOrFail($shift->user_id);
                $user_find->notify(new ShiftChangeNotification(
                    'Important: Shift Cancellation Notification',
                    TypeShift::CANCEL,
                    $user_find->firstname.' '.$user_find->lastname,
                    Company::findOrFail(auth()->user()->company_id)->name,
                    $shift->from->format('m/d/Y'),
                    $shift->from->format('H:i'),
                    null,
                    null,
                    null,
                    null,
                    null,
                    null
                ));
            } else {
                Shift::destroy($shift_id);
            }
        });
    }

    public function delete_shift_user(DeleteShiftData $data): void
    {
        $userCompanyId = auth()->user()->company_id;
        if ($userCompanyId !== User::findOrFail($data->user_id)->company_id) {
            throw new \Exception('Server Error', 500);
        }
        $shifts = Shift::whereUserId($data->user_id)
            ->when($data->names, function ($query) use ($data): void {
                $lowercaseNames = array_map('strtolower', $data->names);
                $query->whereIn(\DB::raw('LOWER(name)'), $lowercaseNames);
            })
            ->between($data->from, $data->to)
            ->where('delete_after_published', '=', false)
            ->get();

        DB::transaction(function () use ($shifts): void {
            foreach ($shifts as $shift) {
                if ($shift->published) {
                    $shift->update(['delete_after_published' => true]);
                    SendNotificationTask::notifyDeleted($shift->user_id, $shift->from, $shift->name);
                    $user_find = User::findOrFail($shift->user_id);
                    $user_find->notify(new ShiftChangeNotification(
                        'Important: Shift Cancellation Notification',
                        TypeShift::CANCEL,
                        $user_find->firstname.' '.$user_find->lastname,
                        Company::findOrFail(auth()->user()->company_id)->name,
                        $shift->from->format('m/d/Y'),
                        $shift->from->format('H:i'),
                        null,
                        null,
                        null,
                        null,
                        null,
                        null
                    ));
                } else {
                    $shift->delete();
                }
            }
        });
    }

    public function copy(CopyScheduleData $data): void
    {
        $userCompanyId = auth()->user()->company_id;
        if ($data->user_id != null) {
            if (
                $userCompanyId !== Jobsite::findOrFail($data->jobsite_id)->company_id ||
                $userCompanyId !== User::findOrFail($data->user_id)->company_id
            ) {
                throw new \Exception('Server Error', 500);
            }
        } else {
            if ($userCompanyId !== Jobsite::findOrFail($data->jobsite_id)->company_id) {
                throw new \Exception('Server Error', 500);
            }
        }

        $shifts = Shift::whereJobsiteId($data->jobsite_id)
            ->when($data->user_id, fn ($query) => $query->where('user_id', $data->user_id))
            ->when($data->names, function ($query) use ($data): void {
                $lowercaseNames = array_map('strtolower', $data->names);
                $query->whereIn(\DB::raw('LOWER(name)'), $lowercaseNames);
            })
            ->where('delete_after_published', '=', false)
            ->between($data->from, $data->to)
            ->get();

        DB::transaction(function () use ($shifts, $data): void {

            $shifts_next_week = Shift::whereJobsiteId($data->jobsite_id)
                ->when($data->user_id, fn ($query) => $query->where('user_id', $data->user_id))
                ->when($data->names, function ($query) use ($data): void {
                    $lowercaseNames = array_map('strtolower', $data->names);
                    $query->whereIn(\DB::raw('LOWER(name)'), $lowercaseNames);
                })
                ->between(
                    $data->weeks === 0
                        ? $data->from->copy()->addDay()
                        : $data->from->copy()->addWeeks($data->weeks),
                    $data->weeks === 0
                        ? $data->to->copy()->addDay()
                        : $data->to->copy()->addWeeks($data->weeks)
                );

            if ($data->overwrite) {

                $shifts_next_week->get()->each(function ($shift) use ($shifts, $data): void {
                    $shifts->each(function ($value) use ($shift, $data): void {
                        $from = Carbon::createFromFormat('Y-m-d H:i:s', $shift['from']);
                        $to = Carbon::createFromFormat('Y-m-d H:i:s', $shift['to']);

                        $valueFrom = Carbon::createFromFormat('Y-m-d H:i:s', $value['from']);
                        $valueTo = Carbon::createFromFormat('Y-m-d H:i:s', $value['to']);

                        $sameUser = $shift['user_id'] === $value['user_id'];

                        $sameFrom = $data->weeks === 0
                                ? $valueFrom->copy()->addDay()->isSameDay($from)
                                : $valueFrom->copy()->addWeeks($data->weeks)->isSameDay($from);
                        $sameTo = $data->weeks === 0
                                ? $valueTo->copy()->addDay()->isSameDay($to)
                                : $valueTo->copy()->addWeeks($data->weeks)->isSameDay($to);

                        if ($sameUser && $sameFrom && $sameTo) {
                            $shift->delete();
                        }
                    });
                });

                $shifts = $shifts->fresh();
            } elseif (count($shifts_next_week->get()) !== 0) {

                $shifts_filtrados = $shifts->filter(function ($shift) use ($shifts_next_week, $data) {
                    $tengo_ese_shift = $shifts_next_week->get()->contains(function ($value) use ($shift, $data) {
                        $from = Carbon::createFromFormat('Y-m-d H:i:s', $shift['from']);
                        $to = Carbon::createFromFormat('Y-m-d H:i:s', $shift['to']);

                        $valueFrom = Carbon::createFromFormat('Y-m-d H:i:s', $value['from']);
                        $valueTo = Carbon::createFromFormat('Y-m-d H:i:s', $value['to']);

                        $sameUser = $shift['user_id'] === $value['user_id'];
                        $sameFrom = $valueFrom->isSameDay(
                            $data->weeks === 0
                                ? $from->copy()->addDay()
                                : $from->copy()->addWeeks($data->weeks)
                        );
                        $sameTo = $valueTo->isSameDay(
                            $data->weeks === 0
                                ? $to->copy()->addDay()
                                : $to->copy()->addWeeks($data->weeks)
                        );

                        return $sameFrom && $sameTo && $sameUser;
                    });

                    return ! $tengo_ese_shift;
                });

                $shifts = $shifts_filtrados;
            }

            foreach ($shifts as $shift) {
                if (! $shift->delete_after_published) {
                    Shift::create(
                        [
                            'name' => $shift->name,
                            'from' => $data->weeks === 0
                                ? $shift->from->copy()->addDay()
                                : $shift->from->copy()->addWeeks($data->weeks),
                            'to' => $data->weeks === 0
                                ? $shift->to->copy()->addDay()
                                : $shift->to->copy()->addWeeks($data->weeks),
                            'color' => $shift->color,
                            'jobsite_id' => $shift->jobsite_id,
                            'user_id' => $shift->user_id,
                        ]
                    );
                }
            }
        });
    }
}
