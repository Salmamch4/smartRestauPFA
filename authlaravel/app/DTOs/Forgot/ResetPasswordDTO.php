<?php

namespace App\DTOs\Forgot;
use Illuminate\Http\Request;
class ResetPasswordDTO
{
    public string $password;
    public string $token;

    public function __construct(string $password, string $token)
    {
        $this->password = $password;
        $this->token = $token;
    }

    public static function fromRequest(Request $request, string $token): self
    {
        return new self(
            password: $request->password,
            token: $token
        );
    }

}
