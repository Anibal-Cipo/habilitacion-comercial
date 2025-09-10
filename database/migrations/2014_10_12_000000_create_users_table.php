<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {

        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->enum('tipo_usuario', ['contribuyente', 'municipio'])->default('contribuyente');
            $table->rememberToken();
            $table->timestamps();
        });

        // Perfil del contribuyente
        Schema::create('perfiles_contribuyente', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('dni_cuit', 20)->nullable();
            $table->string('apellidos_nombres')->nullable();
            $table->string('domicilio')->nullable();
            $table->string('telefono')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
