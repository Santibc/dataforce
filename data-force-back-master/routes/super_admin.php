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

    // ------------------------------ CHAT --------------------------------
    Route::get('chat-groups', [\Src\Application\SuperAdmin\Chat\Controllers\SuperAdminChatGroupController::class, 'index']);
    Route::post('chat-groups', [\Src\Application\SuperAdmin\Chat\Controllers\SuperAdminChatGroupController::class, 'store']);
    Route::get('chat-groups/unread-counts', [\Src\Application\SuperAdmin\Chat\Controllers\SuperAdminChatGroupController::class, 'unreadCounts']);
    Route::get('chat-groups/owners', [\Src\Application\SuperAdmin\Chat\Controllers\SuperAdminChatGroupController::class, 'getOwners']);
    Route::get('chat-groups/{id}', [\Src\Application\SuperAdmin\Chat\Controllers\SuperAdminChatGroupController::class, 'show']);
    Route::put('chat-groups/{id}', [\Src\Application\SuperAdmin\Chat\Controllers\SuperAdminChatGroupController::class, 'update']);
    Route::delete('chat-groups/{id}', [\Src\Application\SuperAdmin\Chat\Controllers\SuperAdminChatGroupController::class, 'destroy']);
    Route::post('chat-groups/{id}/members', [\Src\Application\SuperAdmin\Chat\Controllers\SuperAdminChatGroupController::class, 'addMembers']);
    Route::delete('chat-groups/{id}/members', [\Src\Application\SuperAdmin\Chat\Controllers\SuperAdminChatGroupController::class, 'removeMembers']);
    Route::get('chat-groups/{id}/messages', [\Src\Application\SuperAdmin\Chat\Controllers\SuperAdminChatMessageController::class, 'index']);
    Route::post('chat-groups/{id}/messages', [\Src\Application\SuperAdmin\Chat\Controllers\SuperAdminChatMessageController::class, 'store']);
    Route::put('chat-groups/{id}/messages/read', [\Src\Application\SuperAdmin\Chat\Controllers\SuperAdminChatMessageController::class, 'markAsRead']);

});
