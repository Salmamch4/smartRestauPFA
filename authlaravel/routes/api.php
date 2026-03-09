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
// api.php - Tout en haut après les 'use'
Route::delete('admin/destroy-client/{id}', [App\Http\Controllers\AdminController::class, 'deleteClient']);
// --- Test de l'API ---
Route::get('/test', function () {
    return response()->json(['message' => 'API is working properly']);
});

// --- Authentification & Inscription ---
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register-client', [AuthController::class, 'registerClient']);
    
    Route::middleware('auth:api')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/refresh', [AuthController::class, 'refresh']);
        Route::get('/me', [AuthController::class, 'me']);
    });
});


// --- Mot de passe oublié ---
=======
Route::delete('/auth/test-logout', [\App\Http\Controllers\AuthController::class, 'logout']);

Route::post('/password/forgot', [ForgotPasswordController::class, 'forgot'])->name('password.forgot');
Route::patch('/password/reset/{token}', [ForgotPasswordController::class, 'resetPassword'])->name('password.reset');

// --- Espace Administrateur (Gestion & Stats) ---
Route::prefix('admin')->group(function () {
    Route::delete('clients/{id}', [AdminController::class, 'deleteClient']);
    // 1. Statistiques du tableau de bord
    Route::get('/stats', [AdminController::class, 'getStats']);
    
    // 2. Gestion des Clients
    
    Route::get('/clients', [AdminController::class, 'getClients']); // Liste globale pour Farah
    Route::post('/clients/{id}/toggle', [AdminController::class, 'toggleClientStatus']); // Activer/Désactiver
    // 3. Gestion des employés
    Route::get('/employees', [AdminController::class, 'getEmployees']); 
    Route::post('/employees', [AdminController::class, 'storeEmployee']); 
    Route::put('/employees/{id}', [AdminController::class, 'updateEmployee']); 
    Route::delete('/employees/{id}', [AdminController::class, 'deleteEmployee']); 
    
    
});


Route::middleware('auth:api')
    ->group(function (){
        Route::delete('/auth/logout',[\App\Http\Controllers\AuthController::class,'logout'])->name('logout');
    });


// --- Ressources CRUD standards (Hors Admin) ---
Route::apiResource('roles', RoleController::class);
Route::apiResource('clients', ClientController::class);

// Mise à jour complète d'un client
Route::put('/clients/{id}/full-update', [ClientController::class, 'fullUpdate']);