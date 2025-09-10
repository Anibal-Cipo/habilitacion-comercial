<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'tipo_usuario',
        'activo'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'activo' => 'boolean',
        ];
    }

    // Agregar al final de la clase User, antes del último }
    public function tramites()
    {
        return $this->hasMany(Tramite::class);
    }

    public function perfilContribuyente()
    {
        return $this->hasOne(PerfilContribuyente::class);
    }
    // Métodos helper
    public function esContribuyente()
    {
        return $this->tipo_usuario === 'contribuyente';
    }

    public function esMunicipio()
    {
        return $this->tipo_usuario === 'municipio';
    }

    // Scopes
    public function scopeContribuyentes($query)
    {
        return $query->where('tipo_usuario', 'contribuyente');
    }

    public function scopeMunicipio($query)
    {
        return $query->where('tipo_usuario', 'municipio');
    }
}
