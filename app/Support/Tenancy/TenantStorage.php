<?php

namespace App\Support\Tenancy;

use App\Models\Tenant;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class TenantStorage
{
    public static function storageDirectory(Tenant $tenant): string
    {
        return config('tenancy.filesystem.suffix_base', 'tenant').$tenant->getTenantKey();
    }

    public static function publicDiskRoot(Tenant $tenant): string
    {
        return base_path('storage/'.self::storageDirectory($tenant).'/app/public');
    }

    public static function publicLinkPath(Tenant $tenant): string
    {
        return public_path('storage/tenant-'.$tenant->slug);
    }

    public static function tenantPublicUrl(Tenant $tenant): string
    {
        return '/tenant-storage/'.rawurlencode($tenant->slug);
    }

    public static function tenantPublicUrlForPath(Tenant $tenant, string $path): string
    {
        return self::tenantPublicUrl($tenant).'/'.self::encodePath($path);
    }

    public static function centralPublicUrlForPath(string $path): string
    {
        return '/storage/'.self::encodePath($path);
    }

    public static function normalizePath(string $path): ?string
    {
        $path = str_replace('\\', '/', $path);
        $path = ltrim($path, '/');

        if ($path === '' || str_contains($path, "\0")) {
            return null;
        }

        $segments = [];

        foreach (explode('/', $path) as $segment) {
            if ($segment === '' || $segment === '.') {
                continue;
            }

            if ($segment === '..') {
                return null;
            }

            $segments[] = $segment;
        }

        return $segments === [] ? null : implode('/', $segments);
    }

    public static function response(Tenant $tenant, string $path): BinaryFileResponse
    {
        $path = self::normalizePath($path);

        abort_if($path === null, 404);

        if (! function_exists('tenancy') || ! tenancy()->initialized || tenant('id') !== $tenant->getTenantKey()) {
            tenancy()->initialize($tenant);
        }

        $disk = Storage::disk('public');

        abort_unless($disk->exists($path), 404);

        $headers = [];
        $mimeType = $disk->mimeType($path);

        if ($mimeType) {
            $headers['Content-Type'] = $mimeType;
        }

        return response()->file($disk->path($path), $headers);
    }

    public static function ensurePublicDirectory(Tenant $tenant): void
    {
        File::ensureDirectoryExists(self::publicDiskRoot($tenant), 0755, true);
    }

    public static function createPublicLink(Tenant $tenant, bool $replace = false): bool
    {
        self::ensurePublicDirectory($tenant);

        $link = self::publicLinkPath($tenant);
        $target = self::publicDiskRoot($tenant);

        File::ensureDirectoryExists(dirname($link), 0755, true);

        if (is_link($link) || self::isWindowsJunction($link) || self::pointsToTarget($link, $target)) {
            self::removeLinkOrJunction($link);
        } elseif (File::exists($link)) {
            if (! $replace) {
                return false;
            }

            File::isDirectory($link)
                ? File::deleteDirectory($link)
                : File::delete($link);
        }

        if (PHP_OS_FAMILY === 'Windows') {
            return self::createWindowsJunction($link, $target);
        }

        return symlink($target, $link);
    }

    private static function encodePath(string $path): string
    {
        $path = self::normalizePath($path) ?? '';

        return implode('/', array_map(rawurlencode(...), explode('/', $path)));
    }

    private static function createWindowsJunction(string $link, string $target): bool
    {
        $command = 'cmd /C mklink /J '.escapeshellarg($link).' '.escapeshellarg($target);

        exec($command, $output, $exitCode);

        return $exitCode === 0;
    }

    private static function isWindowsJunction(string $path): bool
    {
        return PHP_OS_FAMILY === 'Windows'
            && File::isDirectory($path)
            && (bool) @readlink($path);
    }

    private static function pointsToTarget(string $link, string $target): bool
    {
        $linkRealPath = realpath($link);
        $targetRealPath = realpath($target);

        if ($linkRealPath === false || $targetRealPath === false) {
            return false;
        }

        $linkRealPath = str_replace('\\', '/', $linkRealPath);
        $targetRealPath = str_replace('\\', '/', $targetRealPath);

        if (PHP_OS_FAMILY === 'Windows') {
            $linkRealPath = strtolower($linkRealPath);
            $targetRealPath = strtolower($targetRealPath);
        }

        return $linkRealPath === $targetRealPath;
    }

    private static function removeLinkOrJunction(string $path): void
    {
        if (is_link($path)) {
            @unlink($path);

            return;
        }

        @rmdir($path);
    }
}
