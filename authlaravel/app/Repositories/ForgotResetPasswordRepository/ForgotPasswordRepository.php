<?php

namespace App\Repositories\ForgotResetPasswordRepository;
use App\Repositories\ForgotResetPasswordRepository\ForgotPasswordRepositoryInterface;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
class ForgotPasswordRepository implements ForgotPasswordRepositoryInterface
{
    public function emailExists(string $email): bool
    {
        return User::where('email', $email)->exists();
    }

    public function deleteExistingTokens(string $email): void
    {
        DB::table('password_resets')->where('email', $email)->delete();
    }

    public function createToken(string $email, string $token): void
    {
        DB::table('password_resets')->insert([
            'email' => $email,
            'token' => $token,
            'created_at' => now()
        ]);
    }

}
