<?php

namespace App\DTOs\Auth;

use Illuminate\Http\Request;

class LoginRequestDTO
{
    public string $telephone;
    public string $password;

    public function __construct(string $telephone, string $password)
    {
        $this->telephone = $telephone;
        $this->password = $password;
    }

    public static function fromRequest(Request $request): self
    {
        return new self(
            telephone: $request->input('telephone'), 
            password: $request->input('password')
        );
    }
}