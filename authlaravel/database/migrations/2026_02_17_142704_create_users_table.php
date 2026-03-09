<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
         Schema::table('users', function (Blueprint $table) {
        $table->string('role')->default('client'); // Ajoute la colonne role
    });
        Schema::create('users', function (Blueprint $table) {
            $table->id();

            $table->string('name');
            $table->string('telephone', 20)->unique();
            $table->string('email')->unique();
            $table->string('password');

            $table->foreignId('role_id')->constrained('roles');
            $table->boolean('is_active')->default(true);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};




