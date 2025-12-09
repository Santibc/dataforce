<?php

namespace Tests\Application\User\Notification\Controllers;

use Src\Application\Driver\Notifications\Controllers\NotificationsController;
use Src\Domain\User\Enums\Roles;
use Src\Domain\User\Models\User;
use Tests\TestCase;

class NotificationControllerTest extends TestCase
{
    /** @test  */
    public function update_token(): void
    {
        $this->withoutExceptionHandling();
        $user = User::factory()->withRole(Roles::USER)->create();

        $data = ['token' => $this->faker->name];

        $this->actingAs($user)
            ->put(action([NotificationsController::class, 'updateNotificationToken']), $data)
            ->assertOk();

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'notification_token' => $data['token'],
        ]);
    }
}
