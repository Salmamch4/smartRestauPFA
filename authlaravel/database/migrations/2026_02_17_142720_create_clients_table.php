<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('clients', function (Blueprint $table) {
            $table->id(); // Add primary key
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('nom');
            $table->string('telephone', 10); // Change to 20 to match validation
            $table->string('email')->nullable();
            $table->string('password'); // Add password field
            $table->integer('points_fidelite')->default(0);
            $table->timestamps();
            
            // Add unique constraints
            $table->unique('telephone');
            $table->unique('email');
        });
    }

    public function down(): void {
        Schema::dropIfExists('clients');
    }
};
