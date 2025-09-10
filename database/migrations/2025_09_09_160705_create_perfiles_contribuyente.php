<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('perfiles_contribuyente', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('dni_cuit', 20)->nullable();
            $table->string('apellidos_nombres')->nullable();
            $table->text('domicilio')->nullable();
            $table->string('telefono', 20)->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('perfiles_contribuyente');
    }
};