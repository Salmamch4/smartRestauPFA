<?php 
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->timestamps();
        });

        // Seed initial roles
        DB::table('roles')->insert([
            ['name' => 'CLIENT'],
            ['name' => 'ADMIN'],
            ['name' => 'SERVEUR'],
            ['name' => 'CHEF_CUISINE'],
        ]);
    }

    public function down(): void {
        Schema::dropIfExists('roles');
    }
};
