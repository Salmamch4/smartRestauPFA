<?php
// app/Mappers/UserMapper.php

namespace App\Mappers;

use App\DTOs\Auth\UserDTO;
use App\Models\User;

class UserMapper
{
    public static function toDTO(User $user): UserDTO
    {
        return UserDTO::fromModel($user);
    }

    public static function toArray(User $user): array
    {
        return [
            'id' => $user->id,
            'telephone' => $user->telephone,
            'email' => $user->email,
            'role_id' => $user->role_id,
            'is_active' => $user->is_active
        ];
    }
}