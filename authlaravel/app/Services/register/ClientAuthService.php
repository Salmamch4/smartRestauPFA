<?php

namespace App\Services\register;

use App\Models\User;
use App\Models\Client;
use App\Models\Role;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class ClientAuthService
{
    public function register(array $data): array
    {
        return DB::transaction(function () use ($data) {

            $clientRole = Role::where('nom', 'CLIENT')->first();

            if (!$clientRole) {
                throw new \Exception('Role CLIENT introuvable');
            }

            $user = User::create([
                'telephone' => $data['telephone'],
                'email' => $data['email'], // ← ADD THIS LINE
                'password' => Hash::make($data['password']),
                'role_id' => $clientRole->id,
                'is_active' => true,
            ]);

            $client = Client::create([
                'user_id' => $user->id,
                'nom' => $data['nom'],
                'telephone' => $data['telephone'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'points_fidelite' => 0,
            ]);

            return [
                'user' => $user->load('role'),
                'client' => $client,
            ];
        });
    }
}