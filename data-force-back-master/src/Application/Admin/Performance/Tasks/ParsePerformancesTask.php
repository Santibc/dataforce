<?php

namespace Src\Application\Admin\Performance\Tasks;

use Illuminate\Support\Collection;
use Src\Domain\Performance\Models\Performance;
use Src\Domain\User\Models\User;

class ParsePerformancesTask
{
    public static function handle(Collection $prediction, int $week, int $year, int $document_id)
    {
        $ultimoElemento = $prediction->last();
        if (! array_key_exists('cells', $ultimoElemento)) {
            return 0;
        }
        $users = User::currentCompany()
            ->whereDoesntHave('roles', fn ($q) => $q->where('name', 'super_admin'))
            ->get();
        $cells = collect($ultimoElemento['cells'])->groupBy('row')->toArray();
        $count = 0;
        foreach ($cells as $cell) {
            if (array_key_exists(2, $cell)) {
                if (array_key_exists('text', $cell[2])) {
                    $user = $users->first(function ($u) use ($cell) {
                        $driver_amazon_id = str_replace(['0', '1'], ['O', 'I'], $u->driver_amazon_id);
                        $nanonets_id = str_replace(['0', '1'], ['O', 'I'], $cell[2]['text']);

                        return $driver_amazon_id == $nanonets_id;
                    });

                    if ($user && count($cell) == 20) {
                        $performance_exists = Performance::query()
                            ->where('week', $week)
                            ->where('year', $year)
                            ->where('driver_amazon_id', $user->driver_amazon_id)
                            ->count();
                        if ($performance_exists) {
                            continue;
                        }
                        $count = $count + 1;
                        Performance::create([
                            'serial_number' => $cell[0]['text'],
                            'driver_amazon_id' => $user->driver_amazon_id,
                            'week' => intval($week),
                            'year' => $year,
                            'overall_tier' => $cell[3]['text'],
                            'delivered' => $cell[4]['text'],
                            'key_focus_area' => $cell[5]['text'],
                            'fico_score' => $cell[6]['text'],
                            'seatbelt_off_rate' => $cell[7]['text'],
                            'speeding_event_ratio' => $cell[8]['text'],
                            'distraction_rate' => $cell[9]['text'],
                            'following_distance_rate' => $cell[10]['text'],
                            'signal_violations_rate' => $cell[11]['text'],
                            'cdf' => $cell[12]['text'],
                            'ced' => $cell[13]['text'],
                            'dcr' => $cell[14]['text'],
                            'dsb' => $cell[15]['text'],
                            'swc_pod' => $cell[16]['text'],
                            'psb' => $cell[17]['text'],
                            'dsb_dnr' => $cell[18]['text'],
                            'pod' => $cell[19]['text'],
                            'document_id' => $document_id,
                            // 'swc_cc' => remove
                            // 'swc_ad' => remove
                            // 'cc' => remove
                        ]);
                    }
                }
            }
        }

        return $count;
    }
}
