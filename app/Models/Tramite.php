<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tramite extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'razon_social',
        'dni_cuit',
        'actividad_id',
        'estado',
        'nro_acta',
        'comprobante_pago',
        'fecha_pago',
        'observaciones'
    ];

    protected $casts = [
        'fecha_pago' => 'date',
    ];

    // Estados disponibles
    const ESTADOS = [
        'iniciado' => 'Iniciado',
        'en_revision' => 'En Revisión',
        'documentacion_solicitada' => 'Documentación Solicitada',
        'documentacion_completa' => 'Documentación Completa',
        'observado' => 'Observado',
        'aprobado_inspeccion' => 'Aprobado para Inspección',
        'inspeccionado_ok' => 'Inspección Aprobada',
        'habilitado' => 'Habilitado',
        'rechazado' => 'Rechazado'
    ];

    // Relaciones
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function actividad()
    {
        return $this->belongsTo(Actividad::class);
    }

    public function documentos()
    {
        return $this->hasMany(Documento::class);
    }

    public function fotos()
    {
        return $this->hasMany(FotoTramite::class);
    }

    public function historial()
    {
        return $this->hasMany(HistorialTramite::class)->orderBy('created_at', 'desc');
    }

    // Scopes
    public function scopePorEstado($query, $estado)
    {
        return $query->where('estado', $estado);
    }

    public function scopePendientesRevision($query)
    {
        return $query->whereIn('estado', ['iniciado', 'documentacion_completa']);
    }

    public function scopeListosInspeccion($query)
    {
        return $query->where('estado', 'aprobado_inspeccion');
    }

    // Métodos helper
    public function getEstadoTexto()
    {
        return self::ESTADOS[$this->estado] ?? $this->estado;
    }

    public function puedeSubirDocumentos()
    {
        return in_array($this->estado, ['documentacion_solicitada', 'observado']);
    }

    public function porcentajeCompletado()
    {
        $estados_ordenados = array_keys(self::ESTADOS);
        $posicion_actual = array_search($this->estado, $estados_ordenados);
        
        if ($this->estado === 'rechazado') return 0;
        if ($this->estado === 'habilitado') return 100;
        
        return round(($posicion_actual / (count($estados_ordenados) - 2)) * 100);
    }

    public function cambiarEstado($nuevo_estado, $observaciones = null, $user_id = null)
    {
        $estado_anterior = $this->estado;
        $this->estado = $nuevo_estado;
        
        if ($observaciones) {
            $this->observaciones = $observaciones;
        }
        
        $this->save();

        // Registrar en historial
        $this->historial()->create([
            'user_id' => $user_id ?? auth()->id(),
            'accion' => "Cambio de estado: {$estado_anterior} → {$nuevo_estado}",
            'descripcion' => $observaciones,
            'datos_anteriores' => ['estado' => $estado_anterior],
            'datos_nuevos' => ['estado' => $nuevo_estado]
        ]);

        return $this;
    }
}

