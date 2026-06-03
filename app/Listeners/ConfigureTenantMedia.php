<?php

namespace App\Listeners;

use App\Support\Tenancy\TenantStorage;
use Illuminate\Support\Facades\Config;
use Stancl\Tenancy\Events\TenancyInitialized;

class ConfigureTenantMedia
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(TenancyInitialized $event): void
    {
        $tenant = $event->tenancy->tenant;

        Config::set('filesystems.disks.tenant.root', TenantStorage::publicDiskRoot($tenant));
        Config::set('filesystems.disks.tenant.url', TenantStorage::tenantPublicUrl($tenant));
    }
}
