<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use App\Services\register\ClientAuthService;
use App\Services\Login\Contracts\IJwtService;
use App\DTOs\Auth\LoginResponseDTO;
use App\DTOs\Auth\LoginRequestDTO;
use App\DTOs\Auth\RefreshTokenResponseDTO;

class AuthController extends Controller
{
    private IJwtService $jwtService;

    public function __construct(
        private ClientAuthService $service,
        IJwtService $jwtService
    ) {
        $this->jwtService = $jwtService;
    }

  public function registerClient(Request $request)
{
    try {
        $request->validate([
            'nom' => 'required|string|max:255',
            'telephone' => 'required|string|max:20|unique:users,telephone|unique:clients,telephone',
            'email' => 'required|email|unique:users,email|unique:clients,email',
            'password' => 'required|min:6|confirmed',
        ]);

        $res = $this->service->register($request->all());

        $tokens = $this->jwtService->generateTokens((string) $res['user']->id);

        return response()->json([
            'success' => true,
            'message' => 'Client inscrit avec succès',
            'access_token' => $tokens['accessToken'],
            'token_type' => 'bearer',
            'refresh_token' => $tokens['refreshToken'],
            'user' => [
                'id' => $res['user']->id,
                'telephone' => $res['user']->telephone,
                'email' => $res['user']->email,
                'role' => $res['user']->role?->nom ?? 'CLIENT',
                'is_active' => $res['user']->is_active,
            ],
            'client' => [
                'id' => $res['client']->id,
                'nom' => $res['client']->nom,
                'telephone' => $res['client']->telephone,
                'email' => $res['client']->email,
                'points_fidelite' => $res['client']->points_fidelite,
            ],
        ], 201);

    } catch (\Throwable $e) {
        return response()->json([
            'success' => false,
            'error' => $e->getMessage(),
            'line' => $e->getLine(),
            'file' => $e->getFile(),
        ], 500);
    }
}

     public function login(Request $request)
    {
        $request->validate([
            'telephone' => 'required|string',
            'password'  => 'required|string',
        ]);

        $dto = LoginRequestDTO::fromRequest($request);

        $user = User::with('role')->where('telephone', $dto->telephone)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Utilisateur introuvable'
            ], 401);
        }

        if (!Hash::check($dto->password, $user->password)) {
            return response()->json([
                'message' => 'Mot de passe incorrect'
            ], 401);
        }

        if (!$user->is_active) {
            return response()->json([
                'message' => 'Compte désactivé'
            ], 403);
        }

        $tokens = $this->jwtService->generateTokens((string) $user->id);

        $responseDTO = new LoginResponseDTO(
            user: $user,
            token: $tokens['accessToken'],
            refreshToken: $tokens['refreshToken']
        );

        return response()->json($responseDTO->toArray(), 200)
            ->cookie('token', $tokens['accessToken'], 60 * 24, '/', null, false, true, false, 'Lax')
            ->cookie('refresh_token', $tokens['refreshToken'], 60 * 24 * 7, '/', null, false, true, false, 'Lax');
    }

    public function refreshToken(Request $request)
    {
        $refreshToken = $request->input('refresh_token') ?? $request->cookie('refresh_token');

        if (!$refreshToken) {
            return response()->json([
                'message' => 'Refresh token manquant'
            ], 401);
        }

        $userId = $this->jwtService->validateRefreshToken($refreshToken);

        if (!$userId) {
            return response()->json([
                'message' => 'Refresh token invalide ou expiré'
            ], 401);
        }

        $tokens = $this->jwtService->generateTokens($userId);

        $responseDTO = new RefreshTokenResponseDTO(
            token: $tokens['accessToken'],
            refreshToken: $tokens['refreshToken']
        );

        return response()->json($responseDTO->toArray(), 200)
            ->cookie('token', $tokens['accessToken'], 60 * 24, '/', null, false, true, false, 'Lax')
            ->cookie('refresh_token', $tokens['refreshToken'], 60 * 24 * 7, '/', null, false, true, false, 'Lax');
    }

    public function logout(Request $request)
    {
        $refreshToken = $request->cookie('refresh_token') ?? $request->input('refresh_token');

        if ($refreshToken) {
            $this->jwtService->deleteRefreshToken($refreshToken);
        }

        return response()->json([
            'status' => true,
            'message' => 'Logout réussi'
        ])
        ->cookie('token', '', -1)
        ->cookie('refresh_token', '', -1);
    }
}