<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration

{
    public function up()
    {
        Schema::create('documentos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tramite_id')->constrained()->onDelete('cascade');
            $table->string('tipo_documento');
            $table->string('archivo_path')->nullable();
            $table->boolean('obligatorio')->default(true);
            $table->boolean('presentado')->default(false);
            $table->boolean('verificado')->default(false);
            $table->boolean('solo_inspeccion')->default(false); // para docs que solo se verifican en inspección
            $table->text('observaciones')->nullable();
            $table->timestamp('fecha_verificacion')->nullable();
            $table->foreignId('verificado_por')->nullable()->constrained('users');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('documentos');
    }
};
