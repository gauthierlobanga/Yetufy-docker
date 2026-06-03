<?php

namespace App\Tenancy\Bootstrappers;

use Closure;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Support\Facades\Storage;
use Stancl\Tenancy\Bootstrappers\FilesystemTenancyBootstrapper;
use Stancl\Tenancy\Contracts\Tenant;

class CustomFilesystemTenancyBootstrapper extends FilesystemTenancyBootstrapper
{
    protected array $originalUrls = [];

    public function __construct(Application $app)
    {
        parent::__construct($app);

        foreach ($this->app['config']['tenancy.filesystem.disks'] as $disk) {
            $this->originalUrls[$disk] = $this->app['config']["filesystems.disks.{$disk}.url"] ?? null;
        }
    }

    public function bootstrap(Tenant $tenant)
    {
        parent::bootstrap($tenant);

        foreach ($this->app['config']['tenancy.filesystem.disks'] as $disk) {
            $override = $this->app['config']["tenancy.filesystem.url_override.{$disk}"] ?? null;

            if (! $override) {
                continue;
            }

            $this->app['config']["filesystems.disks.{$disk}.url"] = $this->resolveUrlOverride($override, $tenant);
        }

        Storage::forgetDisk($this->app['config']['tenancy.filesystem.disks']);
    }

    public function revert()
    {
        parent::revert();

        foreach ($this->originalUrls as $disk => $url) {
            $this->app['config']["filesystems.disks.{$disk}.url"] = $url;
        }

        Storage::forgetDisk(array_keys($this->originalUrls));
    }

    private function resolveUrlOverride(mixed $override, Tenant $tenant): string
    {
        if ($override instanceof Closure) {
            return $override($tenant);
        }

        return str_replace(
            ['%tenant%', '%tenant_slug%'],
            [$tenant->getTenantKey(), $tenant->slug ?? $tenant->getTenantKey()],
            (string) $override,
        );
    }
}
