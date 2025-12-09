<?php

namespace Src\Application\Admin\Performance\Controllers;

use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Src\Application\Admin\Performance\Data\ImportPerformanceData;
use Src\Application\Admin\Performance\Resources\PerformanceResource;
use Src\Application\Admin\Performance\Resources\PerformanceUserResource;
use Src\Application\Admin\Performance\Tasks\ParseMetricsTask;
use Src\Application\Admin\Performance\Tasks\ParsePerformancesTask;
use Src\Application\Admin\Performance\Tasks\ParseTrailingWeeksPerformanceTask;
use Src\Domain\Document\Models\Document;
use Src\Domain\Nanonets\Data\PerformancePageData;
use Src\Domain\Nanonets\Services\ImportPerformanceService;
use Src\Domain\Performance\Models\Performance;
use Src\Domain\User\Models\User;

class PerformanceController
{
    public function get_performances()
    {
        $performances = Performance::query()
            ->join('users', function ($join): void {
                $join->on('performance.driver_amazon_id', '=', 'users.driver_amazon_id')
                    ->where('users.company_id', auth()->user()->company_id);
            })
            ->orderBy('users.firstname', 'asc')
            ->orderBy('users.lastname', 'asc')
            ->orderBy('performance.year', 'desc')
            ->orderBy('performance.week', 'desc')
            ->selectRaw('performance.*')
            ->with('user')
            ->get()
            ->groupBy('driver_amazon_id')
            ->map(function ($group) {
                return $group->first();
            })
            ->values();

        return PerformanceResource::collection($performances);
    }

    public function get_performances_user(int|string $user_id): PerformanceUserResource
    {
        $performances = User::currentCompany()
            ->where('id', $user_id)
            ->with(['performance' => function ($query): void {
                $query->orderBy('week', 'desc');
            }])
            ->first();

        return PerformanceUserResource::from($performances);
    }

    public function get_count(): string
    {
        $users = User::currentCompany()
            ->whereDoesntHave('roles', fn ($q) => $q->where('name', 'super_admin'))
            ->with('performance')
            ->get();

        return $users->toJson();
    }

    public function import(ImportPerformanceData $data): void
    {

        DB::transaction(function () use ($data): void {

            $tries = 0;
            $succes = false;

            $user = auth()->user();

            $document = Document::create([
                'name' => $data->file->getClientOriginalName(),
                'company_id' => $user->company_id,
                'user_id' => $user->id,
            ]);

            while ($tries < config('app.max_import_tries') && ! $succes) {
                try {
                    $this->tryImport($data, $document->id);
                    $succes = true;
                } catch (Exception $e) {
                    \Log::error('error nanonets', ['mesage' => $e->getMessage()]);
                    $tries++;
                }
            }

            $document->addFile($data->file);

            if (! $succes) {
                abort(500, 'Error importing data');
            }
        });

    }

    private function tryImport(ImportPerformanceData $data, int $document_id)
    {
        $performance_service = new ImportPerformanceService;
        $performances = $performance_service->import($data->file);

        if (count($performances) == 0) {
            return 0;
        }

        $count = 0;
        $week = 0;
        $year = 0;

        $performances->each(function (PerformancePageData $p) use (&$count, &$year, &$week, $document_id): void {
            if ($p->prediction === null) {
                return;
            }
            $prediction_collect = collect($p->prediction);

            if ($this->isMetricsPage($prediction_collect)) {

                $item = $prediction_collect->first(fn ($x) => $x['label'] === 'Document_name');
                $document_name = $item['ocr_text'];
                $week = $this->extractWeekNumber($document_name);
                if ($week <= 0) {
                    throw new Exception("Week can't be parsed");
                }
                $year = $this->extractYear($document_name);
                if ($year <= 0) {
                    throw new Exception("Year can't be parsed");
                }
                ParseMetricsTask::handle($prediction_collect, $week, $year, $document_id);
            } elseif ($this->isPerformancePage($prediction_collect)) {
                $count += ParsePerformancesTask::handle($prediction_collect, $week, $year, $document_id);
            } elseif ($this->isTrailingWeeksPerformancePage($prediction_collect)) {
                ParseTrailingWeeksPerformanceTask::handle($prediction_collect, $week, $year, $document_id);
            }
        });

        return $count;
    }

    private function isMetricsPage($prediction): bool
    {
        return $prediction->pluck('label')->contains(function ($item) {
            return in_array($item, ['Safety_and_compliance', 'Team', 'Quality']);
        }) && $prediction[0]['page_no'] < 4;

    }

    private function isPerformancePage($prediction): bool
    {
        if (Str::contains($prediction[0]['ocr_text'], 'Current Week')) {
            return true;
        }
        if ($prediction->count() > 1 && Str::contains($prediction[1]['ocr_text'], 'Current Week')) {
            return true;
        }

        return false;
    }

    private function isTrailingWeeksPerformancePage($prediction): bool
    {
        if (Str::contains($prediction[0]['ocr_text'], 'Trailing 6')) {
            return true;
        }
        if ($prediction->count() > 1 && Str::contains($prediction[1]['ocr_text'], 'Trailing 6')) {
            return true;
        }

        return false;
    }

    public function extractWeekNumber($string): int|string
    {
        $pattern = '/Week (\d+)/';
        preg_match($pattern, $string, $matches);
        if (isset($matches[1])) {
            return $matches[1];
        } else {
            return -1;
        }
    }

    public function extractYear($string): int|string
    {
        $pattern = '/\b(\d{4})\b/';
        preg_match($pattern, $string, $matches);
        if (isset($matches[1])) {
            return $matches[1];
        } else {
            return -1;
        }
    }
}
