<?php

namespace Src\Application\Auth\Controllers;

use Illuminate\Http\Request;
use Lorisleiva\Actions\Concerns\AsAction;
use Src\Domain\User\Models\User;

class ResendVerificationEmailAction
{
    use AsAction;

    public function handle($email): void
    {
        $user = User::whereEmail($email)->first();
        if ($user && ! $user->email_verified_at) {
            $user->sendEmailVerificationNotification();
        }
    }

    /**
     * @bodyParam email string required example: pepe@gmail.com
     *
     * @group Authentication
     */
    public function asController(Request $request): void
    {
        $this->handle($request->get('email'));
    }
}
