<?php

namespace Tests\Application\Admin\Auth\Controllers;

use Illuminate\Auth\Notifications\ResetPassword as ResetPasswordNotification;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Src\Application\Auth\Controllers\AuthController;
use Src\Domain\User\Models\User;
use Tests\TestCase;

class AuthControllerTest extends TestCase
{
    /** @test */
    public function successfull_login(): void
    {
        User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
        ]);

        $data = [
            'email' => 'test@example.com',
            'password' => 'password123',
        ];

        $response = $this->post('api/login', $data);

        $response->assertStatus(200);
    }

    /** @test */
    public function login_with_incorrect_credentials(): void
    {
        User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('password123'),
            'email_verified_at' => now(),
        ]);

        $data = [
            'email' => 'test@example.com',
            'password' => 'incorrectpassword',
        ];

        $response = $this->post('/api/login', $data);

        $response->assertStatus(422);
        $response->assertSee('The provided credentials are incorrect.');
    }

    /** @test */
    public function email_not_verified(): void
    {
        User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('password123'),
            'email_verified_at' => null,
        ]);

        $data = [
            'email' => 'test@example.com',
            'password' => 'password123',
        ];

        $response = $this->post('api/login', $data);

        $response->assertStatus(422);
        $response->assertSee('The email is not verified.');
    }

    /** @test */
    //    public function verify_email(): void
    //    {
    //        $this->withoutExceptionHandling();
    //        $user = User::factory()->create();
    //
    //        $url = URL::temporarySignedRoute(
    //            'verification.verify_api',
    //            Carbon::now()->addMinutes(Config::get('auth.verification.expire', 60)),
    //            [
    //                'id' => $user->getKey(),
    //                'hash' => sha1($user->getEmailForVerification()),
    //            ]
    //        );
    //
    //        $this->get($url)->assertRedirect(config('app.spa_url')."/#/auth/email-verification/successful");
    //
    //        $this->assertDatabaseHas('users', ['email_verified_at' => Carbon::now()]);
    //    }

    /** @test */
    public function forgot_password(): void
    {
        $this->withoutExceptionHandling();
        Notification::fake();

        $user = User::factory()->create();

        $this->post(action([AuthController::class, 'forgotPassword'], ['email' => $user->email]))->assertOk();

        $token = null;

        Notification::assertSentTo($user, ResetPasswordNotification::class, function ($notification) use (&$token) {
            $token = $notification->token;

            return true;
        });

        // Afirmar que el token no es nulo
        $this->assertNotNull($token);

        // Restablecer la contraseña
        $newPassword = 'new_password';
        $this->post(action([AuthController::class, 'resetPassword']), [
            'token' => $token,
            'email' => $user->email,
            'password' => $newPassword,
            'password_confirmation' => $newPassword,
        ])->assertOk();

        // Afirmar que la contraseña se restableció correctamente
        $user->refresh();
        $this->assertTrue(Hash::check($newPassword, $user->password));
    }
}
