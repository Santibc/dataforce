<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Src\Domain\Performance\Models\Performance;
use Src\Domain\User\Models\User;

class CreatePerformanceSeeder extends Seeder
{

    public function run(): void
    {
        Performance::factory()->create([
            'driver_amazon_id' => 8,
            'week' => 6,
            'year' => 2024
        ]);
        Performance::factory()->create([
            'driver_amazon_id' => 9,
            'week' => 6,
            'year' => 2024
        ]);
        Performance::factory()->create([
            'driver_amazon_id' => 10,
            'week' => 6,
            'year' => 2024
        ]);
    }

}
