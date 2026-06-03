<?php

namespace App\Filament\Resources\Vendeurs\Pages;

use App\Filament\Resources\Vendeurs\VendeurResource;
use App\Models\Plan;
use App\Models\Tenant;
use App\Models\User;
use App\Models\VendorRequest;
use Filament\Resources\Pages\CreateRecord;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Stancl\Tenancy\Events\TenantCreated;

class CreateVendeur extends CreateRecord
{
    protected static string $resource = VendeurResource::class;

    protected function afterCreate(): void
    {
        $tenant = $this->getRecord();

        // Activer le tenant et lier l'utilisateur créateur
        $tenant->update([
            'statut'          => Tenant::STATUT_ACTIF,
            'is_active'       => true,
            'user_id'         => Auth::id(),
        ]);

        // Domaine (fallback si champ vide)
        $domain = $this->data['domain'] ?? str_replace('_', '-', $tenant->slug) . '.localhost';
        $tenant->domains()->create([
            'domain' => $domain,
        ]);

        // Plan gratuit par défaut (votre logique existante)
        if (! $tenant->plan_id) {
            $freePlan = Plan::free()->first();
            if ($freePlan) {
                $tenant->update(['plan_id' => $freePlan->id]);

                if ($freePlan->trial_days > 0) {
                    $tenant->update([
                        'date_activation' => now(),
                        'date_expiration' => now()->addDays($freePlan->trial_days),
                    ]);
                } else {
                    $tenant->update(['date_activation' => now()]);
                }

                // Tracer la création
                VendorRequest::create([
                    'user_id'       => Auth::id(),
                    'plan_id'       => $freePlan->id,
                    'shop_name'     => $tenant->raison_sociale,
                    'shop_slug'     => $tenant->slug,
                    'contact_email' => $tenant->email,
                    'status'        => VendorRequest::STATUS_APPROVED,
                    'approved_at'   => now(),
                    'tenant_id'     => $tenant->id,
                ]);
            }
        }

        // Provisionner la base de données du tenant (création de la BDD, migrations, etc.)
        try {
            event(new TenantCreated($tenant));
        } catch (\Throwable $e) {
            Log::error('Échec du provisionnement de la base du tenant', [
                'tenant_id' => $tenant->id,
                'error'     => $e->getMessage(),
            ]);
            // On continue malgré l'erreur pour au moins attacher l'utilisateur
        }

        // Attacher l'utilisateur admin courant comme propriétaire dans la table pivot centrale
        $tenant->users()->attach(Auth::id(), ['is_owner' => true]);

        // Synchroniser l'utilisateur dans la base du tenant (après provisionnement)
        try {
            tenancy()->initialize($tenant);
            User::updateOrCreate(
                ['id' => Auth::id()],
                [
                    'name'              => Auth::user()->name,
                    'email'             => Auth::user()->email,
                    'password'          => Auth::user()->password,
                    'email_verified_at' => Auth::user()->email_verified_at,
                    'is_active'         => true,
                ]
            );
        } catch (\Throwable $e) {
            Log::error('Impossible de synchroniser l’utilisateur dans le tenant', [
                'tenant_id' => $tenant->id,
                'user_id'   => Auth::id(),
                'error'     => $e->getMessage(),
            ]);
        }
    }

    protected function getRedirectUrl(): string
    {
        return route('filament.admin.resources.vendeurs.index');
    }
}
