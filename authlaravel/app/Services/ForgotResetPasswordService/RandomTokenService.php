<?php

namespace App\Services\ForgotResetPasswordService;
use Illuminate\Support\Str;
class RandomTokenService implements TokenGeneratorInterface
{
    public function generate(): string
    {
        return Str::random(32);
    }

}
