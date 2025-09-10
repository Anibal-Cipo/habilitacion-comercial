<?php

namespace App\Policies;

use App\Models\Tramite;
use App\Models\User;

class TramitePolicy
{
    public function view(User $user, Tramite $tramite)
    {
        // Contribuyentes solo pueden ver sus propios trámites
        if ($user->esContribuyente()) {
            return $user->id === $tramite->user_id;
        }

        // Municipio puede ver todos
        if ($user->esMunicipio()) {
            return true;
        }

        return false;
    }

    public function update(User $user, Tramite $tramite)
    {
        // Solo el contribuyente propietario puede actualizar
        if ($user->esContribuyente()) {
            return $user->id === $tramite->user_id && $tramite->puedeSubirDocumentos();
        }

        return false;
    }

    public function manage(User $user, Tramite $tramite)
    {
        // Solo municipio puede gestionar trámites
        return $user->esMunicipio();
    }
}
