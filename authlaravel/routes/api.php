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

Route::delete('/auth/test-logout', [\App\Http\Controllers\AuthController::class, 'logout']);
Route::post('/password/forgot', [ForgotPasswordController::class, 'forgot'])->name('password.forgot');
Route::patch('/password/reset/{token}', [ForgotPasswordController::class, 'resetPassword'])->name('password.reset');


Route::middleware('auth:api')
    ->group(function (){
        Route::delete('/auth/logout',[\App\Http\Controllers\AuthController::class,'logout'])->name('logout');
    });

Route::apiResource('roles', RoleController::class);

Route::apiResource('clients', ClientController::class);
Route::put('/clients/{id}/full-update', [ClientController::class, 'fullUpdate']);
