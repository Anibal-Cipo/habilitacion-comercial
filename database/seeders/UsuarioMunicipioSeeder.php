<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UsuarioMunicipioSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('Creando usuarios del municipio...');

        // Usuario administrador principal
        $admin = User::updateOrCreate(
            ['email' => 'admin@municipio.gob.ar'],
            [
                'name' => 'Administrador Municipal',
                'email_verified_at' => now(),
                'password' => Hash::make('admin123'),
                'tipo_usuario' => 'municipio',
                'activo' => true,
            ]
        );

        // Usuarios de diferentes áreas
        $usuarios = [
            [
                'name' => 'Juan Pérez - Habilitaciones',
                'email' => 'habilitaciones@municipio.gob.ar',
                'password' => 'hab123',
            ],
            [
                'name' => 'María González - Comercio',
                'email' => 'comercio@municipio.gob.ar',
                'password' => 'com123',
            ],
            [
                'name' => 'Carlos López - Inspecciones',
                'email' => 'inspecciones@municipio.gob.ar',
                'password' => 'insp123',
            ],
            [
                'name' => 'Ana Martín - Recaudación',
                'email' => 'recaudacion@municipio.gob.ar',
                'password' => 'rec123',
            ],
            [
                'name' => 'Luis Rodríguez - Mesa de Entrada',
                'email' => 'mesaentrada@municipio.gob.ar',
                'password' => 'mesa123',
            ]
        ];

        foreach ($usuarios as $userData) {
            User::updateOrCreate(
                ['email' => $userData['email']],
                [
                    'name' => $userData['name'],
                    'email_verified_at' => now(),
                    'password' => Hash::make($userData['password']),
                    'tipo_usuario' => 'municipio',
                    'activo' => true,
                ]
            );
        }

        // Usuario contribuyente de prueba
        $contribuyente = User::updateOrCreate(
            ['email' => 'prueba@gmail.com'],
            [
                'name' => 'Usuario Prueba',
                'email_verified_at' => now(),
                'password' => Hash::make('prueba123'),
                'tipo_usuario' => 'contribuyente',
                'activo' => true,
            ]
        );

        $this->command->info('✅ Usuarios creados correctamente:');
        $this->command->info('👤 Admin: admin@municipio.gob.ar / admin123');
        $this->command->info('👤 Habilitaciones: habilitaciones@municipio.gob.ar / hab123');
        $this->command->info('👤 Comercio: comercio@municipio.gob.ar / com123');
        $this->command->info('👤 Inspecciones: inspecciones@municipio.gob.ar / insp123');
        $this->command->info('👤 Recaudación: recaudacion@municipio.gob.ar / rec123');
        $this->command->info('👤 Mesa Entrada: mesaentrada@municipio.gob.ar / mesa123');
        $this->command->info('👤 Contribuyente Prueba: prueba@gmail.com / prueba123');
    }
}
