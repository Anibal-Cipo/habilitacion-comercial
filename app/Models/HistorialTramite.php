<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HistorialTramite extends Model
{
    use HasFactory;

    protected $table = 'historial_tramites';

    protected $fillable = [
        'tramite_id',
        'user_id',
        'accion',
        'descripcion',
        'datos_anteriores',
        'datos_nuevos'
    ];

    protected $casts = [
        'datos_anteriores' => 'array',
        'datos_nuevos' => 'array',
    ];

    // Relaciones
    public function tramite()
    {
        return $this->belongsTo(Tramite::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
