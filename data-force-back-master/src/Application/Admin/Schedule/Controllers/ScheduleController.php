<?php

namespace Src\Application\Admin\Schedule\Controllers;

use Illuminate\Support\Facades\DB;
use Src\Application\Admin\Schedule\Data\ScheduleParams;
use Src\Application\Admin\Schedule\Resources\ScheduleResource;
use Src\Application\Admin\Shift\Notifications\ShiftChangeNotification;
use Src\Application\Admin\Shift\Notifications\TypeShift;
use Src\Domain\Company\Models\Company;
use Src\Domain\Shift\Models\Shift;
use Src\Domain\User\Models\User;
use Src\Shared\Tasks\SendNotificationTask;

class ScheduleController
{
    public function handle(ScheduleParams $params)
    {
        $users = User::whereJobsites($params->jobsite_id)
            ->when($params->users_id, fn ($query) => $query->whereIn('id', $params->users_id))
            ->with(['preferences' => function ($q) use ($params): void {
                $q->between($params->from, $params->to)
                    ->where('available', false);
            }])
            ->with(['shifts' => function ($q) use ($params): void {
                $q->whereJobsiteId($params->jobsite_id)
                    ->between($params->from, $params->to)
                    ->when($params->name_positions, fn ($q) => $q->whereIn('name', (array) $params->name_positions));
            }])
            ->get();

        return ScheduleResource::collection($users);
    }

    public function clean(ScheduleParams $params): void
    {
        $shifts = Shift::whereJobsiteId($params->jobsite_id)
            ->when($params->name_positions, function ($query) use ($params): void {
                $lowercaseNames = array_map('strtolower', $params->name_positions);
                $query->whereIn(\DB::raw('LOWER(name)'), $lowercaseNames);
            })
            ->between($params->from, $params->to)
            ->get();

        DB::transaction(function () use ($shifts): void {
            foreach ($shifts as $shift) {
                if ($shift->published) {
                    $shift->update(['delete_after_published' => true]);
                    $user_find = User::findOrFail($shift->user_id);
                    SendNotificationTask::notifyDeleted($shift->user_id, $shift->from, $shift->name);
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
}
