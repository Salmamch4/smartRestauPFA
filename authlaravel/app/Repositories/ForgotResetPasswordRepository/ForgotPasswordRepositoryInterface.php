<?php

namespace App\Repositories\ForgotResetPasswordRepository;

interface ForgotPasswordRepositoryInterface
{
    public function emailExists(string $email): bool;
    public function deleteExistingTokens(string $email): void;
    public function createToken(string $email, string $token): void;

}
