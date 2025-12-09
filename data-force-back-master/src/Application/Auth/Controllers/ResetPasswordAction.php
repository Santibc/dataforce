<?php

namespace Src\Application\Auth\Controllers;

use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Lorisleiva\Actions\Concerns\AsAction;
use Src\Application\Auth\Controllers\DTOS\ResetPasswordDTO;
use Src\Auth\FormRequests\ResetPasswordFormRequest;
use Str;

class ResetPasswordAction
{
    use AsAction;

    public function handle(ResetPasswordDTO $dto)
    {
        $status = Password::reset(
            [
                'email' => $dto->email,
                'password' => $dto->password,
                'password_confirmation' => $dto->password_confirmation,
                'token' => $dto->token,
            ],
            function ($user, $password): void {
                $user->forceFill([
                    'password' => Hash::make($password),
                ])->setRememberToken(Str::random(60));

                $user->save();

                event(new PasswordReset($user));
            }
        );

        return $status == Password::PASSWORD_RESET;
    }

    /**
     * @group Authentication
     *
     * @bodyParam password_confirmation string required
     */
    public function asController(ResetPasswordFormRequest $request)
    {
        $dto = new ResetPasswordDTO($request->all());

        return \DB::transaction(fn () => $this->handle($dto));
    }
}
