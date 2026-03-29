<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Facades\JWTAuth;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();

            if (!$user) {
                return response()->json([
                    'message' => 'Utilisateur non authentifié'
                ], 401);
            }

            $userRole = $user->role?->nom;

            if (!in_array($userRole, $roles)) {
                return response()->json([
                    'message' => 'Accès refusé. Rôle non autorisé.'
                ], 403);
            }

            $request->merge(['auth_user' => $user]);

            return $next($request);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Token invalide ou absent'
            ], 401);
        }
    }
}