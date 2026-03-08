<?php

namespace App\DTOs\Forgot;
use Illuminate\Http\Request;

class ResetPasswordDTO
{
    public function __construct(
        public readonly string $password,
        public readonly string $token
    ) {}

    public static function fromRequest(Request $request, string $token): self
    {
        return new self(
            password: $request->password,
            token: $token
        );
    }

}
 