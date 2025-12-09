<?php

namespace Src\Domain\Nanonets\Services;

use Illuminate\Http\UploadedFile;
use Src\Domain\Nanonets\Data\PerformancePageData;

class ImportPerformanceService
{
    public function import(UploadedFile $file)
    {

        $response = \Http::asMultipart()
            ->withHeaders([
                'x-api-key' => '0a327175-d186-11ee-83ac-f6f54680798e',
                'accept' => 'application/json',
            ])
            ->timeout(120)
            ->post('https://app.nanonets.com/api/v2.1/workflows/26ac0d23-d83d-4e1c-a517-f9e857d4c52a/run', [
                [
                    'contents' => fopen($file->getRealPath(), 'r'),
                    'name' => 'file',
                ],
            ]);

        if ($response->successful()) {
            $response_data = $response->json();

            return PerformancePageData::collection($response_data['results']);
        } else {
            \Log::debug('import nanonents error', $response->json());

            return collect([]);
        }
    }
}
