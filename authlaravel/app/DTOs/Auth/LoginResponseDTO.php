<?php
// app/DTOs/Auth/LoginResponseDTO.php

namespace App\DTOs\Auth;

use App\Models\User;

class LoginResponseDTO
{
    public string $token;
    public string $tokenType;
    public int $expiresIn;
    public array $user;

    public function __construct(string $token, User $user, int $ttl)
    {
        $this->token = $token;
        $this->tokenType = 'bearer';
        $this->expiresIn = $ttl * 60;
        $this->user = $this->mapUserToArray($user);
    }

    private function mapUserToArray(User $user): array
    {
        return [
            'id' => $user->id,
            'telephone' => $user->telephone,
            'email' => $user->email,
            'role_id' => $user->role_id,
            'is_active' => $user->is_active
        ];
    }

    public function toArray(): array
    {
        return [
            'access_token' => $this->token,
            'token_type' => $this->tokenType,
            'expires_in' => $this->expiresIn,
            'user' => $this->user
        ];
    }
}