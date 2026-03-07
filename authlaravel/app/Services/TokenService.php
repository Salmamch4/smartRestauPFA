<?php
// app/Services/TokenService.php

namespace App\Services;

use Tymon\JWTAuth\Facades\JWTAuth;

class TokenService
{
     public function decodeToken(string $token): array
     {
        if(!$token)
            {
                return $this->response(false,401,'token non fourni');
            }
            $jwt =JWTAuth::setToken($token);
        if(!$jwt->check())
            {
                return $this->response(false,401,'token invalide');
            }
            $payload = $jwt->getPayload();
           
            return $this->response(true,200, 'Token valide',
            [
               'user_id'   => $payload->get('sub'),
            'telephone' => $payload->get('telephone'),
            'email'     => $payload->get('email'),
            'role'      => $payload->get('role'),
            'expires_at'=> date('Y-m-d H:i:s', $payload->get('exp')),
        ]);
     }

     public function response(bool $success, int $status,string $message,array $data=[]):array
     {
        return [
    'success'=> $success,
    'status'=> $status,
    'message'=> $message,
    'data'=>$data
        ];
     }
}