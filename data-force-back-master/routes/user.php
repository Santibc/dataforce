<?php

use Illuminate\Support\Facades\Route;
use Src\Application\Auth\Controllers\RegisterUserAction;
use Src\Application\Auth\Controllers\ResendVerificationEmailAction;

Route::post('login', [\Src\Application\Auth\Controllers\AuthController::class, 'login']);
Route::post('register', [RegisterUserAction::class, 'asController']);
Route::post('verify/resend', [ResendVerificationEmailAction::class, 'asController'])->name('verification.resend');
Route::post('forgot-password', [\Src\Application\Auth\Controllers\AuthController::class, 'forgotPassword'])->name('password.email');
Route::post('reset-password', [\Src\Application\Auth\Controllers\AuthController::class, 'resetPassword'])->name('password.reset');

Route::middleware(['auth:sanctum', 'verified', 'role:user|admin|manager|super_admin'])->group(function (): void {

    // ------------------------------ USER -----------------------------
    Route::get('user/{user_id}', [\Src\Application\Admin\User\Controllers\UserController::class, 'show']);
    Route::delete('user/{user_id}', [\Src\Application\Admin\User\Controllers\UserController::class, 'destroy']);

    // ------------------------------ SCHEDULE -----------------------------
    Route::get('schedule', [\Src\Application\Driver\Schedule\Controllers\ScheduleController::class, 'get_schedule']);

    // ------------------------------ PREFERENCES -----------------------------
    Route::get('preferences', [\Src\Application\Driver\Preferences\Controllers\PreferencesController::class, 'get_preferences']);
    Route::post('preferences', [\Src\Application\Driver\Preferences\Controllers\PreferencesController::class, 'store_or_update']);
    Route::post('preferences/copy', [\Src\Application\Driver\Preferences\Controllers\PreferencesController::class, 'copy_week_finishing_at_date']);

    // ------------------------------ SHIFTS -----------------------------
    Route::post('shifts/confirm', [\Src\Application\Driver\Shifts\Controllers\ShiftController::class, 'confirm']);

    // ------------------------------ NOTIFICATIONS -----------------------
    Route::put('notification-token', [\Src\Application\Driver\Notifications\Controllers\NotificationsController::class, 'updateNotificationToken']);

    // ------------------------------ PERFORMANCE -----------------------
    Route::get('performance', [\Src\Application\Driver\Performance\Controllers\PerformanceController::class, 'get_performance']);

    // ------------------------------ COACHING -----------------------
    Route::get('coaching', [\Src\Application\Driver\Coaching\Controllers\CoachingController::class, 'get_coaching']);
    Route::post('coaching/{coaching_id}', [\Src\Application\Driver\Coaching\Controllers\CoachingController::class, 'read']);

});
