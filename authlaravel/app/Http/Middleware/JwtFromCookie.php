<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class JwtFromCookie
{
    public function handle(Request $request, Closure $next)
    {
        // Récupérer le token depuis le cookie
        $token = $request->cookie('jwt_token');
        
        if ($token) {
            // Ajouter le token dans le header Authorization
            $request->headers->set('Authorization', 'Bearer ' . $token);
        }

        return $next($request);
    }
}