<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('actividades', function (Blueprint $table) {
            $table->id();
            $table->integer('cod_actividad')->unique();
            $table->string('descripcion');
            $table->char('activo', 1)->default('S');
            $table->boolean('requiere_manipulacion_alimentos')->default(false);
            $table->boolean('requiere_certificado_salud')->default(false);
            $table->boolean('requiere_autorizacion_salud_publica')->default(false);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('actividades');
    }
};
