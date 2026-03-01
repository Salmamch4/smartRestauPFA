<?php

namespace App\Services\ForgotResetPasswordService;

interface TokenGeneratorInterface
{
    public function generate(): string;
}
