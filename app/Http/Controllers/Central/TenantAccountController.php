<?php

namespace App\Http\Controllers\Central;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Services\VendorRegistrationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class TenantAccountController extends Controller
{
    public function __construct(
        private readonly VendorRegistrationService $vendorService,
    ) {}

    public function index(Request $request): Response
    {
        $user = $request->user();

        $tenants = $this->ownedActiveTenants($user);

        return Inertia::render('auth/account-selection', [
            'account' => [
                'name' => $user->name,
                'email' => $user->email,
                'avatar_url' => $user->avatar_url,
            ],
            'tenants' => $tenants->map(fn (Tenant $tenant): array => [
                'id' => $tenant->id,
                'slug' => $tenant->slug,
                'name' => $tenant->raison_sociale,
                'email' => $tenant->email,
                'logo_url' => $tenant->logo_url,
                'sso_login_url' => $this->vendorService->getTenantSsoLoginUrl($tenant, $user),
            ])->values(),
        ]);
    }

    public function select(Request $request, Tenant $tenant): RedirectResponse
    {
        $user = $request->user();

        abort_unless(
            $this->ownedActiveTenants($user)->contains(fn (Tenant $ownedTenant): bool => $ownedTenant->is($tenant)),
            403,
        );

        return redirect()->away(
            $this->vendorService->getTenantSsoLoginUrl($tenant, $user),
        );
    }

    public function addAccount(): RedirectResponse
    {
        return redirect()->route('vendor.register');
    }

    private function ownedActiveTenants($user)
    {
        return $user->tenants()
            ->wherePivot('is_owner', true)
            ->where('tenants.statut', Tenant::STATUT_ACTIF)
            ->where('tenants.is_active', true)
            ->with('domains')
            ->orderBy('tenants.raison_sociale')
            ->get();
    }
}
