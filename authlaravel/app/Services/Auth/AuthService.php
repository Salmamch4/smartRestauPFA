<?php

namespace App\Services;

use App\DTOs\Auth\LoginResponseDTO;
use App\DTOs\Auth\LoginRequestDTO;
use App\Repositories\Auth\UserRepositoryInterface;
use Illuminate\Support\Facades\Hash;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

class AuthService
{
    protected UserRepositoryInterface $userRepository;

    public function __construct(UserRepositoryInterface $userRepository)
    {
        $this->userRepository = $userRepository;
    }

   public function authenticate(LoginRequestDTO $loginDTO): ?LoginResponseDTO
    {
        $user = $this->userRepository->findByTelephone($loginDTO->telephone);
        
        if (!$user) {
            return null;
        }

        if (!Hash::check($loginDTO->password, $user->password)) {
            return null;
        }

        if (!$user->is_active) {
            return null;
        }

        $token = JWTAuth::fromUser($user);

        return new LoginResponseDTO($token, $user, config('jwt.ttl', 60));
    }
    public function validateToken(string $token): ?array
    {
        try {
            $payload = JWTAuth::setToken($token)->getPayload();
            
            return [
                'valid' => true,
                'user_id' => $payload['user_id'],
                'telephone' => $payload['telephone'],
                'email' => $payload['email'],
                'role_id' => $payload['role_id'],
                'expires_at' => date('Y-m-d H:i:s', $payload['exp']),
                'issued_at' => date('Y-m-d H:i:s', $payload['iat'])
            ];
        } catch (\Exception $e) {
            return null;
        }
    }

   
}