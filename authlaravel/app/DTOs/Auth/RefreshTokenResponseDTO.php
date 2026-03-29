<?php

namespace App\DTOs\Auth;

class RefreshTokenResponseDTO
{
    public string $accessToken;
    public string $refreshToken;

    public function __construct(string $token, string $refreshToken)
    {
        $this->accessToken = $token;
        $this->refreshToken = $refreshToken;
    }

    public function toArray(): array
    {
        return [
            'access_token' => $this->accessToken,
            'refresh_token' => $this->refreshToken,
        ];
    }
}