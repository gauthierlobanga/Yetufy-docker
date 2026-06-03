<?php

namespace App\Enums;

enum ThemePreset: string
{
    case MODERN_EMERALD = 'modern_emerald';
    case PROFESSIONAL_BLUE = 'professional_blue';
    case VIBRANT_ORANGE = 'vibrant_orange';
    case MINIMALIST_GRAY = 'minimalist_gray';
    case LUXURY_PURPLE = 'luxury_purple';
    case NATURE_GREEN = 'nature_green';
    case TECH_DARK = 'tech_dark';

    public function label(): string
    {
        return match ($this) {
            self::MODERN_EMERALD => 'Émeraude Moderne',
            self::PROFESSIONAL_BLUE => 'Bleu Professionnel',
            self::VIBRANT_ORANGE => 'Orange Vibrant',
            self::MINIMALIST_GRAY => 'Gris Minimaliste',
            self::LUXURY_PURPLE => 'Violet Luxe',
            self::NATURE_GREEN => 'Vert Nature',
            self::TECH_DARK => 'Tech Sombre',
        };
    }

    public function description(): string
    {
        return match ($this) {
            self::MODERN_EMERALD => 'Design moderne et frais avec accent émeraude',
            self::PROFESSIONAL_BLUE => 'Thème professionnel et confiant',
            self::VIBRANT_ORANGE => 'Design énergique et créatif',
            self::MINIMALIST_GRAY => 'Esthétique épurée et minimaliste',
            self::LUXURY_PURPLE => 'Design luxueux et élégant',
            self::NATURE_GREEN => 'Thème naturel et organique',
            self::TECH_DARK => 'Design technologique et moderne',
        };
    }

    public static function getPresets(): array
    {
        return [
            self::MODERN_EMERALD->value => [
                'label' => self::MODERN_EMERALD->label(),
                'description' => self::MODERN_EMERALD->description(),
                'primaryColor' => '142 76% 36%',
                'neutralColor' => '215 16% 47%',
            ],
            self::PROFESSIONAL_BLUE->value => [
                'label' => self::PROFESSIONAL_BLUE->label(),
                'description' => self::PROFESSIONAL_BLUE->description(),
                'primaryColor' => '221 83% 53%',
                'neutralColor' => '240 4% 16%',
            ],
            self::VIBRANT_ORANGE->value => [
                'label' => self::VIBRANT_ORANGE->label(),
                'description' => self::VIBRANT_ORANGE->description(),
                'primaryColor' => '24 95% 53%',
                'neutralColor' => '0 0% 45%',
            ],
            self::MINIMALIST_GRAY->value => [
                'label' => self::MINIMALIST_GRAY->label(),
                'description' => self::MINIMALIST_GRAY->description(),
                'primaryColor' => '220 14% 96%',
                'neutralColor' => '240 4% 16%',
            ],
            self::LUXURY_PURPLE->value => [
                'label' => self::LUXURY_PURPLE->label(),
                'description' => self::LUXURY_PURPLE->description(),
                'primaryColor' => '262 83% 58%',
                'neutralColor' => '0 0% 20%',
            ],
            self::NATURE_GREEN->value => [
                'label' => self::NATURE_GREEN->label(),
                'description' => self::NATURE_GREEN->description(),
                'primaryColor' => '142 72% 40%',
                'neutralColor' => '24 10% 36%',
            ],
            self::TECH_DARK->value => [
                'label' => self::TECH_DARK->label(),
                'description' => self::TECH_DARK->description(),
                'primaryColor' => '210 100% 50%',
                'neutralColor' => '240 10% 10%',
            ],
        ];
    }
}
