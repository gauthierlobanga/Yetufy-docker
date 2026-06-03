<?php

namespace App\Actions\Fortify;

use App\Models\Client;
use App\Models\Tenant;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Contracts\LoginResponse;

class CustomLoginResponse implements LoginResponse
{
    public function toResponse($request)
    {
        $user = $request->user();
        // dd('toResponse atteint', $user?->email);

        // Domaine central
        if ($this->isCentralDomain($request->getHost())) {
            if ($user && $this->getUserTenant($user)) {
                return redirect()->route('central.account-selection.index');
            }

            if ($user?->hasRole('super_admin') && Route::has('filament.admin.pages.dashboard')) {
                return redirect()->intended(route('filament.admin.pages.dashboard'));
            }

            return redirect()->intended(route('vendor.register'));
        }

        // Domaine tenant (ne change rien)
        if ($user && $this->canUseTenantDashboard($user)) {
            return redirect()->intended('/vendor/dashboard');
        }
        $this->ensureTenantClient($user);

        return redirect()->intended(route('acheteur.dashboard'));
    }

    private function isCentralDomain(string $host): bool
    {
        return in_array($host, config('tenancy.central_domains', []), true);

    }

    private function getUserTenant($user): ?Tenant
    {
        return $user->tenants()
            ->where('tenants.statut', Tenant::STATUT_ACTIF)
            ->where('tenants.is_active', true)
            ->orderByDesc('user_tenant.is_owner')
            ->first();
    }

    private function canUseTenantDashboard($user): bool
    {
        if ($user->hasRole(['super_admin', 'owner', 'manager'])) {
            return true;
        }

        if (! function_exists('tenant') || ! tenant()) {
            return false;
        }

        return DB::connection($this->centralConnection())
            ->table('user_tenant')
            ->where('user_id', $user->id)
            ->where('tenant_id', tenant()->id)
            ->where('is_owner', true)
            ->exists();
    }

    private function ensureTenantClient($user): void
    {
        if (! $user || ! function_exists('tenancy') || ! tenancy()->initialized) {
            return;
        }

        Client::firstOrCreate(
            ['user_id' => $user->id],
            [
                'nom' => $user->name,
                'email' => $user->email,
                'statut' => Client::STATUT_ACTIF,
                'source' => 'connexion',
            ]
        );
    }

    private function centralConnection(): string
    {
        return config('tenancy.database.central_connection', config('database.default'));
    }
}
