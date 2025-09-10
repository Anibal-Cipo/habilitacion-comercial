// resources/js/Pages/Municipio/Tramites/Index.jsx
import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ auth, tramites, filtros, estados }) {
    const getEstadoColor = (estado) => {
        const colores = {
            'iniciado': 'bg-blue-100 text-blue-800',
            'en_revision': 'bg-yellow-100 text-yellow-800',
            'documentacion_solicitada': 'bg-orange-100 text-orange-800',
            'documentacion_completa': 'bg-purple-100 text-purple-800',
            'observado': 'bg-red-100 text-red-800',
            'aprobado_inspeccion': 'bg-indigo-100 text-indigo-800',
            'habilitado': 'bg-green-200 text-green-900',
            'rechazado': 'bg-red-200 text-red-900'
        };
        return colores[estado] || 'bg-gray-100 text-gray-800';
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gestión de Trámites</h2>}
        >
            <Head title="Trámites" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Filtros */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <div className="flex flex-wrap gap-4">
                                <select className="border border-gray-300 rounded-md px-3 py-2">
                                    <option value="">Todos los estados</option>
                                    {Object.entries(estados).map(([key, label]) => (
                                        <option key={key} value={key}>{label}</option>
                                    ))}
                                </select>
                                <input
                                    type="text"
                                    placeholder="Buscar por razón social, DNI o email..."
                                    className="border border-gray-300 rounded-md px-3 py-2 flex-1 min-w-80"
                                />
                                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                                    Buscar
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Lista de Trámites */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Trámites ({tramites.data?.length || 0})
                            </h3>

                            {tramites.data?.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-500">No hay trámites para mostrar</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {tramites.data?.map((tramite) => (
                                        <div key={tramite.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-3 mb-2">
                                                        <h4 className="text-lg font-semibold text-gray-900">
                                                            {tramite.razon_social}
                                                        </h4>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoColor(tramite.estado)}`}>
                                                            {estados[tramite.estado] || tramite.estado}
                                                        </span>
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                                                        <div>
                                                            <span className="font-medium">Contribuyente:</span> {tramite.user?.name}
                                                        </div>
                                                        <div>
                                                            <span className="font-medium">Email:</span> {tramite.user?.email}
                                                        </div>
                                                        <div>
                                                            <span className="font-medium">DNI/CUIT:</span> {tramite.dni_cuit}
                                                        </div>
                                                        <div>
                                                            <span className="font-medium">Fecha:</span> {new Date(tramite.created_at).toLocaleDateString()}
                                                        </div>
                                                    </div>

                                                    <div className="text-sm text-gray-600">
                                                        <span className="font-medium">Actividad:</span> {tramite.actividad?.descripcion}
                                                    </div>

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
                                                        href={route('municipio.tramite.revisar', tramite.id)}
                                                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-sm"
                                                    >
                                                        Revisar
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