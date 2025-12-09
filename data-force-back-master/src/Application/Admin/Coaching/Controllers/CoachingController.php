<?php

namespace Src\Application\Admin\Coaching\Controllers;

use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Src\Application\Admin\Coaching\Data\StoreCoachingData;
use Src\Application\Admin\Coaching\Resources\CoachingResource;
use Src\Domain\Coaching\Models\Coaching;
use Src\Domain\Performance\Models\Performance;
use Src\Domain\User\Models\User;
use Src\Shared\Notifications\CoachingNotification;
use Src\Shared\Tasks\SendNotificationTask;

class CoachingController
{
    public function get_coaching()
    {
        $last_performance = Performance::whereIn('driver_amazon_id', User::currentCompany()->select('driver_amazon_id'))
            ->orderBy('year', 'desc')
            ->orderBy('week', 'desc')
            ->first();

        $to = Carbon::now()->year($last_performance->year)->week($last_performance->week);
        $from = $to->clone()->subWeeks(5);
        $data_coaching = User::currentCompany()
            ->with('performance', fn ($query) => $query->betweenOrEqualDates(
                $from->week,
                $from->year,
                $to->week,
                $to->year
            ))
            ->get();

        $pedro = 'Pedro';

        return CoachingResource::collection($data_coaching)->through(function (CoachingResource $coaching) use ($from) {
            $performances = collect();
            for ($i = 0; $i <= 5; $i++) {
                $performance = $coaching->performances->first(
                    fn ($x) => $x['week'] === $from->clone()->add($i, 'week')->week
                        && $x['year'] === $from->clone()->add($i, 'week')->year
                );
                $performances->push(
                    $performance ?? [
                        'id' => null,
                        'overall_tier' => null,
                        'fico_score' => null,
                        'seatbelt_off_rate' => null,
                        'speeding_event_ratio' => null,
                        'distraction_rate' => null,
                        'following_distance_rate' => null,
                        'signal_violations_rate' => null,
                        'cdf' => null,
                        'dcr' => null,
                        'pod' => null,
                        'cc' => null,
                        'cc_o' => null,
                        'ced' => null,
                        'swc_ad' => null,
                        'dsb_dnr' => null,
                        'week' => $from->clone()->add($i, 'week')->week,
                        'year' => $from->clone()->add($i, 'week')->year,
                    ]
                );
            }
            $coaching->performances = $performances;

            return $coaching;
        });
    }

    public function store(StoreCoachingData $data): void
    {

        // Just for checking that $data->users belongs to the user's company
        $users = User::currentCompany()->whereIn('id', $data->users)->get();
        $coachings = $users->map(fn (User $x) => [
            'year' => $data->year,
            'week' => $data->week,
            'subject' => $data->subject,
            'content' => $data->content,
            'category' => $data->category,
            'user_id' => $x->id,
            'type' => $data->type,
        ]);
        DB::transaction(function () use ($coachings): void {
            $coachings->each(fn ($x) => Coaching::create($x));
        });

        // Send push notifications
        $coachings->each(function ($x): void {
            try {
                SendNotificationTask::notifyCoaching(
                    $x['user_id'],
                    $x['subject'],
                    $x['type'],
                    $x['week'],
                    $x['year']
                );
            } catch (\Exception $e) {
                Log::error($e->getMessage());
            }
        }
        );

        // Send emails
        $coachings->each(function ($x) use ($users): void {
            try {
                $user = $users->find($x['user_id']);
                $user->notify(new CoachingNotification($x['subject'], $x['content']));
            } catch (\Exception $e) {
                Log::error($e->getMessage());
            }
        }
        );

    }
}
