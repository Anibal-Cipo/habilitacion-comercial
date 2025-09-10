<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('historial_tramites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tramite_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained();
            $table->string('accion');
            $table->text('descripcion')->nullable();
            $table->json('datos_anteriores')->nullable();
            $table->json('datos_nuevos')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('historial_tramites');
    }
};