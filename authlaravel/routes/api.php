<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ForgotPasswordController;
use Illuminate\Support\Facades\Hash;

Route::get('/test', function() {
    return response()->json(['message' => 'API is working']);
});

// Make sure this line is present and NOT commented out
Route::post('/auth/login', [AuthController::class, 'login']);
Route::get('/create-test-user', function() {
    $user = \App\Models\User::create([
        'telephone' => '0909090911',
        'email' => 'newuser4@example.com',
        'password' => Hash::make('mypassword'),
        'name' => 'Test User',
        'role_id' => 1
    ]);

    return response()->json([
        'message' => 'User created',
        'user' => $user
    ]);
});

Route::post('/auth/test-logout', [\App\Http\Controllers\AuthController::class, 'logout']);
Route::post('/password/forgot', [ForgotPasswordController::class, 'forgot'])->name('password.forgot');
Route::post('/password/reset/{token}', [ForgotPasswordController::class, 'resetPassword'])->name('password.reset');

Route::middleware('auth:api')
    ->group(function (){
        Route::post('/auth/logout',[\App\Http\Controllers\AuthController::class,'logout'])->name('logout');
    });
use App\Http\Controllers\RoleController;
use App\Http\Controllers\ProfileController;

Route::apiResource('roles', RoleController::class);

use App\Http\Controllers\ClientController;
Route::apiResource('clients', ClientController::class);
Route::put('/clients/{id}/full-update', [ClientController::class, 'fullUpdate']);