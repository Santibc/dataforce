<?php

namespace Src\Application\Driver\Notifications\Controllers;

use Src\Application\Driver\Notifications\Data\UpdateNotificationTokenData;
use Src\Domain\User\Models\User;

class NotificationsController
{
    public function updateNotificationToken(UpdateNotificationTokenData $data): void
    {
        $user = User::findOrFail($data->user_id);
        $user->update(['notification_token' => $data->token]);
    }
}
