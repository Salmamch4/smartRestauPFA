<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

class UsersTableSeeder extends Seeder
{
    public function run()
    {
        $adminRole   = Role::where('nom', 'ADMIN')->first();
        $serveurRole = Role::where('nom', 'SERVEUR')->first();
        $chefRole    = Role::where('nom', 'CHEF_CUISINE')->first();

        User::create([
            'name' => 'Admin',
            'telephone' => '0612345678',
            'email' => 'admin@example.com',
            'password' => Hash::make('password123'),
            'role_id' => $adminRole->id,
            'is_active' => true
        ]);

        User::create([
            'name' => 'Serveur',
            'telephone' => '0687654321',
            'email' => 'serveur@example.com',
            'password' => Hash::make('password123'),
            'role_id' => $serveurRole->id,
            'is_active' => true
        ]);

        User::create([
            'name' => 'Chef',
            'telephone' => '0611223344',
            'email' => 'chef@example.com',
            'password' => Hash::make('password123'),
            'role_id' => $chefRole->id,
            'is_active' => false
        ]);

        User::create([
            'name' => 'Zineb',
            'telephone' => '0612345602',
            'email' => 'zineb.taibe@outlook.com',
            'password' => Hash::make('zineb123'),
            'role_id' => $adminRole->id,
            'is_active' => true
        ]);
    }
}