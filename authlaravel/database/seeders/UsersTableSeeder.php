<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UsersTableSeeder extends Seeder
{
    public function run()
    {
        User::create([
            'telephone' => '0612345678',
            'email' => 'user1@example.com',
            'password' => Hash::make('password123'),
            'role_id' => 1,
            'is_active' => true
        ]);

        User::create([
            'telephone' => '0687654321',
            'email' => 'user2@example.com',
            'password' => Hash::make('password123'),
            'role_id' => 2,
            'is_active' => true
        ]);

        User::create([
            'telephone' => '0611223344',
            'email' => 'user3@example.com',
            'password' => Hash::make('password123'),
            'role_id' => 3,
            'is_active' => false // مستخدم غير نشط
        ]);
    }
}
