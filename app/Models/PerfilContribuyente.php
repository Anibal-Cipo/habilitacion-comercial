<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PerfilContribuyente extends Model
{
    use HasFactory;

    protected $table = 'perfiles_contribuyente';

    protected $fillable = [
        'user_id',
        'dni_cuit',
        'apellidos_nombres',
        'domicilio',
        'telefono'
    ];

    // Relaciones
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Métodos helper
    public function perfilCompleto()
    {
        return !empty($this->dni_cuit) && 
               !empty($this->apellidos_nombres) && 
               !empty($this->domicilio) && 
               !empty($this->telefono);
    }
}
