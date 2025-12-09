<?php

namespace Src\Application\Admin\Performance\Tasks;

use Illuminate\Support\Collection;
use Src\Domain\Performance\Models\TrailingWeeksPerformance;
use Src\Domain\User\Models\User;

class ParseTrailingWeeksPerformanceTask
{
    public static function handle(Collection $prediction, int $week, int $year, int $document_id)
    {
        $ultimo_elemento = $prediction->last();
        if (! array_key_exists('cells', $ultimo_elemento)) {
            return 0;
        }

        $users = User::currentCompany()
            ->whereDoesntHave('roles', fn ($q) => $q->where('name', 'super_admin'))
            ->get();

        $rows = collect($ultimo_elemento['cells'])->groupBy('row')->toArray();

        $count = 0;
        foreach ($rows as $row) {
            if (count($row) < 19) {
                continue;
            }

            $user = $users->first(function ($user) use ($row) {
                $driver_amazon_id = str_replace(['0', '1'], ['O', 'I'], $user->driver_amazon_id);
                $nanonets_id = str_replace(['0', '1'], ['O', 'I'], $row[2]['text']);

                return $driver_amazon_id == $nanonets_id;
            });
            if (! $user) {
                continue;
            }

            $trailing_weeks_performance_exists = TrailingWeeksPerformance::query()
                ->where('week', $week)
                ->where('year', $year)
                ->where('driver_amazon_id', $user->driver_amazon_id)
                ->count();

            if ($trailing_weeks_performance_exists) {
                continue;
            }

            TrailingWeeksPerformance::create([
                'driver_amazon_id' => $user->driver_amazon_id,
                'year' => $year,
                'week' => $week,

                'fico_score' => $row[3]['text'],
                'seatbelt_off_rate' => $row[4]['text'],
                'speeding_event_ratio' => $row[5]['text'],
                'distraction_rate' => $row[6]['text'],
                'following_distance_rate' => $row[7]['text'],
                'signal_violations_rate' => $row[8]['text'],

                'cdf' => $row[9]['text'],
                'dcr' => $row[10]['text'],
                'dsb' => $row[11]['text'],
                'swc_pod' => $row[12]['text'],
                'psb' => $row[13]['text'],
                // 'swc_cc' => remove,
                // 'swc_ad' => remove,
                'performer_status' => $row[14]['text'],
                'weeks_fantastic' => intval($row[15]['text']),
                'weeks_great' => intval($row[16]['text']),
                'weeks_fair' => intval($row[17]['text']),
                'weeks_poor' => intval($row[18]['text']),
                'document_id' => $document_id,
            ]);

            $count = $count + 1;
        }

        return $count;
    }
}
