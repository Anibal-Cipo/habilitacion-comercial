<?php

namespace App\Http\Controllers;

use App\Models\Documento;
use App\Models\Tramite;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DocumentoController extends Controller
{
    // Subir documento (Contribuyente)
    public function store(Request $request, Tramite $tramite)
    {
        $this->authorize('update', $tramite);

        $request->validate([
            'documento_id' => 'required|exists:documentos,id',
            'archivo' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120'
        ]);

        $documento = Documento::findOrFail($request->documento_id);

        if ($documento->tramite_id !== $tramite->id) {
            abort(403);
        }

        // Eliminar archivo anterior si existe
        if ($documento->archivo_path) {
            Storage::disk('public')->delete('documentos/' . $documento->archivo_path);
        }

        // Guardar nuevo archivo
        $nombreArchivo = $tramite->id . '_' . $documento->tipo_documento . '_' . time() . '.' . $request->file('archivo')->getClientOriginalExtension();
        $request->file('archivo')->storeAs('documentos', $nombreArchivo, 'public');

        $documento->update([
            'archivo_path' => $nombreArchivo,
            'presentado' => true,
            'verificado' => false
        ]);

        // Verificar si todos los documentos están completos
        $documentosPendientes = $tramite->documentos()
            ->where('solo_inspeccion', false)
            ->where('presentado', false)
            ->count();

        if ($documentosPendientes === 0) {
            $tramite->cambiarEstado('documentacion_completa', 'Toda la documentación ha sido presentada');
        }

        return redirect()->back()->with('success', 'Documento subido correctamente.');
    }

    // Verificar documento (Municipio)
    public function verificar(Request $request, Documento $documento)
    {
        $request->validate([
            'verificado' => 'required|boolean',
            'observaciones' => 'nullable|string'
        ]);

        $documento->update([
            'verificado' => $request->verificado,
            'observaciones' => $request->observaciones,
            'fecha_verificacion' => now(),
            'verificado_por' => auth()->id()
        ]);

        return redirect()->back()->with('success', 'Documento verificado correctamente.');
    }

    // Descargar documento
    public function descargar(Documento $documento)
    {
        if (!$documento->archivo_path || !Storage::disk('public')->exists('documentos/' . $documento->archivo_path)) {
            abort(404);
        }

        return Storage::disk('public')->download('documentos/' . $documento->archivo_path);
    }
}
