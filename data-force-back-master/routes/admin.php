<?php

use Illuminate\Support\Facades\Route;
use Src\Application\Admin\Company\Controllers\CompanyController;
use Src\Application\Admin\Jobsite\Controllers\JobsiteController;
use Src\Application\Admin\Position\Controllers\PositionController;
use Src\Application\Admin\Shift\Controllers\ShiftController;
use Src\Application\Admin\User\Controllers\UserController;
use Src\Application\Auth\Controllers\RegisterUserAction;
use Src\Application\Auth\Controllers\ResendVerificationEmailAction;

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
Route::post('companies/register', [CompanyController::class, 'register']);
Route::post('verify/resend', [ResendVerificationEmailAction::class, 'asController'])->name('verification.resend');
Route::post('forgot-password', [\Src\Application\Auth\Controllers\AuthController::class, 'forgotPassword'])->name('password.email');
Route::post('reset-password', [\Src\Application\Auth\Controllers\AuthController::class, 'resetPassword'])->name('password.reset');

Route::middleware(['auth:sanctum', 'verified', 'role:super_admin|admin|owner|manager'])->group(function (): void {

    // ------------------------------ USERS -----------------------------
    Route::resource('users', UserController::class);
    Route::post('users/import', [\Src\Application\Admin\User\Controllers\ImportUserController::class, 'sync']);

    // ------------------------------ COMPANIES -----------------------------
    Route::resource('companies', CompanyController::class);

    // ------------------------------ POSITIONS -----------------------------
    Route::resource('positions', PositionController::class);

    // ------------------------------ JOBSITES -----------------------------
    Route::resource('jobsites', JobsiteController::class);

    // ------------------------------ SHIFTS -----------------------------
    Route::resource('shifts', ShiftController::class);
    Route::post('shifts/copy', [ShiftController::class, 'copy']);
    Route::delete('shifts/delete/user', [ShiftController::class, 'delete_shift_user']);

    // ------------------------------ SHIFTS PUBLISH -----------------------------
    Route::put('shifts/{id}/publish', [\Src\Application\Admin\Shift\Controllers\ShiftPublishController::class, 'publish']);
    Route::put('shifts/publish/all', [\Src\Application\Admin\Shift\Controllers\ShiftPublishController::class, 'publish_all']);

    // ------------------------------ ROLES -----------------------------
    Route::resource('roles', \Src\Application\Admin\Roles\Controllers\RolesController::class);

    // ------------------------------ SCHEDULE -----------------------------
    Route::get('schedule', [\Src\Application\Admin\Schedule\Controllers\ScheduleController::class, 'handle']);
    Route::delete('schedule/clean', [\Src\Application\Admin\Schedule\Controllers\ScheduleController::class, 'clean']);

    // ------------------------------ PERFORMANCE -----------------------------
    Route::get('performance', [\Src\Application\Admin\Performance\Controllers\PerformanceController::class, 'get_performances']);
    Route::get('performance/{user_id}', [\Src\Application\Admin\Performance\Controllers\PerformanceController::class, 'get_performances_user']);
    Route::post('performance/import', [\Src\Application\Admin\Performance\Controllers\PerformanceController::class, 'import']);
    Route::get('count/performance', [\Src\Application\Admin\Performance\Controllers\PerformanceController::class, 'get_count']);

    // ------------------------------ DOCUMENTS -----------------------------
    Route::apiResource('documents', \Src\Application\Admin\Document\Controllers\DocumentsController::class)->except(['store']);
    Route::get('documents/{document}/download', [\Src\Application\Admin\Document\Controllers\DocumentsController::class, 'download'])->name('download_document');

    // ------------------------------ METRICS -----------------------------
    Route::get('metrics', [\Src\Application\Admin\Metrics\Controllers\MetricsController::class, 'get_metrics']);

    // ------------------------------ COACHING -----------------------------
    Route::get('coaching', [\Src\Application\Admin\Coaching\Controllers\CoachingController::class, 'get_coaching']);
    Route::post('coaching', [\Src\Application\Admin\Coaching\Controllers\CoachingController::class, 'store']);

    Route::get('companies/me/subscription', [\Src\Application\Admin\Subscription\Controller\SubscriptionController::class, 'getSuscriptionInformation']);

    Route::get('companies/me/stripe-checkout-url', [
        \Src\Application\Admin\Subscription\Controller\SubscriptionController::class, 'getCheckoutSignedUrl',
    ]);
    Route::get('companies/me/stripe-billing-portal-url', [
        \Src\Application\Admin\Subscription\Controller\SubscriptionController::class, 'getBillingPortalSignedUrl',
    ]);
});
