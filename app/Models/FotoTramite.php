<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FotoTramite extends Model
{
    use HasFactory;

    protected $table = 'fotos_tramite';

    protected $fillable = [
        'tramite_id',
        'tipo_foto',
        'archivo_path'
    ];

    const TIPOS_FOTO = [
        'dni_frente' => 'DNI Frente',
        'dni_dorso' => 'DNI Dorso',
        'local_interior' => 'Foto Local Interior',
        'local_exterior' => 'Foto Local Exterior',
        'boleta_municipal' => 'Boleta Tasa Municipal'
    ];

    // Relaciones
    public function tramite()
    {
        return $this->belongsTo(Tramite::class);
    }

    // Métodos helper
    public function getTipoTexto()
    {
        return self::TIPOS_FOTO[$this->tipo_foto] ?? $this->tipo_foto;
    }

    public function getUrlFoto()
    {
        return asset('storage/fotos_tramite/' . $this->archivo_path);
    }
}
