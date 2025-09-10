// resources/js/Pages/Contribuyente/Dashboard.jsx
import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ auth, tramites, usuario, perfil }) {
    const getEstadoColor = (estado) => {
        const colores = {
            'iniciado': 'bg-blue-100 text-blue-800',
            'en_revision': 'bg-yellow-100 text-yellow-800', 
            'documentacion_solicitada': 'bg-orange-100 text-orange-800',
            'documentacion_completa': 'bg-purple-100 text-purple-800',
            'observado': 'bg-red-100 text-red-800',
            'aprobado_inspeccion': 'bg-indigo-100 text-indigo-800',
            'inspeccionado_ok': 'bg-green-100 text-green-800',
            'habilitado': 'bg-green-200 text-green-900',
            'rechazado': 'bg-red-200 text-red-900'
        };
        return colores[estado] || 'bg-gray-100 text-gray-800';
    };

    const getEstadoTexto = (estado) => {
        const textos = {
            'iniciado': 'Iniciado',
            'en_revision': 'En Revisión',
            'documentacion_solicitada': 'Documentación Solicitada',
            'documentacion_completa': 'Documentación Completa',
            'observado': 'Observado',
            'aprobado_inspeccion': 'Aprobado para Inspección',
            'inspeccionado_ok': 'Inspección Aprobada',
            'habilitado': 'Habilitado',
            'rechazado': 'Rechazado'
        };
        return textos[estado] || estado;
    };

    const calcularPorcentaje = (estado) => {
        const estados = ['iniciado', 'en_revision', 'documentacion_solicitada', 'documentacion_completa', 'aprobado_inspeccion', 'inspeccionado_ok', 'habilitado'];
        if (estado === 'rechazado') return 0;
        if (estado === 'habilitado') return 100;
        
        const posicion = estados.indexOf(estado);
        return posicion >= 0 ? Math.round((posicion / (estados.length - 1)) * 100) : 0;
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Bienvenida */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900">
                                        Bienvenido, {usuario.name}
                                    </h3>
                                    <p className="text-gray-600 mt-2">
                                        Aquí puedes gestionar tus trámites de habilitación comercial
                                    </p>
                                </div>
                                <Link
                                    href={route('contribuyente.tramite.crear')}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                                >
                                    Nuevo Trámite
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Lista de Trámites */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h4 className="text-lg font-semibold text-gray-900 mb-4">
                                Mis Trámites ({tramites.length})
                            </h4>

                            {tramites.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-gray-400 mb-4">
                                        <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        No tienes trámites iniciados
                                    </h3>
                                    <p className="text-gray-500 mb-6">
                                        Comienza tu proceso de habilitación comercial creando un nuevo trámite
                                    </p>
                                    <Link
                                        href={route('contribuyente.tramite.crear')}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                                    >
                                        Crear Primer Trámite
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {tramites.map((tramite) => (
                                        <div key={tramite.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-3 mb-2">
                                                        <h5 className="text-lg font-semibold text-gray-900">
                                                            {tramite.razon_social}
                                                        </h5>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(tramite.estado)}`}>
                                                            {getEstadoTexto(tramite.estado)}
                                                        </span>
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                                                        <div>
                                                            <span className="font-medium">Actividad:</span> {tramite.actividad.descripcion}
                                                        </div>
                                                        <div>
                                                            <span className="font-medium">DNI/CUIT:</span> {tramite.dni_cuit}
                                                        </div>
                                                        <div>
                                                            <span className="font-medium">Fecha:</span> {new Date(tramite.created_at).toLocaleDateString()}
                                                        </div>
                                                    </div>

                                                    {/* Barra de progreso */}
                                                    <div className="mb-3">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <span className="text-sm text-gray-600">Progreso del trámite</span>
                                                            <span className="text-sm text-gray-900 font-medium">
                                                                {calcularPorcentaje(tramite.estado)}%
                                                            </span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                                            <div 
                                                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                                style={{ width: `${calcularPorcentaje(tramite.estado)}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>

                                                    {/* Observaciones si las hay */}
                                                    {tramite.observaciones && (
                                                        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                                                            <p className="text-sm text-yellow-800">
                                                                <span className="font-medium">Observaciones:</span> {tramite.observaciones}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="ml-4">
                                                    <Link
                                                        href={route('contribuyente.tramite.show', tramite.id)}
                                                        className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg text-sm"
                                                    >
                                                        Ver Detalle
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}