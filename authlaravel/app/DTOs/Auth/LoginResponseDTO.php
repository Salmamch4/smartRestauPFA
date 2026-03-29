<?php

namespace App\DTOs\Auth;

use App\Models\User;

class LoginResponseDTO
{
    public string $accessToken;
    public string $refreshToken;
    public array $user;

    public function __construct(User $user, string $token, string $refreshToken)
    {
        $this->accessToken = $token;
        $this->refreshToken = $refreshToken;
        $this->user = $this->mapUserToArray($user);
    }

    private function mapUserToArray(User $user): array
    {
        return [
            'id' => $user->id,
            'telephone' => $user->telephone,
            'role_id' => $user->role_id,
            'role' => $user->role?->nom,
            'is_active' => $user->is_active
        ];
    }

    public function toArray(): array
    {
        return [
            'access_token' => $this->accessToken,
            'refresh_token' => $this->refreshToken,
            'user' => $this->user
        ];
    }
}