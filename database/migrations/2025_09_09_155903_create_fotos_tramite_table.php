<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('fotos_tramite', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tramite_id')->constrained()->onDelete('cascade');
            $table->enum('tipo_foto', ['dni_frente', 'dni_dorso', 'local_interior', 'local_exterior', 'boleta_municipal']);
            $table->string('archivo_path');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('fotos_tramite');
    }
};