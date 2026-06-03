<?php

// app/Http/Middleware/IdentifyTenant.php

namespace App\Http\Middleware;

use App\Models\Tenant;
use App\Support\Tenancy\TenantContext;
use Closure;
use Illuminate\Http\Request;

class IdentifyTenant
{
    public function handle(Request $request, Closure $next)
    {
        // $context = app(TenantContext::class);

        // // Détecter si on est sur le panneau admin
        // $isAdminPanel = $request->is('admin/*') || $request->is('admin');

        // if ($isAdminPanel) {
        //     // PAS de tenant pour l'admin → super_admin voit tout
        //     $context->clear();

        //     return $next($request);
        // }

        // // Pour le panneau vendeur, détecter le tenant normalement
        // $host = $request->getHost();
        // $tenant = Tenant::where('domain', $host)->first();

        // if (! $tenant) {
        //     $subdomain = explode('.', $host)[0];
        //     $tenant = Tenant::where('slug', $subdomain)->first();
        // }

        // if (! $tenant) {
        //     abort(404, 'Tenant non trouvé');
        // }

        // if (! $tenant->estActif()) {
        //     abort(403, 'Tenant inactif');
        // }

        // $context->set($tenant);

        return $next($request);
    }
}
