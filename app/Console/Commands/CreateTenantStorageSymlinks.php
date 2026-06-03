<?php

namespace App\Console\Commands;

use App\Models\Tenant;
use App\Support\Tenancy\TenantStorage;
use Illuminate\Console\Command;

class CreateTenantStorageSymlinks extends Command
{
    protected $signature = 'tenancy:create-symlinks {--force : Replace existing tenant storage directories under public/storage}';

    protected $description = 'Create storage symlinks for all existing tenants';

    public function handle(): int
    {
        $tenants = Tenant::all();

        foreach ($tenants as $tenant) {
            $created = TenantStorage::createPublicLink($tenant, (bool) $this->option('force'));

            if ($created) {
                $this->info("Storage link ready for tenant: {$tenant->slug}");

                continue;
            }

            $this->warn("Storage link skipped for tenant {$tenant->slug}: path already exists. Use --force to replace it.");
        }

        $this->info('Tenant storage link check completed. Tenant images are also served by /tenant-storage/{slug}/{path}.');

        return self::SUCCESS;
    }
}
