<?php

namespace App\Http\Controllers;

use App\Models\Tramite;
use App\Models\Actividad;
use App\Models\Documento;
use App\Models\FotoTramite;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class TramiteController extends Controller
{
    // Dashboard para Contribuyentes
    public function dashboardContribuyente()
    {
        $user = auth()->user();
        $tramites = $user->tramites()->with(['actividad', 'historial.user'])->latest()->get();

        return Inertia::render('Contribuyente/Dashboard', [
            'tramites' => $tramites,
            'usuario' => $user,
            'perfil' => $user->perfilContribuyente
        ]);
    }

    // Dashboard para Municipio
    public function dashboardMunicipio()
    {
        $estadisticas = [
            'pendientes_revision' => Tramite::pendientesRevision()->count(),
            'listos_inspeccion' => Tramite::listosInspeccion()->count(),
            'habilitados_mes' => Tramite::where('estado', 'habilitado')
                ->whereMonth('updated_at', now()->month)->count(),
            'total_tramites' => Tramite::count()
        ];

        $tramites_recientes = Tramite::with(['user', 'actividad'])
            ->latest()
            ->limit(10)
            ->get();

        return Inertia::render('Municipio/Dashboard', [
            'estadisticas' => $estadisticas,
            'tramites_recientes' => $tramites_recientes
        ]);
    }

    // Lista de trámites para Municipio
    public function index(Request $request)
    {
        $query = Tramite::with(['user', 'actividad']);

        // Filtros
        if ($request->estado) {
            $query->where('estado', $request->estado);
        }

        if ($request->buscar) {
            $query->where(function ($q) use ($request) {
                $q->where('razon_social', 'like', "%{$request->buscar}%")
                    ->orWhere('dni_cuit', 'like', "%{$request->buscar}%")
                    ->orWhereHas('user', function ($userQuery) use ($request) {
                        $userQuery->where('email', 'like', "%{$request->buscar}%");
                    });
            });
        }

        $tramites = $query->orderBy('created_at', 'desc')->paginate(20);

        return Inertia::render('Municipio/Tramites/Index', [
            'tramites' => $tramites,
            'filtros' => $request->only(['estado', 'buscar']),
            'estados' => Tramite::ESTADOS
        ]);
    }

    // Crear nuevo trámite (Contribuyente)
    public function crear()
    {
        $actividades = Actividad::activas()->orderBy('descripcion')->get();

        return Inertia::render('Contribuyente/Tramite/Crear', [
            'actividades' => $actividades
        ]);
    }

    // Guardar nuevo trámite
    public function store(Request $request)
    {
        $request->validate([
            'razon_social' => 'required|string|max:255',
            'dni_cuit' => 'required|string|max:20',
            'apellidos_nombres' => 'required|string|max:255',
            'domicilio' => 'required|string',
            'telefono' => 'required|string|max:20',
            'actividad_id' => 'required|exists:actividades,id',
            'fotos' => 'required|array|min:5',
            'fotos.dni_frente' => 'required|image|max:5120',
            'fotos.dni_dorso' => 'required|image|max:5120',
            'fotos.local_interior' => 'required|image|max:5120',
            'fotos.local_exterior' => 'required|image|max:5120',
            'fotos.boleta_municipal' => 'required|image|max:5120',
            'comprobante_pago' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120'
        ]);

        $user = auth()->user();

        // Actualizar perfil del contribuyente
        $user->perfilContribuyente()->updateOrCreate(
            ['user_id' => $user->id],
            [
                'dni_cuit' => $request->dni_cuit,
                'apellidos_nombres' => $request->apellidos_nombres,
                'domicilio' => $request->domicilio,
                'telefono' => $request->telefono
            ]
        );

        // Crear el trámite
        $tramite = Tramite::create([
            'user_id' => $user->id,
            'razon_social' => $request->razon_social,
            'dni_cuit' => $request->dni_cuit,
            'actividad_id' => $request->actividad_id,
            'estado' => 'iniciado'
        ]);

        // Guardar fotos
        foreach ($request->file('fotos') as $tipo => $foto) {
            $nombreArchivo = $tramite->id . '_' . $tipo . '_' . time() . '.' . $foto->getClientOriginalExtension();
            $rutaArchivo = $foto->storeAs('fotos_tramite', $nombreArchivo, 'public');

            FotoTramite::create([
                'tramite_id' => $tramite->id,
                'tipo_foto' => $tipo,
                'archivo_path' => $nombreArchivo
            ]);
        }

        // Guardar comprobante de pago
        if ($request->hasFile('comprobante_pago')) {
            $nombreComprobante = $tramite->id . '_comprobante_' . time() . '.' . $request->file('comprobante_pago')->getClientOriginalExtension();
            $request->file('comprobante_pago')->storeAs('comprobantes', $nombreComprobante, 'public');
            $tramite->comprobante_pago = $nombreComprobante;
            $tramite->save();
        }

        // Registrar en historial
        $tramite->historial()->create([
            'user_id' => $user->id,
            'accion' => 'Trámite iniciado',
            'descripcion' => "Trámite creado para {$request->razon_social} - Actividad: {$tramite->actividad->descripcion}"
        ]);

        return redirect()->route('contribuyente.dashboard')
            ->with('success', 'Trámite iniciado correctamente. En breve recibirás un email con las próximas instrucciones.');
    }

    // Ver trámite (Contribuyente)
    public function show(Tramite $tramite)
    {
        $this->authorize('view', $tramite);

        $tramite->load(['actividad', 'documentos', 'fotos', 'historial.user']);

        return Inertia::render('Contribuyente/Tramite/Ver', [
            'tramite' => $tramite
        ]);
    }

    // Revisar trámite (Municipio)
    public function revisar(Tramite $tramite)
    {
        $tramite->load(['user.perfilContribuyente', 'actividad', 'documentos', 'fotos', 'historial.user']);

        return Inertia::render('Municipio/Tramites/Revisar', [
            'tramite' => $tramite,
            'tipos_documentos' => Documento::TIPOS
        ]);
    }

    // Aprobar y solicitar documentación (Municipio)
    public function aprobar(Request $request, Tramite $tramite)
    {
        $request->validate([
            'documentos_requeridos' => 'required|array|min:1',
            'documentos_requeridos.*' => 'string|in:' . implode(',', array_keys(Documento::TIPOS)),
            'observaciones' => 'nullable|string'
        ]);

        // Cambiar estado
        $tramite->cambiarEstado('documentacion_solicitada', $request->observaciones);

        // Crear documentos requeridos
        foreach ($request->documentos_requeridos as $tipo_documento) {
            Documento::create([
                'tramite_id' => $tramite->id,
                'tipo_documento' => $tipo_documento,
                'obligatorio' => true,
                'solo_inspeccion' => in_array($tipo_documento, ['libro_actas', 'elementos_seguridad', 'cartel_salida'])
            ]);
        }

        // TODO: Enviar email al contribuyente con lista de documentos

        return redirect()->back()->with('success', 'Documentación solicitada correctamente.');
    }

    // Observar trámite (Municipio)
    public function observar(Request $request, Tramite $tramite)
    {
        $request->validate([
            'observaciones' => 'required|string|max:1000'
        ]);

        $tramite->cambiarEstado('observado', $request->observaciones);

        // TODO: Enviar email al contribuyente con observaciones

        return redirect()->back()->with('success', 'Observaciones registradas correctamente.');
    }
}
