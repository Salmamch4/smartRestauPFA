<?php

namespace App\Services\Login;

use App\Models\User;
use App\Models\RefreshToken;
use App\Services\Login\Contracts\IJwtService;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Str;
use Carbon\Carbon;

class JwtService implements IJwtService
{
    public function generateTokens(string $userId): array
    {
        $user = User::findOrFail($userId);

        // Access Token
        $accessToken = JWTAuth::fromUser($user);

        // Refresh Token
        $refreshToken = Str::uuid()->toString();

        // نحيدو القديم ديال هاد user
        RefreshToken::where('user_id', $user->id)->delete();

        // نخزنو الجديد
        RefreshToken::create([
            'user_id' => $user->id,
            'refresh_token' => $refreshToken,
            'expires_at' => Carbon::now()->addDays(7),
        ]);

        return [
            'accessToken' => $accessToken,
            'refreshToken' => $refreshToken,
        ];
    }

    public function validateRefreshToken(string $refreshToken): ?string
    {
        $token = RefreshToken::where('refresh_token', $refreshToken)
            ->where('expires_at', '>', now())
            ->first();

        if (!$token) {
            return null;
        }

        return (string) $token->user_id;
    }

    public function deleteRefreshToken(string $refreshToken): void
    {
        RefreshToken::where('refresh_token', $refreshToken)->delete();
    }
}