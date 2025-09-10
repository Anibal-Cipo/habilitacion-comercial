<?php

namespace App\Http\Controllers;

use App\Models\Actividad;
use Illuminate\Http\Request;

class ActividadController extends Controller
{
    public function index()
    {
        return Actividad::activas()->orderBy('descripcion')->get();
    }

    public function show(Actividad $actividad)
    {
        return $actividad;
    }

    // Sincronizar desde Oracle (comando que ejecutaremos después)
    public function sincronizarDesdeOracle()
    {
        // TODO: Implementar sincronización con Oracle
        // Este método lo implementaremos cuando conectemos con Oracle
    }
}