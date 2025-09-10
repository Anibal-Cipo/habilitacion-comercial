<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Actividad extends Model
{
    use HasFactory;

    protected $table = 'actividades';

    protected $fillable = [
        'cod_actividad',
        'descripcion',
        'activo',
        'requiere_manipulacion_alimentos',
        'requiere_certificado_salud',
        'requiere_autorizacion_salud_publica'
    ];

    protected $casts = [
        'requiere_manipulacion_alimentos' => 'boolean',
        'requiere_certificado_salud' => 'boolean',
        'requiere_autorizacion_salud_publica' => 'boolean',
    ];

    // Relaciones
    public function tramites()
    {
        return $this->hasMany(Tramite::class);
    }

    // Scopes
    public function scopeActivas($query)
    {
        return $query->where('activo', 'S');
    }

    // Métodos helper
    public function requiereDocumentacionEspecial()
    {
        return $this->requiere_manipulacion_alimentos ||
            $this->requiere_certificado_salud ||
            $this->requiere_autorizacion_salud_publica;
    }
}
