// resources/js/Pages/Contribuyente/Tramite/Crear.jsx
import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Crear({ auth, actividades }) {
    const { data, setData, post, processing, errors } = useForm({
        razon_social: '',
        dni_cuit: '',
        apellidos_nombres: '',
        domicilio: '',
        telefono: '',
        actividad_id: '',
        fotos: {
            dni_frente: null,
            dni_dorso: null,
            local_interior: null,
            local_exterior: null,
            boleta_municipal: null
        },
        comprobante_pago: null
    });

    const [previews, setPreviews] = useState({
        dni_frente: null,
        dni_dorso: null,
        local_interior: null,
        local_exterior: null,
        boleta_municipal: null,
        comprobante_pago: null
    });

    const handleFileChange = (campo, file) => {
        if (campo === 'comprobante_pago') {
            setData('comprobante_pago', file);
        } else {
            setData('fotos', {
                ...data.fotos,
                [campo]: file
            });
        }

        // Crear preview solo para imágenes
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviews(prev => ({
                    ...prev,
                    [campo]: e.target.result
                }));
            };
            reader.readAsDataURL(file);
        } else {
            setPreviews(prev => ({
                ...prev,
                [campo]: null
            }));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('contribuyente.tramite.store'));
    };

    const tiposFotos = [
        { key: 'dni_frente', label: 'DNI Frente', requerido: true },
        { key: 'dni_dorso', label: 'DNI Dorso', requerido: true },
        { key: 'local_interior', label: 'Foto Local Interior', requerido: true },
        { key: 'local_exterior', label: 'Foto Local Exterior (incluida vereda)', requerido: true },
        { key: 'boleta_municipal', label: 'Boleta Tasa Municipal', requerido: true }
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Nuevo Trámite de Habilitación</h2>}
        >
            <Head title="Nuevo Trámite" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Datos para Iniciar la Habilitación Comercial
                                </h3>
                                <p className="text-gray-600">
                                    Complete todos los campos requeridos para iniciar su trámite de habilitación comercial
                                </p>
                            </div>

                            <form onSubmit={submit} className="space-y-6">
                                {/* Datos del Comercio */}
                                <div className="border-b border-gray-200 pb-6">
                                    <h4 className="text-md font-medium text-gray-900 mb-4">Datos del Comercio</h4>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Razón Social *
                                            </label>
                                            <input
                                                type="text"
                                                value={data.razon_social}
                                                onChange={(e) => setData('razon_social', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Nombre del comercio"
                                            />
                                            {errors.razon_social && <p className="text-red-600 text-sm mt-1">{errors.razon_social}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                DNI/CUIT *
                                            </label>
                                            <input
                                                type="text"
                                                value={data.dni_cuit}
                                                onChange={(e) => setData('dni_cuit', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Ej: 20-12345678-9"
                                            />
                                            {errors.dni_cuit && <p className="text-red-600 text-sm mt-1">{errors.dni_cuit}</p>}
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Apellidos y Nombres *
                                            </label>
                                            <input
                                                type="text"
                                                value={data.apellidos_nombres}
                                                onChange={(e) => setData('apellidos_nombres', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Apellidos y nombres del titular"
                                            />
                                            {errors.apellidos_nombres && <p className="text-red-600 text-sm mt-1">{errors.apellidos_nombres}</p>}
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Domicilio *
                                            </label>
                                            <textarea
                                                value={data.domicilio}
                                                onChange={(e) => setData('domicilio', e.target.value)}
                                                rows={3}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Dirección completa del comercio"
                                            />
                                            {errors.domicilio && <p className="text-red-600 text-sm mt-1">{errors.domicilio}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Teléfono de Contacto *
                                            </label>
                                            <input
                                                type="text"
                                                value={data.telefono}
                                                onChange={(e) => setData('telefono', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Ej: 2995-123456"
                                            />
                                            {errors.telefono && <p className="text-red-600 text-sm mt-1">{errors.telefono}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Rubro/Actividad *
                                            </label>
                                            <select
                                                value={data.actividad_id}
                                                onChange={(e) => setData('actividad_id', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                <option value="">Seleccionar actividad...</option>
                                                {actividades.map((actividad) => (
                                                    <option key={actividad.id} value={actividad.id}>
                                                        {actividad.descripcion}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.actividad_id && <p className="text-red-600 text-sm mt-1">{errors.actividad_id}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Fotos e Imágenes */}
                                <div className="border-b border-gray-200 pb-6">
                                    <h4 className="text-md font-medium text-gray-900 mb-4">Fotos e Imágenes Requeridas</h4>
                                    <p className="text-sm text-gray-600 mb-4">
                                        Todas las imágenes son obligatorias. Formatos aceptados: JPG, PNG. Tamaño máximo: 5MB por archivo.
                                    </p>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {tiposFotos.map((tipo) => (
                                            <div key={tipo.key} className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700">
                                                    {tipo.label} {tipo.requerido && <span className="text-red-500">*</span>}
                                                </label>
                                                
                                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors relative">
                                                    {previews[tipo.key] ? (
                                                        <div className="space-y-2">
                                                            <img
                                                                src={previews[tipo.key]}
                                                                alt={tipo.label}
                                                                className="mx-auto h-24 w-24 object-cover rounded-md"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setData('fotos', {...data.fotos, [tipo.key]: null});
                                                                    setPreviews(prev => ({...prev, [tipo.key]: null}));
                                                                }}
                                                                className="text-red-600 text-xs hover:text-red-800"
                                                            >
                                                                Eliminar
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <svg className="mx-auto h-8 w-8 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                                            </svg>
                                                            <div className="text-xs text-gray-600 mt-2">
                                                                Hacer clic para seleccionar
                                                            </div>
                                                        </div>
                                                    )}
                                                    
                                                   <input
                                                        type="file"
                                                        id={`foto-${tipo.key}`}
                                                        accept="image/jpeg,image/jpg,image/png"
                                                        onChange={(e) => handleFileChange(tipo.key, e.target.files[0])}
                                                        className="hidden"
                                                    />
                                                    <label 
                                                        htmlFor={`foto-${tipo.key}`} 
                                                        className="absolute inset-0 cursor-pointer"
                                                    ></label>
                                                </div>
                                                
                                                {errors[`fotos.${tipo.key}`] && (
                                                    <p className="text-red-600 text-sm">{errors[`fotos.${tipo.key}`]}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Comprobante de Pago */}
                                <div className="pb-6">
                                    <h4 className="text-md font-medium text-gray-900 mb-4">Comprobante de Pago</h4>
                                    <p className="text-sm text-gray-600 mb-4">
                                        Adjunte el comprobante de pago de la tasa de habilitación comercial.
                                    </p>
                                    
                                    <div className="max-w-md">
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors relative">
                                            {data.comprobante_pago ? (
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-center">
                                                        <svg className="h-8 w-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                    </div>
                                                    <div className="text-sm text-gray-700">{data.comprobante_pago.name}</div>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setData('comprobante_pago', null);
                                                            setPreviews(prev => ({...prev, comprobante_pago: null}));
                                                        }}
                                                        className="text-red-600 text-xs hover:text-red-800"
                                                    >
                                                        Eliminar
                                                    </button>
                                                </div>
                                            ) : (
                                                <div>
                                                    <svg className="mx-auto h-8 w-8 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                    <div className="text-sm text-gray-600 mt-2">
                                                        PDF, JPG o PNG - Máximo 5MB
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        Hacer clic para seleccionar archivo
                                                    </div>
                                                </div>
                                            )}
                                            
                                            <input
                                                type="file"
                                                id="comprobante-pago"
                                                accept=".pdf,image/jpeg,image/jpg,image/png"
                                                onChange={(e) => handleFileChange('comprobante_pago', e.target.files[0])}
                                                className="hidden"
                                            />
                                            <label 
                                                htmlFor="comprobante-pago" 
                                                className="absolute inset-0 cursor-pointer"
                                            ></label>
                                        </div>
                                        {errors.comprobante_pago && (
                                            <p className="text-red-600 text-sm mt-2">{errors.comprobante_pago}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Botones */}
                                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                                    <a
                                        href={route('contribuyente.dashboard')}
                                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg"
                                    >
                                        Cancelar
                                    </a>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-2 px-6 rounded-lg flex items-center"
                                    >
                                        {processing && (
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        )}
                                        {processing ? 'Procesando...' : 'Iniciar Trámite'}
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