<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Setting extends Model implements HasMedia
{
    use InteractsWithMedia;

    protected $fillable = ['group', 'name', 'locked', 'payload'];

    protected $casts = [
        'payload' => 'array',
        'locked'  => 'boolean',
    ];

    // Méthodes statiques get/set
    public static function getValue(string $group, string $name, $default = null)
    {
        $record = static::where('group', $group)->where('name', $name)->first();
        if (!$record) return $default;
        return $record->payload['value'] ?? $default;
    }

    public static function setValue(string $group, string $name, $value): self
    {
        return static::updateOrCreate(
            ['group' => $group, 'name' => $name],
            ['payload' => ['value' => $value]]
        );
    }

    // Méthode d'accès au logo via Spatie
    public function getLogoUrlAttribute(): ?string
    {
        return $this->getFirstMediaUrl('app_logo');
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('app_logo')
            ->singleFile()
            ->disk('public')
            ->acceptsMimeTypes(['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']);
    }

    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('thumb')
            ->width(200)
            ->height(200)
            ->sharpen(10)
            ->nonQueued();
    }
}
