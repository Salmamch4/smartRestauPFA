<?php

namespace App\Services\ForgotResetPasswordService;

interface SendMailInterface
{
    public function sendPasswordResetLink(string $email, string $token): void;
}
