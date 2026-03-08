<?php
// routes/api.php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ForgotPasswordController;
<<<<<<< HEAD
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
=======
use App\Http\Controllers\ClientController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\ProfileController;


Route::get('/test', function () {
    return response()->json(['message' => 'API is working']);
});

Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register-client', [AuthController::class, 'registerClient']);

Route::delete('/auth/test-logout', [\App\Http\Controllers\AuthController::class, 'logout']);
>>>>>>> feature/auth
Route::post('/password/forgot', [ForgotPasswordController::class, 'forgot'])->name('password.forgot');
Route::patch('/password/reset/{token}', [ForgotPasswordController::class, 'resetPassword'])->name('password.reset');


<<<<<<< HEAD
// Routes protégées par authentification
Route::middleware('auth:api')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout'])->name('logout');
});
=======
Route::middleware('auth:api')
    ->group(function (){
        Route::delete('/auth/logout',[\App\Http\Controllers\AuthController::class,'logout'])->name('logout');
    });

Route::apiResource('roles', RoleController::class);

Route::apiResource('clients', ClientController::class);
Route::put('/clients/{id}/full-update', [ClientController::class, 'fullUpdate']);
>>>>>>> feature/auth
