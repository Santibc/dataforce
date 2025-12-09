<?php

use Illuminate\Support\Facades\Route;
use Src\Application\Auth\Controllers\RegisterUserAction;
use Src\Application\Auth\Controllers\ResendVerificationEmailAction;
use Src\Application\User\Controllers\UserController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('login', [\Src\Application\Auth\Controllers\AuthController::class, 'login']);
Route::post('register', [RegisterUserAction::class, 'asController']);
Route::post('verify/resend', [ResendVerificationEmailAction::class, 'asController'])->name('verification.resend');
Route::post('forgot-password', [\Src\Application\Auth\Controllers\AuthController::class, 'forgotPassword'])->name('password.email');
Route::post('reset-password', [\Src\Application\Auth\Controllers\AuthController::class, 'resetPassword'])->name('password.reset');
Route::post('set-password', [\Src\Auth\Actions\SetPasswordAction::class, 'asController']);

Route::middleware(['auth:sanctum', 'verified', 'role:super_admin|admin'])->group(function (): void {

    // ------------------------------ USERS -----------------------------

    Route::resource('users', UserController::class);

});
