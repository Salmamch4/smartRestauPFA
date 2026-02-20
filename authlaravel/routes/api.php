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

Route::get('/test', function() {
    return response()->json(['message' => 'API is working']);
});

// Make sure this line is present and NOT commented out
Route::post('/auth/login', [AuthController::class, 'login']);
Route::get('/create-test-user', function() {
    $user = \App\Models\User::create([
        'telephone' => '0606060606',
        'password' => Hash::make('123456'),
        'name' => 'Test User',
        'role_id' => 1 // ou l'ID de rôle qui existe
    ]);
    
    return response()->json([
        'message' => 'User created',
        'user' => $user
    ]);
});