<?php

namespace App\Providers;

// use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;


class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        Tramite::class => TramitePolicy::class,
    ];

    public function boot(): void
    {
        //
    }
}
