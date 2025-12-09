<?php

namespace Src\Application\Auth\Controllers;

use Illuminate\Support\Facades\Password;
use Lorisleiva\Actions\Concerns\AsAction;
use Src\Auth\FormRequests\ForgotPasswordFormRequest;

class ForgotPasswordAction
{
    use AsAction;

    public function handle($email)
    {
        $status = Password::sendResetLink(['email' => $email]);

        return $status === Password::RESET_LINK_SENT;
    }

    public function asController(ForgotPasswordFormRequest $request): void
    {
        $this->handle($request->get('email'));
    }
}
