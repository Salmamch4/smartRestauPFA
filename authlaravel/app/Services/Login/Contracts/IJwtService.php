<?php

namespace App\Services\Login\Contracts;

interface IJwtService
{
    public function generateTokens(string $userId): array;

    public function validateRefreshToken(string $refreshToken): ?string;

    public function deleteRefreshToken(string $refreshToken): void;
}