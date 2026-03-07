<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\Request;

class Handler extends ExceptionHandler
{
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            
        });
    }

    protected function unauthenticated($request, AuthenticationException $exception)
    {
        // للـ API، رجع JSON error
        return response()->json([
            'error' => 'Non authentifié',
            'message' => 'Vous devez être connecté pour accéder à cette ressource'
        ], 401);
    }
}
