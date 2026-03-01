<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ForgotPasswordController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\ProfileController;


Route::get('/test', function () {
    return response()->json(['message' => 'API is working']);
});

Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register-client', [AuthController::class, 'registerClient']);

Route::post('/auth/test-logout', [\App\Http\Controllers\AuthController::class, 'logout']);
Route::post('/password/forgot', [ForgotPasswordController::class, 'forgot'])->name('password.forgot');
Route::post('/password/reset/{token}', [ForgotPasswordController::class, 'resetPassword'])->name('password.reset');

Route::middleware('auth:api')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout'])->name('logout');
    Route::post('/auth/refresh', [AuthController::class, 'refresh']);
    Route::get('/auth/me', [AuthController::class, 'me']);
});


Route::apiResource('roles', RoleController::class);

Route::apiResource('clients', ClientController::class);
Route::put('/clients/{id}/full-update', [ClientController::class, 'fullUpdate']);
