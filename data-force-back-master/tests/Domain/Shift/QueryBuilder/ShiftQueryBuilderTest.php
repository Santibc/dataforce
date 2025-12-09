<?php

namespace Tests\Domain\Shift\QueryBuilder;

use Carbon\Carbon;
use Src\Domain\Shift\Models\Shift;
use Tests\TestCase;

class ShiftQueryBuilderTest extends TestCase
{
    /** @test */
    public function from_date(): void
    {

        $shift = Shift::factory()->create(['from' => Carbon::now()->addDay()]);
        Shift::factory()->create(['from' => Carbon::now()->subDay()]);

        $this->assertCount(1, Shift::query()->fromDate(Carbon::now())->get());
        $this->assertEquals($shift->id, Shift::query()->fromDate(Carbon::now())->first()->id);

    }

    /** @test */
    public function to_date(): void
    {
        Shift::factory()->create(['to' => Carbon::now()->addDay()]);
        $shift = Shift::factory()->create(['to' => Carbon::now()->subDay()]);

        $this->assertCount(1, Shift::query()->toDate(Carbon::now())->get());
        $this->assertEquals($shift->id, Shift::query()->toDate(Carbon::now())->first()->id);
    }

    /** @test */
    public function between(): void
    {
        $shift = Shift::factory()->create(['from' => Carbon::now(), 'to' => Carbon::now()->addDay()]);
        Shift::factory()->create(['from' => Carbon::now()->subDays(10), 'to' => Carbon::now()->subDays(9)]);
        Shift::factory()->create(['from' => Carbon::now()->addDays(9), 'to' => Carbon::now()->addDays(10)]);

        $from = Carbon::now()->subDays(2);
        $to = Carbon::now()->addDays(2);

        $this->assertCount(1, Shift::query()->between($from, $to)->get());
        $this->assertEquals($shift->id, Shift::query()->between($from, $to)->first()->id);
    }
}
