<?php

namespace Tests\Domain\User\QueryBuilders;

use Src\Domain\Jobsite\Models\Jobsite;
use Src\Domain\User\Models\User;
use Tests\TestCase;

class UserQueryBuilderTest extends TestCase
{
    /** @test */
    public function where_jobsites(): void
    {

        $user = User::factory()->create();
        $jobsite = Jobsite::factory()->create([
            'company_id' => $user->company_id,
        ]);
        User::factory()->create();

        $user->jobsites()->attach($jobsite->id);

        // test with id parameter in whereJobsites
        $this->actingAs($user)->assertCount(1, User::query()->whereJobsites($jobsite->id)->get());
        $this->actingAs($user)->assertEquals($user->id, User::query()->whereJobsites($jobsite->id)->first()->id);

        // test with instance of Jobsite parameter in whereJobsites
        $this->actingAs($user)->assertCount(1, User::query()->whereJobsites($jobsite)->get());
        $this->actingAs($user)->assertEquals($user->id, User::query()->whereJobsites($jobsite)->first()->id);

        // test with array of jobsites_id parameter in whereJobsites
        $this->actingAs($user)->assertCount(1, User::query()->whereJobsites([$jobsite->id])->get());
        $this->actingAs($user)->assertEquals($user->id, User::query()->whereJobsites([$jobsite->id])->first()->id);

    }
}
