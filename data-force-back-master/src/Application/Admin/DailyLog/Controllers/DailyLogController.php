<?php

namespace Src\Application\Admin\DailyLog\Controllers;

use Illuminate\Support\Facades\DB;
use Src\Application\Admin\DailyLog\Data\StoreDailyLogData;
use Src\Application\Admin\DailyLog\Data\UpdateDailyLogData;
use Src\Application\Admin\DailyLog\Resources\DailyLogResource;
use Src\Domain\DailyLog\Models\DailyLog;
use Src\Domain\User\Models\User;

class DailyLogController
{
    public function index()
    {
        $logs = DailyLog::currentCompany()
            ->with(['driver', 'admin'])
            ->orderBy('date', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        return DailyLogResource::collection($logs);
    }

    public function show(int $id)
    {
        $log = DailyLog::currentCompany()->with(['driver', 'admin'])->findOrFail($id);

        return new DailyLogResource($log);
    }

    public function store(StoreDailyLogData $data)
    {
        $user = auth()->user();

        User::where('company_id', $user->company_id)
            ->where('id', $data->driver_id)
            ->firstOrFail();

        $log = DB::transaction(function () use ($data, $user) {
            return DailyLog::create([
                'date' => now()->toDateString(),
                'driver_id' => $data->driver_id,
                'event_type' => $data->event_type,
                'description' => $data->description,
                'severity' => $data->severity,
                'action_taken' => $data->action_taken,
                'admin_id' => $user->id,
                'company_id' => $user->company_id,
                'status' => $data->status,
                'submitted_at' => $data->status === 'submitted' ? now() : null,
            ]);
        });

        $log->load(['driver', 'admin']);

        if ($data->status === 'submitted') {
            $this->scheduleNotifications($log);
        }

        return new DailyLogResource($log);
    }

    public function update(int $id, UpdateDailyLogData $data)
    {
        $log = DailyLog::currentCompany()->findOrFail($id);

        if ($log->status === 'submitted') {
            abort(403, 'Cannot edit a submitted daily log.');
        }

        User::where('company_id', auth()->user()->company_id)
            ->where('id', $data->driver_id)
            ->firstOrFail();

        DB::transaction(function () use ($log, $data) {
            $log->update([
                'driver_id' => $data->driver_id,
                'event_type' => $data->event_type,
                'description' => $data->description,
                'severity' => $data->severity,
                'action_taken' => $data->action_taken,
            ]);
        });

        return new DailyLogResource($log->load(['driver', 'admin']));
    }

    public function destroy(int $id)
    {
        $log = DailyLog::currentCompany()->findOrFail($id);

        if ($log->status === 'submitted') {
            abort(403, 'Cannot delete a submitted daily log.');
        }

        DB::transaction(fn () => $log->delete());
    }

    public function submit(int $id)
    {
        $log = DailyLog::currentCompany()->with(['driver', 'admin'])->findOrFail($id);

        if ($log->status === 'submitted') {
            abort(403, 'This daily log has already been submitted.');
        }

        DB::transaction(function () use ($log) {
            $log->update([
                'status' => 'submitted',
                'submitted_at' => now(),
            ]);
        });

        $this->scheduleNotifications($log);

        return new DailyLogResource($log);
    }

    /**
     * Send email in a separate background PHP process.
     * This prevents SMTP timeouts from blocking the HTTP response.
     */
    private function scheduleNotifications(DailyLog $log): void
    {
        $php = PHP_BINARY ?: 'php';
        $artisan = base_path('artisan');
        $logId = $log->id;

        if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
            pclose(popen("start /B \"\" \"$php\" \"$artisan\" dailylog:send-email $logId > NUL 2>&1", 'r'));
        } else {
            exec("\"$php\" \"$artisan\" dailylog:send-email $logId > /dev/null 2>&1 &");
        }
    }

}
