<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckTenantAccess
{
    /**
     * Handle incoming request.
     * Checks if tenant is blocked or subscription has been disabled.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $tenant = tenant();

        if (!$tenant) {
            return $next($request);
        }

        $subscription = $tenant->subscription;

        if (!$subscription) {
            return redirect()->route('tenant.subscription.none')
                ->with('error', 'Aucune subscription trouvée.');
        }

        // If subscription is blocked, deny all access
        if ($subscription->is_blocked) {
            return response()->view('errors.access-denied', [
                'message' => 'Votre accès a été bloqué en raison d\'une violation de nos conditions d\'utilisation.',
            ], 403);
        }

        // If tenant is marked as inactive/suspended
        if ($tenant->statut !== \App\Models\Tenant::STATUT_ACTIF) {
            return response()->view('errors.access-denied', [
                'message' => 'Votre boutique n\'est pas active.',
            ], 403);
        }

        return $next($request);
    }
}
