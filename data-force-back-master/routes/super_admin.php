<?php

Route::middleware(['auth:sanctum', 'verified', 'role:super_admin'])->group(function (): void {

    // ------------------------------ COMPANIES -----------------------------
    Route::get('companies', [\Src\Application\SuperAdmin\Company\Controllers\CompanyController::class, 'index']);
    Route::get(
        'companies/{company_id}',
        [\Src\Application\SuperAdmin\Company\Controllers\CompanyController::class, 'show']
    );

    // ------------------------------ COMPANIES DETAIL -----------------------------
    Route::get(
        '/detail/companies/{company_id}',
        [\Src\Application\SuperAdmin\Company\Controllers\CompanyController::class, 'show_detail']
    );
    Route::delete('companies/{company_id}', [\Src\Application\SuperAdmin\Company\Controllers\CompanyController::class, 'destroy']);
    Route::put(
        '/companies',
        [\Src\Application\SuperAdmin\Company\Controllers\CompanyController::class, 'update']
    );

    // ------------------------------ JOBSITES DETAIL -----------------------------
    Route::resource(
        'jobsites',
        \Src\Application\SuperAdmin\Jobsite\Controllers\JobsiteController::class
    );

    // ------------------------------ POSITION DETAIL -----------------------------
    Route::resource(
        'positions',
        \Src\Application\SuperAdmin\Position\Controllers\PositionController::class
    );

    // ------------------------------ USER DETAIL -----------------------------
    Route::resource(
        'users',
        \Src\Application\SuperAdmin\User\Controllers\UserController::class
    );

    Route::get('companies/{company_id}/token', [\Src\Application\SuperAdmin\Company\Controllers\CompanyController::class, 'getBosmetricsCompanyUserToken']);

});
