<?php

namespace App\Repositories\ForgotResetPasswordRepository;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class ResetPasswordRepository implements ResetPasswordRepositoryInterface
{
    public function findByToken(string $token): ?object
    {
        return DB::table('password_resets')->where('token', $token)->first();
    }

    public function isTokenExpired(object $passwordReset): bool
    {
        return now()->diffInHours($passwordReset->created_at) > 1;
    }

    public function findUserByEmail(string $email): ?object
    {
        return User::where('email', $email)->first();
    }

    public function updateUserPassword(object $user, string $password): void
    {
        $user->password = Hash::make($password);
        $user->save();
    }

    public function deleteToken(string $token): void
    {
        DB::table('password_resets')->where('token', $token)->delete();
    }

}
