<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureTenantSubscription
{
    /**
     * Handle incoming request.
     * Ensures tenant has an active or valid subscription.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $tenant = tenant();

        if (! $tenant) {
            return $next($request);
        }

        $subscription = $tenant->subscription;

        // No subscription found
        if (! $subscription) {
            return redirect()->route('tenant.subscription.none')
                ->with('error', 'Aucune subscription trouvée.');
        }

        // Subscription is active
        if ($subscription->isActive()) {
            return $next($request);
        }

        // Subscription is within grace period (after trial ends or after cancellation)
        if ($subscription->isGracePeriodActive()) {
            // Warn the user but allow access
            $request->session()->flash('warning',
                'Votre subscription a expiré. Vous avez accès jusqu\'au '.
                $subscription->grace_period_ends_at->format('d/m/Y')
            );

            return $next($request);
        }

        // Subscription is expired and grace period is over - block access
        return redirect()->route('tenant.subscription.expired')
            ->with('error', 'Votre subscription a expiré. Votre accès a été bloqué.');
    }
}
