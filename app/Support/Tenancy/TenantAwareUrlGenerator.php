<?php

namespace App\Support\Tenancy;

use App\Models\Tenant;
use Spatie\MediaLibrary\Support\UrlGenerator\DefaultUrlGenerator;

class TenantAwareUrlGenerator extends DefaultUrlGenerator
{
    public function getUrl(): string
    {
        $diskName = $this->getDiskName();

        if ($this->shouldUseTenantStorageUrl($diskName)) {
            $path = $this->tenantPathRelativeToRoot();
            $url = TenantStorage::tenantPublicUrlForPath(tenancy()->tenant, $path);
        } elseif ($this->shouldUseCentralStorageUrl($diskName)) {
            $url = TenantStorage::centralPublicUrlForPath($this->getPathRelativeToRoot());
        } else {
            $url = $this->getDisk()->url($this->getUrlEncodedPathRelativeToRoot());
        }

        $url = $this->versionUrl($url);

        return $url;
    }

    public function getResponsiveImagesDirectoryUrl(): string
    {
        $diskName = $this->getDiskName();

        if ($this->shouldUseTenantStorageUrl($diskName)) {
            $path = $this->tenantResponsiveImagesDirectoryRelativeToRoot();
            $url = TenantStorage::tenantPublicUrlForPath(tenancy()->tenant, $path).'/';
        } elseif ($this->shouldUseCentralStorageUrl($diskName)) {
            $path = $this->pathGenerator->getPathForResponsiveImages($this->media);
            $url = TenantStorage::centralPublicUrlForPath($path).'/';
        } else {
            $url = parent::getResponsiveImagesDirectoryUrl();
        }

        return $url;
    }

    private function shouldUseTenantStorageUrl(string $diskName): bool
    {
        return in_array($diskName, ['public', 'tenant'], true)
            && function_exists('tenancy')
            && tenancy()->initialized
            && ! $this->isCentralTenantMedia();
    }

    private function shouldUseCentralStorageUrl(string $diskName): bool
    {
        return $diskName === 'public'
            && function_exists('tenancy')
            && tenancy()->initialized
            && $this->isCentralTenantMedia();
    }

    private function tenantPathRelativeToRoot(): string
    {
        $path = $this->getPathRelativeToRoot();
        $legacyPath = 'tenant-'.tenant('id').'/'.$path;

        return $this->getDisk()->exists($path) || ! $this->getDisk()->exists($legacyPath)
            ? $path
            : $legacyPath;
    }

    private function tenantResponsiveImagesDirectoryRelativeToRoot(): string
    {
        $path = $this->pathGenerator->getPathForResponsiveImages($this->media);
        $legacyPath = 'tenant-'.tenant('id').'/'.$path;

        return $this->getDisk()->exists($path) || ! $this->getDisk()->exists($legacyPath)
            ? $path
            : $legacyPath;
    }

    private function isCentralTenantMedia(): bool
    {
        $tenantMorphClass = (new Tenant)->getMorphClass();

        return in_array($this->media->model_type, [Tenant::class, $tenantMorphClass], true);
    }
}
