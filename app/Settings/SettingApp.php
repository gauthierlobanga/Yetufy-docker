<?php

namespace App\Settings;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Spatie\LaravelSettings\Settings;

class SettingApp extends Settings
{
    public string $name;

    public ?string $logo_url = null;

    public function logoUrl(): ?string
    {
        return static::publicLogoUrl($this->logo_url);
    }

    public static function publicLogoUrl(?string $value): ?string
    {
        $path = static::normalizeLogoPath($value);

        if (blank($path)) {
            return null;
        }

        if (Str::startsWith($path, ['http://', 'https://'])) {
            return $path;
        }

        return Storage::disk('public')->url($path);
    }

    public static function normalizeLogoPath(?string $value): ?string
    {
        if (blank($value)) {
            return null;
        }

        $value = trim($value);

        if (Str::startsWith($value, ['http://', 'https://'])) {
            $path = parse_url($value, PHP_URL_PATH);

            if (is_string($path) && Str::startsWith($path, '/storage/')) {
                return ltrim(Str::after($path, '/storage/'), '/');
            }

            return $value;
        }

        $value = ltrim($value, '/');

        if (Str::startsWith($value, 'storage/')) {
            return ltrim(Str::after($value, 'storage/'), '/');
        }

        return $value;
    }

    public static function group(): string
    {
        return 'app';
    }
}
