<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ForgotPasswordController;

//Route::post('/password/forgot', [ForgotPasswordController::class, 'forgot']);
Route::post('/auth/login', [AuthController::class, 'login']);
//Route::match(['get', 'post'], '/password/reset/{token}', [ForgotPasswordController::class, 'resetPassword']);

Route::middleware('auth:api')->group(function () {

    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::post('/auth/refresh', [AuthController::class, 'refresh']);
    Route::get('/auth/me', [AuthController::class, 'me']);

});

