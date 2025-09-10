<?php
// routes/web.php - REEMPLAZAR completamente

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TramiteController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Dashboard general - REQUIERE EMAIL VERIFICADO
Route::get('/dashboard', function () {
    if (auth()->user()->tipo_usuario === 'municipio') {
        return redirect()->route('municipio.dashboard');
    }
    return redirect()->route('contribuyente.dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Rutas para Contribuyentes - TODAS REQUIEREN VERIFICACIÓN
Route::middleware(['auth', 'verified', 'tipo_usuario:contribuyente'])->prefix('contribuyente')->name('contribuyente.')->group(function () {
    Route::get('/dashboard', [TramiteController::class, 'dashboardContribuyente'])->name('dashboard');
    Route::get('/tramite/nuevo', [TramiteController::class, 'crear'])->name('tramite.crear');
    Route::post('/tramite', [TramiteController::class, 'store'])->name('tramite.store');
    Route::get('/tramite/{tramite}', [TramiteController::class, 'show'])->name('tramite.show');
});

// Rutas para Municipio - TODAS REQUIEREN VERIFICACIÓN
Route::middleware(['auth', 'verified', 'tipo_usuario:municipio'])->prefix('municipio')->name('municipio.')->group(function () {
    Route::get('/dashboard', [TramiteController::class, 'dashboardMunicipio'])->name('dashboard');
    Route::get('/tramites', [TramiteController::class, 'index'])->name('tramites.index');
    Route::get('/tramite/{tramite}', [TramiteController::class, 'revisar'])->name('tramite.revisar');
    Route::post('/tramite/{tramite}/aprobar', [TramiteController::class, 'aprobar'])->name('tramite.aprobar');
    Route::post('/tramite/{tramite}/observar', [TramiteController::class, 'observar'])->name('tramite.observar');
});

// Perfil - REQUIERE VERIFICACIÓN
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';