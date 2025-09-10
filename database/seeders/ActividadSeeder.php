<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Actividad;
use Illuminate\Support\Facades\Storage;

class ActividadSeeder extends Seeder
{
    public function run(): void
    {
        // Leer el archivo CSV desde storage/app/seeders/
        $csvPath = storage_path('app/seeders/actividadesrubro.csv');

        if (!file_exists($csvPath)) {
            $this->command->error("Archivo CSV no encontrado en: {$csvPath}");
            $this->command->info("Por favor, copie el archivo actividadesrubro.csv a storage/app/seeders/");
            return;
        }

        $this->command->info('Importando actividades desde CSV...');

        $file = fopen($csvPath, 'r');
        $header = fgetcsv($file, 0, ';'); // Leer cabecera

        $count = 0;
        while (($row = fgetcsv($file, 0, ';')) !== false) {
            if (count($row) >= 3 && !empty($row[0])) {
                $codActividad = (int)$row[0];
                $descripcion = trim($row[1]);
                $activo = trim($row[2]);

                // Determinar si requiere documentación especial basado en la descripción
                $requiereManipulacion = $this->requiereManipulacionAlimentos($descripcion);
                $requiereSalud = $this->requiereCertificadoSalud($descripcion);
                $requiereAutorizacionSalud = $this->requiereAutorizacionSaludPublica($descripcion);

                Actividad::updateOrCreate(
                    ['cod_actividad' => $codActividad],
                    [
                        'descripcion' => $descripcion,
                        'activo' => $activo,
                        'requiere_manipulacion_alimentos' => $requiereManipulacion,
                        'requiere_certificado_salud' => $requiereSalud,
                        'requiere_autorizacion_salud_publica' => $requiereAutorizacionSalud,
                    ]
                );

                $count++;
            }
        }

        fclose($file);

        $this->command->info("✅ Se importaron {$count} actividades correctamente.");

        // Mostrar algunas estadísticas
        $total = Actividad::count();
        $activas = Actividad::where('activo', 'S')->count();
        $conRequisitos = Actividad::where(function ($q) {
            $q->where('requiere_manipulacion_alimentos', true)
                ->orWhere('requiere_certificado_salud', true)
                ->orWhere('requiere_autorizacion_salud_publica', true);
        })->count();

        $this->command->info("📊 Total actividades: {$total}");
        $this->command->info("📊 Actividades activas: {$activas}");
        $this->command->info("📊 Con requisitos especiales: {$conRequisitos}");
    }

    private function requiereManipulacionAlimentos($descripcion): bool
    {
        $keywords = [
            'PANADERIA',
            'CARNICERIA',
            'ART. ALIMENTICIOS',
            'RESTAURANT',
            'BAR Y/O CANTINA',
            'AUTOSERVICIOS',
            'VENTA DE INSUMO PARA RESPOSTERÍA',
            'ALMACEN',
            'SUPERMERCADO',
            'ROTISERIA',
            'CONFITERIA',
            'HELADERIA'
        ];

        foreach ($keywords as $keyword) {
            if (strpos($descripcion, $keyword) !== false) {
                return true;
            }
        }

        return false;
    }

    private function requiereCertificadoSalud($descripcion): bool
    {
        $keywords = [
            'PANADERIA',
            'CARNICERIA',
            'ART. ALIMENTICIOS',
            'RESTAURANT',
            'BAR Y/O CANTINA',
            'PELUQUERIA',
            'SALON DE BELLEZA'
        ];

        foreach ($keywords as $keyword) {
            if (strpos($descripcion, $keyword) !== false) {
                return true;
            }
        }

        return false;
    }

    private function requiereAutorizacionSaludPublica($descripcion): bool
    {
        $keywords = [
            'FARMACIA',
            'CENTRO MEDICO',
            'CONSULTORIO MEDICO',
            'CLINICA',
            'LABORATORIO',
            'ODONTOLOG',
            'VETERINARIA',
            'BOTIQUÍN DE FARMACIA'
        ];

        foreach ($keywords as $keyword) {
            if (strpos($descripcion, $keyword) !== false) {
                return true;
            }
        }

        return false;
    }
}
