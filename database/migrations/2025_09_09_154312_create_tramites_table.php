<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('tramites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('razon_social');
            $table->string('dni_cuit', 20);
            $table->unsignedBigInteger('actividad_id'); // Sin foreign key por ahora
            $table->enum('estado', [
                'iniciado', 'en_revision', 'documentacion_solicitada',
                'documentacion_completa', 'observado', 'aprobado_inspeccion',
                'inspeccionado_ok', 'habilitado', 'rechazado'
            ])->default('iniciado');
            $table->string('nro_acta', 50)->nullable();
            $table->string('comprobante_pago')->nullable();
            $table->date('fecha_pago')->nullable();
            $table->text('observaciones')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('tramites');
    }
};