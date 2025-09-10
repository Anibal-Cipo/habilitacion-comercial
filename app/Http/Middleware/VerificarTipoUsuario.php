<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VerificarTipoUsuario
{
    public function handle(Request $request, Closure $next, $tipo = null): Response
    {
        if (!auth()->check()) {
            return redirect()->route('login');
        }

        $user = auth()->user();

        // Verificar si el usuario está activo
        if (!$user->activo) {
            auth()->logout();
            return redirect()->route('login')->with('error', 'Tu cuenta está desactivada. Contacta al municipio.');
        }

        // Verificar tipo de usuario si se especifica
        if ($tipo && $user->tipo_usuario !== $tipo) {
            abort(403, 'No tienes permisos para acceder a esta sección.');
        }

        return $next($request);
    }
}
