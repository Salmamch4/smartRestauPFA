<?php

namespace App\Services;

use App\Models\Client;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;

class ClientAuthService
{
    public function register(array $data): array
    {
        return DB::transaction(function () use ($data) {

            $clientRole = DB::table('roles')->where('nom', 'CLIENT')->first();
            if (!$clientRole) {
                throw new \RuntimeException("Role CLIENT introuvable");
            }

            $hashed = Hash::make($data['password']);

            // 1) create user (FULL info)
            $user = User::create([
                'name'      => $data['nom'],
                'telephone' => $data['telephone'],
                'email'     => $data['email'],
                'password'  => $hashed,
                'role_id'   => $clientRole->id,
                'is_active' => true,
            ]);

            // 2) create client (FULL info)
            $client = Client::create([
                'user_id'         => $user->id,
                'nom'             => $data['nom'],
                'telephone'       => $data['telephone'],
                'email'           => $data['email'],
                'password'        => $hashed,
                'points_fidelite' => 0,
            ]);

            // 3) token
            $token = JWTAuth::fromUser($user);

            return compact('user', 'client', 'token');
        });
    }

    public function login(string $telephone, string $password): array
    {
        $user = User::where('telephone', $telephone)->first();

        if (!$user || !Hash::check($password, $user->password)) {
            throw new \RuntimeException("les identifiants sont incorrectes.");
        }

        if (!$user->is_active) {
            throw new \RuntimeException("Compte désactivé.");
        }

        $client = $user->client; 
        $token = JWTAuth::fromUser($user);

        return compact('user', 'client', 'token');
    }
}