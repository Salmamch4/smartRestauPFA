<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ForgotPasswordController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\AdminController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// --- Test API ---
Route::get('/test', function () {
    return response()->json(['message' => 'API is working properly']);
});


// =========================
// AUTH
// =========================
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register-client', [AuthController::class, 'registerClient']);
    Route::post('/refresh', [AuthController::class, 'refreshToken']);
    Route::post('/logout', [AuthController::class, 'logout']);
});
Route::patch('/password/reset-test/{token}', function($token){
    return response()->json([
        'message' => 'Route works!',
        'token' => $token
    ]);
});


// =========================
// PASSWORD RESET
// =========================
Route::post('/password/forgot', [ForgotPasswordController::class, 'forgot'])->name('password.forgot');
Route::patch('/password/reset/{token}', [ForgotPasswordController::class, 'resetPassword'])->name('password.reset');


// =========================
// ADMIN ROUTES
// =========================
Route::prefix('admin')
    ->middleware('role:ADMIN')
    ->group(function () {
        Route::get('/stats', [AdminController::class, 'getStats']);

        // Gestion clients
        Route::get('/clients', [AdminController::class, 'getClients']);
        Route::post('/clients/{id}/toggle', [AdminController::class, 'toggleClientStatus']);

        // Gestion employés
        Route::get('/employees', [AdminController::class, 'getEmployees']);
        Route::post('/employees', [AdminController::class, 'storeEmployee']);
        Route::put('/employees/{id}', [AdminController::class, 'updateEmployee']);
        Route::delete('/employees/{id}', [AdminController::class, 'deleteEmployee']);

    });


// =========================
// CLIENT ROUTES
// =========================
Route::prefix('client')
    ->middleware('role:CLIENT')
    ->group(function () {
        Route::get('/profile', [ClientController::class, 'myProfile']);
        Route::put('/profile', [ClientController::class, 'updateMyProfile']);
        Route::put('/profile/full-update', [ClientController::class, 'fullUpdate']);
        Route::post('/deactivate-account', [ClientController::class, 'deactivateMyAccount']);
    });


// =========================
// ROLES (Admin only)
// =========================
Route::prefix('roles')
    ->middleware('role:ADMIN')
    ->group(function () {
        Route::get('/', [RoleController::class, 'index']);
        Route::post('/', [RoleController::class, 'store']);
        Route::get('/{id}', [RoleController::class, 'show']);
        Route::put('/{id}', [RoleController::class, 'update']);
        Route::delete('/{id}', [RoleController::class, 'destroy']);
    });