<?php
// routes/api.php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ForgotPasswordController;
use Illuminate\Support\Facades\Hash;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Route de test
Route::get('/test', function() {
    return response()->json(['message' => 'API is working']);
});

Route::post('/login', [AuthController::class, 'login']);
Route::post('/decrypt-token', [AuthController::class, 'decryptToken']);

// Routes protégées
Route::middleware(['jwt.cookie', 'auth:api'])->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
});
// Routes de mot de passe oublié
Route::post('/password/forgot', [ForgotPasswordController::class, 'forgot'])->name('password.forgot');
Route::post('/password/reset/{token}', [ForgotPasswordController::class, 'resetPassword'])->name('password.reset');

// Routes protégées par authentification
Route::middleware('auth:api')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout'])->name('logout');
});