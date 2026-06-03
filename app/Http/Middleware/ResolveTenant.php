<?php

namespace App\Http\Middleware;

use App\Models\Tenant;
use App\Support\Tenancy\TenantContext;
use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class ResolveTenant
{
    /**
     * Routes qui ne nécessitent PAS de tenant (accès libre).
     */
    private const array TENANT_FREE_PATHS = [
        'admin',
        'admin/*',
        'vendeur',          // ← ajouté
        'vendeur/*',        // ← ajouté
        'login',
        'register',
        'forgot-password',
        'reset-password',
        'verify-email',
        'confirm-password',
        'logout',
        'sanctum/*',
    ];

    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $context = app(TenantContext::class);

        // ==========================================
        // 1. ROUTES SANS TENANT (Admin, Auth, etc.)
        // ==========================================
        if ($this->isTenantFreeRoute($request)) {
            $context->clear();
            $this->shareTenant(null);

            return $next($request);
        }

        // ==========================================
        // 2. ROUTES AVEC TENANT
        // ==========================================
        $tenant = $this->resolveTenant($request);

        if (! $tenant) {
            // Si pas de tenant trouvé, on laisse passer quand même
            // (peut être la page d'accueil ou une page publique)
            $context->clear();
            $this->shareTenant(null);

            return $next($request);
        }

        // Vérifier que le tenant est actif
        if (! $tenant->estActif()) {
            abort(503, 'Boutique temporairement indisponible');
        }

        // Définir le tenant courant
        $context->set($tenant);
        session(['tenant_id' => $tenant->id]);

        // Partager avec Inertia
        $this->shareTenant($tenant);

        return $next($request);
    }

    /**
     * Vérifie si la route actuelle ne nécessite pas de tenant.
     */
    private function isTenantFreeRoute(Request $request): bool
    {
        foreach (self::TENANT_FREE_PATHS as $pattern) {
            if ($request->is($pattern)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Résout le tenant à partir de la requête.
     */
    private function resolveTenant(Request $request): ?Tenant
    {
        $host = $request->getHost();

        // 1. Chercher un sous‑domaine
        $tenant = $this->resolveFromSubdomain($host);
        if ($tenant) {
            return $tenant;
        }

        // 2. Chercher un domaine personnalisé
        $tenant = Tenant::where('domain', $host)->first();
        if ($tenant) {
            return $tenant;
        }

        // 3. Chercher dans la session (pour le panneau vendeur)
        $tenantId = session('tenant_id');
        if ($tenantId) {
            return Tenant::find($tenantId);
        }

        return null;
    }

    /**
     * Résout un tenant à partir du sous‑domaine.
     */
    private function resolveFromSubdomain(string $host): ?Tenant
    {
        $parts = explode('.', $host);

        // Ignorer si pas de sous‑domaine
        if (count($parts) < 3) {
            return null;
        }

        $subdomain = $parts[0];

        // Ignorer les sous‑domaines réservés
        if (in_array($subdomain, ['admin', 'app', 'api', 'www', 'mail'])) {
            return null;
        }

        return Tenant::where('slug', $subdomain)->first();
    }

    /**
     * Partage les informations du tenant avec Inertia.
     */
    private function shareTenant(?Tenant $tenant): void
    {
        if ($tenant) {
            Inertia::share('currentTenant', [
                'id' => $tenant->id,
                'raison_sociale' => $tenant->raison_sociale,
                'slug' => $tenant->slug,
                'logo' => $tenant->getFilamentAvatarUrl(),
            ]);
        } else {
            Inertia::share('currentTenant', null);
        }
    }
}
