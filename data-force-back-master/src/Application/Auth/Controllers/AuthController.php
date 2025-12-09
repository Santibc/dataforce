<?php

namespace Src\Application\Auth\Controllers;

use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Password;
use Src\Application\Auth\Data\LoginData;
use Src\Application\Auth\Data\ResetPasswordData;
use Src\Application\Auth\Data\VerifyData;
use Src\Domain\User\Models\User;

class AuthController
{
    public function login(LoginData $data)
    {
        $user = User::where('email', $data->email)->first();
        if (! $user || ! Hash::check($data->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        if (is_null($user->email_verified_at)) {
            throw ValidationException::withMessages([
                'email' => ['The email is not verified.'],
            ]);
        }

        return $user->createToken($user->email)->plainTextToken;
    }

    public function verify(VerifyData $data)
    {
        try {
            DB::transaction(function () use ($data): void {
                $user = User::findOrFail($data->id);

                if (! hash_equals((string) $data->id, (string) $user->getKey())) {
                    throw new ModelNotFoundException('Verification url not found.', 404);
                }

                if (! hash_equals((string) $data->hash, sha1($user->getEmailForVerification()))) {
                    throw new ModelNotFoundException('Verification url not found.', 404);
                }

                $user->email_verified_at = now();
                $user->save();
            });
        } catch (ModelNotFoundException $e) {
            return redirect(config('app.spa_url').'/#/auth/email-verification/unsuccessful');
        }

        return redirect(config('app.spa_url').'/#/auth/email-verification/successful');
    }

    public function forgotPassword(Request $r): bool
    {
        $status = Password::sendResetLink(['email' => $r->get('email')]);

        return $status === Password::RESET_LINK_SENT;
    }

    public function resetPassword(ResetPasswordData $data): bool
    {
        $status = \Illuminate\Support\Facades\Password::reset(
            [
                'email' => $data->email,
                'password' => $data->password,
                'password_confirmation' => $data->password_confirmation,
                'token' => $data->token,
            ],
            function ($user, $password): void {
                $user->forceFill(['password' => Hash::make($password)])->setRememberToken(Str::random(60));
                $user->save();
                event(new PasswordReset($user));
            }
        );

        return $status === Password::PASSWORD_RESET;
    }
}
