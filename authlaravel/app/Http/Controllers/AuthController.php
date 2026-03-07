<?php

namespace App\Http\Controllers;

use App\DTOs\Auth\LoginRequestDTO;
use App\Services\AuthService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    protected AuthService $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function login(Request $request): JsonResponse
    {
        
        $validator = validator($request->all(), [
            'telephone' => 'required|string',
            'password' => 'required|string|min:6'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $validator->errors()
            ], 422);
        }

     
        $loginDTO = LoginRequestDTO::fromRequest($request);

       
        $authResponse = $this->authService->authenticate($loginDTO);

        if (!$authResponse) {
            return response()->json([
                'success' => false,
                'message' => 'Téléphone ou mot de passe incorrect'
            ], 401);
        }

        // Création du cookie
        $cookie = cookie(
            'jwt_token',
            $authResponse->token,
            $authResponse->expiresIn / 60,
            '/',
            null,
            true,
            true,
            false,
            'Strict'
        );

        return response()->json([
            'success' => true,
            'message' => 'Connexion réussie',
            'data' => [
                'user' => $authResponse->user,
                'expires_in' => $authResponse->expiresIn
            ]
        ], 200)->withCookie($cookie);
    }

    public function decryptToken(Request $request): JsonResponse
    {
        $token = $request->cookie('jwt_token');

        if (!$token) {
            return response()->json([
                'success' => false,
                'message' => 'Token non trouvé dans le cookie'
            ], 401);
        }

        $decoded = $this->authService->validateToken($token);

        if (!$decoded) {
            return response()->json([
                'success' => false,
                'message' => 'Token invalide ou expiré'
            ], 401);
        }

        return response()->json([
            'success' => true,
            'data' => $decoded
        ], 200);
    }

    public function me(Request $request): JsonResponse
    {
        $user = auth()->user();
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Non authentifié'
            ], 401);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $user->id,
                'telephone' => $user->telephone,
                'email' => $user->email,
                'role_id' => $user->role_id,
                'is_active' => $user->is_active
            ]
        ], 200);
    }


    public function refresh(Request $request): JsonResponse
    {
        $token = $request->cookie('jwt_token');

        if (!$token) {
            return response()->json([
                'success' => false,
                'message' => 'Token non trouvé'
            ], 401);
        }

        try {
            $newToken = JWTAuth::setToken($token)->refresh();
            
            $cookie = cookie(
                'jwt_token',
                $newToken,
                config('jwt.ttl'),
                '/',
                null,
                true,
                true,
                false,
                'Strict'
            );

            return response()->json([
                'success' => true,
                'message' => 'Token rafraîchi avec succès'
            ], 200)->withCookie($cookie);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de rafraîchir le token'
            ], 401);
        }
    }
}