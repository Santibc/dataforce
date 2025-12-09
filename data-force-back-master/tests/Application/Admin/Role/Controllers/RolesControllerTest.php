<?php

namespace Tests\Application\Admin\Role\Controllers;

use Spatie\Permission\Models\Role;
use Src\Application\Admin\Roles\Controllers\RolesController;
use Src\Domain\User\Enums\Roles;
use Src\Domain\User\Models\User;
use Tests\TestCase;

class RolesControllerTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        $user = User::factory()->withRole(Roles::ADMIN)->create();
        $this->actingAs($user);
    }

    /** @test */
    public function index(): void
    {

        $roles = Role::all()->map(fn ($x) => ['name' => $x->name])->toArray();

        $this->get(action([RolesController::class, 'index']))
            ->assertOk()
            ->assertJson($roles);

    }
}
