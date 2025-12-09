<?php

use Illuminate\Support\Facades\Route;
use Src\Application\Admin\Subscription\Controller\SubscriptionController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function (): void {
    $a = \Illuminate\Support\Facades\Auth::loginUsingId(1);
});

Route::get('/email/verify/{id}/{hash}', [\Src\Application\Auth\Controllers\AuthController::class, 'verify'])
    ->middleware('signed')
    ->name('verification.verify_api');

Route::get('stripe-checkout/{company_id}', [SubscriptionController::class, 'checkout'])->name('stripe-checkout');

Route::get('stripe-billing-portal/{company_id}', [SubscriptionController::class, 'billingPortal'])->name('stripe-billing-portal');
