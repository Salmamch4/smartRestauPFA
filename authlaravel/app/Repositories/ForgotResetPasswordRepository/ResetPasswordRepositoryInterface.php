<?php

namespace App\Repositories\ForgotResetPasswordRepository;

interface ResetPasswordRepositoryInterface
{
    public function findByToken(string $token): ?object;
    public function isTokenExpired(object $passwordReset): bool;
    public function findUserByEmail(string $email): ?object;
    public function updateUserPassword(object $user, string $password): void;
    public function deleteToken(string $token): void;

}
