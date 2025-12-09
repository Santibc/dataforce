<?php

namespace Src\Application\Admin\Shift\Controllers;

use Illuminate\Support\Facades\DB;
use Src\Application\Admin\Shift\Data\PublishShiftData;
use Src\Application\Admin\Shift\Notifications\ShiftChangeNotification;
use Src\Application\Admin\Shift\Notifications\TypeShift;
use Src\Domain\Company\Models\Company;
use Src\Domain\Jobsite\Models\Jobsite;
use Src\Domain\Shift\Models\Shift;
use Src\Domain\User\Models\User;
use Src\Shared\Tasks\SendNotificationTask;

class ShiftPublishController
{
    public function publish(int $shift_id): void
    {
        $userCompanyId = auth()->user()->company_id;
        $data = Shift::findOrFail($shift_id);
        if (
            $userCompanyId !== Jobsite::findOrFail($data->jobsite_id)->company_id ||
            $userCompanyId !== User::findOrFail($data->user_id)->company_id
        ) {
            throw new \Exception('Server Error', 500);
        }

        \DB::transaction(function () use ($shift_id): void {
            $shift = Shift::findOrFail($shift_id);
            $shift->update(['published' => true]);
            SendNotificationTask::notifyPublish($shift->user_id, $shift->from, $shift->name);
            $user_find = User::findOrFail($shift->user_id);
            $user_find->notify(new ShiftChangeNotification(
                'Your Updated Schedule for week '.$shift->from->weekOfYear,
                TypeShift::CREATE,
                $user_find->firstname.' '.$user_find->lastname,
                Company::findOrFail(auth()->user()->company_id)->name,
                $shift->from->format('m/d/Y'),
                $shift->from->format('H:i'),
                auth()->user()->firstname.' '.auth()->user()->lastname,
                $shift->name,
                null,
                null,
                null,
                $shift->to->format('H:i')
            ));
        });
    }

    public function publish_all(PublishShiftData $data): void
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
            ->between($data->from, $data->to)
            ->where('delete_after_published', '=', false)
            ->where('published', '=', false)
            ->get();

        DB::transaction(function () use ($shifts): void {
            foreach ($shifts as $shift) {
                $shift->update(['published' => true]);
                SendNotificationTask::notifyPublish($shift->user_id, $shift->from, $shift->name);
                $user_find = User::findOrFail($shift->user_id);
                $user_find->notify(new ShiftChangeNotification(
                    'Your Updated Schedule for week '.$shift->from->weekOfYear,
                    TypeShift::CREATE,
                    $user_find->firstname.' '.$user_find->lastname,
                    Company::findOrFail(auth()->user()->company_id)->name,
                    $shift->from->format('m/d/Y'),
                    $shift->from->format('H:i'),
                    auth()->user()->firstname.' '.auth()->user()->lastname,
                    $shift->name,
                    null,
                    null,
                    null,
                    $shift->to->format('H:i')
                ));
            }
        });

    }
}
