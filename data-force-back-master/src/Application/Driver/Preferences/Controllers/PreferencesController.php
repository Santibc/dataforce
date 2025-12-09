<?php

namespace Src\Application\Driver\Preferences\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Src\Application\Driver\Preferences\Data\CopyPreferencesParams;
use Src\Application\Driver\Preferences\Data\GetPreferecesParams;
use Src\Application\Driver\Preferences\Data\StorePreferencesData;
use Src\Application\Driver\Preferences\Resource\PreferencesResource;
use Src\Domain\Preferences\Models\Preference;
use Src\Domain\Shift\Models\Shift;
use Symfony\Component\HttpKernel\Exception\HttpException;

class PreferencesController
{
    public function get_preferences(GetPreferecesParams $data)
    {
        $preferences = Preference::between($data->from, $data->to)
            ->whereUserId(auth()->user()->id)
            ->get();

        return PreferencesResource::collection($preferences);
    }

    public function copy_week_finishing_at_date(CopyPreferencesParams $params): void
    {
        $from = $params->date->copy()->subWeek();
        $to = $params->date;
        $previous_preferences = Preference::between($from, $to)
            ->whereUserId(auth()->user()->id)
            ->get();

        $dates = collect($previous_preferences)
            ->filter(fn ($pref) => ! $pref->available)
            ->pluck('date')
            ->map(fn ($date) => $date->copy()->addWeek()->toDateString());

        if ($this->hasAnyDateWithShift($dates)) {
            throw new HttpException(422, 'There are days marked as unavailable where shifts have already been assigned.');
        }

        DB::transaction(function () use ($previous_preferences): void {
            foreach ($previous_preferences as $preference) {

                Preference::create(
                    [
                        'date' => $preference->date->copy()->addWeek(),
                        'available' => $preference->available,
                        'user_id' => auth()->user()->id,
                    ]
                );
            }
        });
    }

    public function store_or_update(Request $request): void
    {

        $data = $request->get('data');
        $preferences_date = [];

        foreach ($data as $d) {
            $preferences_date[] = StorePreferencesData::createFromArray($d);
        }

        $not_available_dates = collect($preferences_date)
            ->filter(fn ($pref) => ! $pref->available)
            ->pluck('date')
            ->map(fn ($date) => $date->toDateString());

        if ($this->hasAnyDateWithShift($not_available_dates)) {
            throw new HttpException(422, 'There are days marked as unavailable where shifts have already been assigned.');
        }

        DB::transaction(function () use ($preferences_date): void {
            foreach ($preferences_date as $preference_item) {
                if ($preference_item->id !== null) {
                    $preference = Preference::findOrFail($preference_item->id);
                    $preference->update(['available' => $preference_item->available]);
                } else {
                    Preference::create(
                        [
                            'date' => $preference_item->date,
                            'available' => $preference_item->available,
                            'user_id' => auth()->user()->id,
                        ]
                    );
                }
            }

        });
    }

    // A conflicting shift exists when a user sets a day as unavailable and there is a shift assigned to that day
    // There is a catch. If the user sets a day as unavailable, then is assigned a Shift to that day, the user has to be able to
    // set as either unavaible or available because the hole week is saved every time.
    private function hasAnyDateWithShift($dates)
    {

        $conflicting_shifts = Shift::where('user_id', auth()->user()->id)
            ->where('published', true)
            ->inDates($dates);

        return $conflicting_shifts->exists();
    }
}
