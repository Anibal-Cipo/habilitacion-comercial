// resources/js/Pages/Municipio/Tramites/Revisar.jsx
import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Revisar({ auth, tramite, tipos_documentos }) {
    const [accion, setAccion] = useState('aprobar'); // 'aprobar' o 'observar'
    
    const { data, setData, post, processing, errors } = useForm({
        documentos_requeridos: [],
        observaciones: ''
    });

    const handleDocumentoChange = (tipoDoc, checked) => {
        if (checked) {
            setData('documentos_requeridos', [...data.documentos_requeridos, tipoDoc]);
        } else {
            setData('documentos_requeridos', data.documentos_requeridos.filter(doc => doc !== tipoDoc));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (accion === 'aprobar') {
            post(route('municipio.tramite.aprobar', tramite.id));
        } else {
            post(route('municipio.tramite.observar', tramite.id));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Revisar Trámite: {tramite.razon_social}
                    </h2>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {tramite.estado}
                    </span>
                </div>
            }
        >
            <Head title={`Revisar - ${tramite.razon_social}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Información del Trámite */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Trámite</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-medium text-gray-700 mb-3">Datos del Comercio</h4>
                                    <div className="space-y-2 text-sm">
                                        <p><span className="font-medium">Razón Social:</span> {tramite.razon_social}</p>
                                        <p><span className="font-medium">DNI/CUIT:</span> {tramite.dni_cuit}</p>
                                        <p><span className="font-medium">Actividad:</span> {tramite.actividad?.descripcion}</p>
                                    </div>
                                </div>
                                
                                <div>
                                    <h4 className="font-medium text-gray-700 mb-3">Datos del Contribuyente</h4>
                                    <div className="space-y-2 text-sm">
                                        <p><span className="font-medium">Nombre:</span> {tramite.user?.name}</p>
                                        <p><span className="font-medium">Email:</span> {tramite.user?.email}</p>
                                        <p><span className="font-medium">Fecha de solicitud:</span> {new Date(tramite.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>

                            {tramite.user?.perfil_contribuyente && (
                                <div className="mt-6">
                                    <h4 className="font-medium text-gray-700 mb-3">Información Adicional</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                                        <p><span className="font-medium">Apellidos y Nombres:</span> {tramite.user.perfil_contribuyente.apellidos_nombres}</p>
                                        <p><span className="font-medium">Teléfono:</span> {tramite.user.perfil_contribuyente.telefono}</p>
                                        <div className="md:col-span-2">
                                            <p><span className="font-medium">Domicilio:</span> {tramite.user.perfil_contribuyente.domicilio}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Fotos del Trámite */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Documentación Inicial</h3>
                            
                            {tramite.fotos?.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                    {tramite.fotos.map((foto, index) => (
                                        <div key={index} className="space-y-2">
                                            <img 
                                                src={`/storage/fotos_tramite/${foto.archivo_path}`}
                                                alt={foto.tipo_foto}
                                                className="w-full h-32 object-cover border border-gray-200 rounded-lg"
                                            />
                                            <p className="text-xs text-center text-gray-600 font-medium">
                                                {foto.tipo_foto.replace('_', ' ').toUpperCase()}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">No hay fotos cargadas</p>
                            )}

                            {tramite.comprobante_pago && (
                                <div className="mt-6">
                                    <h4 className="font-medium text-gray-700 mb-2">Comprobante de Pago</h4>
                                    <a 
                                        href={`/storage/comprobantes/${tramite.comprobante_pago}`}
                                        target="_blank"
                                        className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        Ver Comprobante
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Formulario de Decisión */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">Revisión del Trámite</h3>
                            
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Tipo de Acción */}
                                <div>
                                    <label className="text-base font-medium text-gray-900">Acción a realizar:</label>
                                    <div className="mt-4 space-y-4">
                                        <div className="flex items-center">
                                            <input
                                                id="aprobar"
                                                type="radio"
                                                checked={accion === 'aprobar'}
                                                onChange={() => setAccion('aprobar')}
                                                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                            />
                                            <label htmlFor="aprobar" className="ml-3 block text-sm font-medium text-gray-700">
                                                Aprobar y solicitar documentación
                                            </label>
                                        </div>
                                        <div className="flex items-center">
                                            <input
                                                id="observar"
                                                type="radio"
                                                checked={accion === 'observar'}
                                                onChange={() => setAccion('observar')}
                                                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                            />
                                            <label htmlFor="observar" className="ml-3 block text-sm font-medium text-gray-700">
                                                Rechazar con observaciones
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Documentos Requeridos (solo si aprueba) */}
                                {accion === 'aprobar' && (
                                    <div>
                                        <label className="text-base font-medium text-gray-900 mb-4 block">
                                            Documentos que debe presentar:
                                        </label>
                                        <div className="space-y-3 max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-4">
                                            {Object.entries(tipos_documentos).map(([key, label]) => (
                                                <div key={key} className="flex items-center">
                                                    <input
                                                        id={key}
                                                        type="checkbox"
                                                        checked={data.documentos_requeridos.includes(key)}
                                                        onChange={(e) => handleDocumentoChange(key, e.target.checked)}
                                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                    />
                                                    <label htmlFor={key} className="ml-3 text-sm text-gray-700">
                                                        {label}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                        {errors.documentos_requeridos && (
                                            <p className="text-red-600 text-sm mt-1">{errors.documentos_requeridos}</p>
                                        )}
                                    </div>
                                )}

                                {/* Observaciones */}
                                <div>
                                    <label htmlFor="observaciones" className="block text-sm font-medium text-gray-700 mb-2">
                                        {accion === 'aprobar' ? 'Observaciones adicionales (opcional)' : 'Motivo del rechazo *'}
                                    </label>
                                    <textarea
                                        id="observaciones"
                                        rows={4}
                                        value={data.observaciones}
                                        onChange={(e) => setData('observaciones', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder={accion === 'aprobar' ? 'Comentarios adicionales...' : 'Explique el motivo del rechazo...'}
                                        required={accion === 'observar'}
                                    />
                                    {errors.observaciones && (
                                        <p className="text-red-600 text-sm mt-1">{errors.observaciones}</p>
                                    )}
                                </div>

                                {/* Botones */}
                                <div className="flex justify-between pt-6 border-t border-gray-200">
                                    
                                       <a href={route('municipio.tramites.index')}
                                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg"
                                    >
                                        Volver al Listado
                                    </a>
                                    
                                    <button
                                        type="submit"
                                        disabled={processing}
                                       className={accion === 'aprobar' 
                                            ? 'bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg flex items-center disabled:opacity-50'
                                            : 'bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg flex items-center disabled:opacity-50'}
                                    >
                                        {processing && (
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        )}
                                        {processing ? 'Procesando...' : (accion === 'aprobar' ? 'Aprobar Trámite' : 'Rechazar Trámite')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}