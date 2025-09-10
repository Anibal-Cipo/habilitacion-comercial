// resources/js/Pages/Municipio/Dashboard.jsx
import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ auth, estadisticas, tramites_recientes }) {
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

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Panel Municipal</h2>}
        >
            <Head title="Panel Municipal" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Estadísticas */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Pendientes Revisión</p>
                                        <p className="text-2xl font-semibold text-gray-900">{estadisticas.pendientes_revision}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Listos Inspección</p>
                                        <p className="text-2xl font-semibold text-gray-900">{estadisticas.listos_inspeccion}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="p-3 rounded-full bg-green-100 text-green-600">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Habilitados este Mes</p>
                                        <p className="text-2xl font-semibold text-gray-900">{estadisticas.habilitados_mes}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Total Trámites</p>
                                        <p className="text-2xl font-semibold text-gray-900">{estadisticas.total_tramites}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Acciones Rápidas */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Link
                                    href={route('municipio.tramites.index', { estado: 'en_revision' })}
                                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <div className="p-2 bg-yellow-100 rounded-lg">
                                        <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="font-medium text-gray-900">Revisar Trámites</p>
                                        <p className="text-sm text-gray-600">Pendientes de revisión</p>
                                    </div>
                                </Link>

                                <Link
                                    href={route('municipio.tramites.index', { estado: 'aprobado_inspeccion' })}
                                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="font-medium text-gray-900">Programar Inspecciones</p>
                                        <p className="text-sm text-gray-600">Listos para inspeccionar</p>
                                    </div>
                                </Link>

                                <Link
                                    href={route('municipio.tramites.index')}
                                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="font-medium text-gray-900">Todos los Trámites</p>
                                        <p className="text-sm text-gray-600">Ver listado completo</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Trámites Recientes */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Trámites Recientes</h3>
                                <Link
                                    href={route('municipio.tramites.index')}
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                >
                                    Ver todos
                                </Link>
                            </div>

                            {tramites_recientes.length === 0 ? (
                                <p className="text-gray-500 text-center py-6">No hay trámites recientes</p>
                            ) : (
                                <div className="space-y-3">
                                    {tramites_recientes.map((tramite) => (
                                        <div key={tramite.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-3">
                                                    <h4 className="font-medium text-gray-900">{tramite.razon_social}</h4>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(tramite.estado)}`}>
                                                        {getEstadoTexto(tramite.estado)}
                                                    </span>
                                                </div>
                                                <div className="mt-1 text-sm text-gray-600">
                                                    <span className="mr-4">👤 {tramite.user.email}</span>
                                                    <span className="mr-4">🏢 {tramite.actividad.descripcion}</span>
                                                    <span>📅 {new Date(tramite.created_at).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                            <Link
                                                href={route('municipio.tramite.revisar', tramite.id)}
                                                className="ml-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-3 rounded text-sm"
                                            >
                                                Revisar
                                            </Link>
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