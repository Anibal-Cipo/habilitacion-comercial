<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Documento extends Model
{
    use HasFactory;

    protected $fillable = [
        'tramite_id',
        'tipo_documento',
        'archivo_path',
        'obligatorio',
        'presentado',
        'verificado',
        'solo_inspeccion',
        'observaciones',
        'fecha_verificacion',
        'verificado_por'
    ];

    protected $casts = [
        'obligatorio' => 'boolean',
        'presentado' => 'boolean',
        'verificado' => 'boolean',
        'solo_inspeccion' => 'boolean',
        'fecha_verificacion' => 'datetime',
    ];

    // Tipos de documentos
    const TIPOS = [
        'inscripcion_arca' => 'Inscripción en ARCA',
        'inscripcion_rentas' => 'Inscripción en Rentas',
        'contrato_locacion' => 'Contrato de Locación/Comodato/Título Propiedad',
        'seguro_responsabilidad' => 'Seguro de Responsabilidad Civil',
        'libro_actas' => 'Libro de Actas (Solo Inspección)',
        'memoria_tecnica_incendio' => 'Memoria Técnica Prevención Incendios',
        'aprobado_bomberos' => 'Aprobado Definitivo de Bomberos',
        'elementos_seguridad' => 'Elementos de Seguridad (Solo Inspección)',
        'cartel_salida' => 'Cartel Salida y Luz Emergencia (Solo Inspección)',
        'certificado_manipulacion' => 'Certificado Manipulación Alimentos',
        'certificado_salud' => 'Certificado de Buena Salud',
        'convenio_area_protegida' => 'Convenio Área Protegida',
        'certificado_cocaprhi' => 'Certificado COCAPRHI',
        'certificado_profesional' => 'Certificado Profesional/Título Habilitante',
        'autorizacion_salud_publica' => 'Autorización Salud Pública',
        'registro_martillero' => 'Certificado Registro Martillero (Inmobiliaria)',
        'registro_seguros' => 'Certificado Superintendencia Seguros'
    ];

    // Relaciones
    public function tramite()
    {
        return $this->belongsTo(Tramite::class);
    }

    public function verificadoPor()
    {
        return $this->belongsTo(User::class, 'verificado_por');
    }

    // Métodos helper
    public function getTipoTexto()
    {
        return self::TIPOS[$this->tipo_documento] ?? $this->tipo_documento;
    }

    public function getUrlArchivo()
    {
        if (!$this->archivo_path) return null;
        return asset('storage/documentos/' . $this->archivo_path);
    }
}
