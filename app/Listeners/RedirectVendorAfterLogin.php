<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Login;
use Illuminate\Support\Facades\Session;

class RedirectVendorAfterLogin
{
    public function handle(Login $event): void
    {
        $user = $event->user;

        // Ignorer les connexions dans le contexte tenant (acheteurs)
        if (function_exists('tenancy') && tenancy()->initialized) {
            return;
        }

        // Toujours rediriger vers la page de sélection de compte
        Session::put('url.intended', route('central.account-selection.index'));
    }
}
