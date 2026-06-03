<?php

namespace App\Concerns\Traits;

use App\Models\Tenant;
use App\Support\Tenancy\TenantContext;
use Illuminate\Support\Facades\Auth;

trait BelongsToTenant
{
    protected static function bootBelongsToTenant()
    {
        static::creating(function ($model) {
            $context = app(TenantContext::class);

            if (! $model->tenant_id && $context->hasTenant()) {
                $model->tenant_id = $context->id();
            }
        });

        static::addGlobalScope('tenant', function ($query) {
            // Si on est dans le contexte admin OU si l'utilisateur est super_admin
            // → Ne pas filtrer, montrer toutes les données
            if (static::shouldBypassTenantScope()) {
                return;
            }

            $context = app(TenantContext::class);
            if ($context->hasTenant()) {
                $query->where($query->getModel()->getTable().'.tenant_id', $context->id());
            }
        });
    }

    /**
     * Détermine si le scope tenant doit être ignoré.
     */
    protected static function shouldBypassTenantScope(): bool
    {
        // 1. Si pas de contexte tenant → on est dans l'admin → bypass
        $context = app(TenantContext::class);
        if (! $context->hasTenant()) {
            return true;
        }

        // 2. Si l'utilisateur connecté est super_admin → bypass
        if (Auth::check() && Auth::user()->hasRole('super_admin')) {
            return true;
        }

        return false;
    }

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }
}
