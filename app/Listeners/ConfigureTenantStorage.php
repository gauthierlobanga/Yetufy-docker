<?php

namespace App\Listeners;

use App\Support\Tenancy\TenantStorage;
use Illuminate\Support\Facades\Config;
use Stancl\Tenancy\Events\TenancyInitialized;

class ConfigureTenantStorage
{
    public function handle(TenancyInitialized $event)
    {
        $tenant = $event->tenancy->tenant;

        Config::set('filesystems.disks.tenant.root', TenantStorage::publicDiskRoot($tenant));
        Config::set('filesystems.disks.tenant.url', TenantStorage::tenantPublicUrl($tenant));
    }
}
