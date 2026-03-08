<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;

class RolesTableSeeder extends Seeder
{
    public function run()
    {
        Role::updateOrCreate(['nom' => 'CLIENT'], ['nom' => 'CLIENT']);
        Role::updateOrCreate(['nom' => 'ADMIN'],  ['nom' => 'ADMIN']);
        Role::updateOrCreate(['nom' => 'SERVEUR'],['nom' => 'SERVEUR']);
        Role::updateOrCreate(['nom' => 'CHEF_CUISINE'], ['nom' => 'CHEF_CUISINE']);
    }
}