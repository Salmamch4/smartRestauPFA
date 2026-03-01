<?php

namespace App\DTOs\Forgot;
use Illuminate\Http\Request;

class ForgotPasswordDTO
{
    public string $email;

    public function __construct(string $email)
    {
        $this->email = $email;
    }

    public static function fromRequest(Request $request): self
    {
        return new self(
            email: $request->email
        );
    }


}
