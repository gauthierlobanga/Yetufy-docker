<?php

namespace App\Services;

class ThemeCustomizationService
{
    /**
     * Genère une palette de couleurs cohérente à partir d'une couleur d'accent et neutre
     */
    public function generatePalette(string $accentColor, string $neutralColor): array
    {
        $accentHsl = $this->parseHsl($accentColor);
        $neutralHsl = $this->parseHsl($neutralColor);

        $primary = $accentColor;
        $primaryForeground = '0 0% 100%';

        $secondary = $this->lightenHsl($neutralHsl, 0.9);
        $secondaryForeground = $neutralColor;

        $muted = $this->lightenHsl($neutralHsl, 0.8);
        $mutedForeground = $neutralColor;

        $accent = $this->lightenHsl($accentHsl, 0.85);
        $accentForeground = $accentColor;

        $destructive = '0 84% 60%';
        $destructiveForeground = '0 0% 100%';

        $border = $neutralColor;
        $input = $neutralColor;
        $ring = $accentColor;

        $background = '0 0% 100%';
        $foreground = $neutralColor;

        $card = '0 0% 100%';
        $cardForeground = $neutralColor;

        $popover = '0 0% 100%';
        $popoverForeground = $neutralColor;

        return [
            '--background' => $background,
            '--foreground' => $foreground,
            '--card' => $card,
            '--card-foreground' => $cardForeground,
            '--popover' => $popover,
            '--popover-foreground' => $popoverForeground,
            '--primary' => $primary,
            '--primary-foreground' => $primaryForeground,
            '--secondary' => $secondary,
            '--secondary-foreground' => $secondaryForeground,
            '--muted' => $muted,
            '--muted-foreground' => $mutedForeground,
            '--accent' => $accent,
            '--accent-foreground' => $accentForeground,
            '--destructive' => $destructive,
            '--destructive-foreground' => $destructiveForeground,
            '--border' => $border,
            '--input' => $input,
            '--ring' => $ring,
        ];
    }

    /**
     * Valide les couleurs HSL
     */
    public function validateColors(array $colors): bool
    {
        $requiredKeys = [
            '--primary', '--secondary', '--accent', '--destructive',
            '--background', '--foreground', '--card', '--border', '--input', '--ring'
        ];

        foreach ($requiredKeys as $key) {
            if (! isset($colors[$key])) {
                return false;
            }

            if (! $this->isValidHsl($colors[$key])) {
                return false;
            }
        }

        return true;
    }

    /**
     * Génère une variante dark mode automatiquement
     */
    public function generateDarkModeVariant(array $colors): array
    {
        $darkVariant = [];

        foreach ($colors as $key => $value) {
            if (str_contains($key, 'foreground')) {
                // Inverser les couleurs de texte pour dark mode
                $darkVariant[$key] = $this->invertLightness($value);
            } elseif (str_contains($key, 'background') || str_contains($key, 'card') || str_contains($key, 'popover')) {
                // Rendre les backgrounds plus foncés
                $darkVariant[$key] = $this->darkenHsl($value, 0.85);
            } else {
                $darkVariant[$key] = $value;
            }
        }

        return $darkVariant;
    }

    /**
     * Applique un preset de thème
     */
    public function applyThemePreset(string $preset): array
    {
        $presets = [
            'modern_emerald' => $this->getModernEmeraldPreset(),
            'professional_blue' => $this->getProfessionalBluePreset(),
            'vibrant_orange' => $this->getVibrantOrangePreset(),
            'minimalist_gray' => $this->getMinimalistGrayPreset(),
            'luxury_purple' => $this->getLuxuryPurplePreset(),
            'nature_green' => $this->getNatureGreenPreset(),
            'tech_dark' => $this->getTechDarkPreset(),
        ];

        return $presets[$preset] ?? $this->getModernEmeraldPreset();
    }

    /**
     * Exporte un thème en JSON
     */
    public function exportTheme(array $theme): string
    {
        return json_encode($theme, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    }

    /**
     * Importe un thème depuis JSON
     */
    public function importTheme(string $json): array
    {
        $theme = json_decode($json, true);

        if (! is_array($theme) || ! $this->validateColors($theme['colors'] ?? [])) {
            throw new \Exception('Format de thème invalide');
        }

        return $theme;
    }

    /**
     * Compare deux thèmes
     */
    public function compareThemes(array $theme1, array $theme2): array
    {
        $differences = [];

        foreach ($theme1 as $key => $value) {
            if (! isset($theme2[$key]) || $theme2[$key] !== $value) {
                $differences[$key] = [
                    'old' => $value,
                    'new' => $theme2[$key] ?? null,
                ];
            }
        }

        return $differences;
    }

    /**
     * Calcule le contraste WCAG entre deux couleurs
     */
    public function getContrastRatio(string $color1Hsl, string $color2Hsl): float
    {
        $lum1 = $this->getRelativeLuminance($color1Hsl);
        $lum2 = $this->getRelativeLuminance($color2Hsl);

        $lighter = max($lum1, $lum2);
        $darker = min($lum1, $lum2);

        return ($lighter + 0.05) / ($darker + 0.05);
    }

    /**
     * Valide si le contraste est WCAG AA
     */
    public function isWcagAACompliant(string $color1Hsl, string $color2Hsl, bool $large = false): bool
    {
        $ratio = $this->getContrastRatio($color1Hsl, $color2Hsl);

        return $large ? $ratio >= 3 : $ratio >= 4.5;
    }

    /**
     * Valide si le contraste est WCAG AAA
     */
    public function isWcagAAACompliant(string $color1Hsl, string $color2Hsl, bool $large = false): bool
    {
        $ratio = $this->getContrastRatio($color1Hsl, $color2Hsl);

        return $large ? $ratio >= 4.5 : $ratio >= 7;
    }

    // ============= Private Helpers =============

    private function parseHsl(string $hsl): array
    {
        preg_match('/([\d.]+)\s+([\d.]+)%\s+([\d.]+)%/', $hsl, $matches);

        return [
            'h' => (float) $matches[1] ?? 0,
            's' => (float) $matches[2] ?? 0,
            'l' => (float) $matches[3] ?? 0,
        ];
    }

    private function isValidHsl(string $hsl): bool
    {
        return preg_match('/^\d+(\.\d+)?\s+\d+(\.\d+)?%\s+\d+(\.\d+)?%$/', $hsl) === 1;
    }

    private function lightenHsl(array $hsl, float $factor): string
    {
        $l = min(100, $hsl['l'] + (100 - $hsl['l']) * $factor);

        return "{$hsl['h']} {$hsl['s']}% {$l}%";
    }

    private function darkenHsl(string $hsl, float $factor): string
    {
        $parsed = $this->parseHsl($hsl);
        $l = max(0, $parsed['l'] * $factor);

        return "{$parsed['h']} {$parsed['s']}% {$l}%";
    }

    private function invertLightness(string $hsl): string
    {
        $parsed = $this->parseHsl($hsl);
        $l = 100 - $parsed['l'];

        return "{$parsed['h']} {$parsed['s']}% {$l}%";
    }

    private function getRelativeLuminance(string $hsl): float
    {
        $parsed = $this->parseHsl($hsl);
        $h = $parsed['h'];
        $s = $parsed['s'];
        $l = $parsed['l'];

        $c = (1 - abs(2 * ($l / 100) - 1)) * ($s / 100);
        $hp = $h / 60;
        $x = $c * (1 - abs(fmod($hp, 2) - 1));

        $r = $g = $b = 0;

        if ($hp >= 0 && $hp < 1) {
            $r = $c; $g = $x; $b = 0;
        } elseif ($hp >= 1 && $hp < 2) {
            $r = $x; $g = $c; $b = 0;
        } elseif ($hp >= 2 && $hp < 3) {
            $r = 0; $g = $c; $b = $x;
        } elseif ($hp >= 3 && $hp < 4) {
            $r = 0; $g = $x; $b = $c;
        } elseif ($hp >= 4 && $hp < 5) {
            $r = $x; $g = 0; $b = $c;
        } else {
            $r = $c; $g = 0; $b = $x;
        }

        $m = ($l / 100) - ($c / 2);
        $r = ($r + $m);
        $g = ($g + $m);
        $b = ($b + $m);

        return $this->linearize($r) * 0.2126 + $this->linearize($g) * 0.7152 + $this->linearize($b) * 0.0722;
    }

    private function linearize(float $value): float
    {
        return $value <= 0.03928 ? $value / 12.92 : pow(($value + 0.055) / 1.055, 2.4);
    }

    // ============= Presets =============

    private function getModernEmeraldPreset(): array
    {
        return [
            'preset' => 'modern_emerald',
            'colors' => $this->generatePalette('142 76% 36%', '215 16% 47%'),
            'typography' => [
                'font_family' => 'Inter',
                'heading_size' => '1.25',
                'body_size' => '1',
                'line_height' => '1.5',
            ],
            'spacing' => [
                'radius_sm' => '0.375rem',
                'radius_md' => '0.5rem',
                'radius_lg' => '1rem',
            ],
        ];
    }

    private function getProfessionalBluePreset(): array
    {
        return [
            'preset' => 'professional_blue',
            'colors' => $this->generatePalette('221 83% 53%', '240 4% 16%'),
            'typography' => [
                'font_family' => 'Poppins',
                'heading_size' => '1.35',
                'body_size' => '1',
                'line_height' => '1.6',
            ],
            'spacing' => [
                'radius_sm' => '0.5rem',
                'radius_md' => '0.75rem',
                'radius_lg' => '1.25rem',
            ],
        ];
    }

    private function getVibrantOrangePreset(): array
    {
        return [
            'preset' => 'vibrant_orange',
            'colors' => $this->generatePalette('24 95% 53%', '0 0% 45%'),
            'typography' => [
                'font_family' => 'Poppins',
                'heading_size' => '1.4',
                'body_size' => '1',
                'line_height' => '1.5',
            ],
            'spacing' => [
                'radius_sm' => '0.375rem',
                'radius_md' => '0.5rem',
                'radius_lg' => '0.875rem',
            ],
        ];
    }

    private function getMinimalistGrayPreset(): array
    {
        return [
            'preset' => 'minimalist_gray',
            'colors' => $this->generatePalette('220 14% 96%', '240 4% 16%'),
            'typography' => [
                'font_family' => 'Inter',
                'heading_size' => '1.2',
                'body_size' => '0.95',
                'line_height' => '1.6',
            ],
            'spacing' => [
                'radius_sm' => '0.25rem',
                'radius_md' => '0.375rem',
                'radius_lg' => '0.5rem',
            ],
        ];
    }

    private function getLuxuryPurplePreset(): array
    {
        return [
            'preset' => 'luxury_purple',
            'colors' => $this->generatePalette('262 83% 58%', '0 0% 20%'),
            'typography' => [
                'font_family' => 'Playfair Display',
                'heading_size' => '1.5',
                'body_size' => '1.05',
                'line_height' => '1.7',
            ],
            'spacing' => [
                'radius_sm' => '0.5rem',
                'radius_md' => '0.75rem',
                'radius_lg' => '1.5rem',
            ],
        ];
    }

    private function getNatureGreenPreset(): array
    {
        return [
            'preset' => 'nature_green',
            'colors' => $this->generatePalette('142 72% 40%', '24 10% 36%'),
            'typography' => [
                'font_family' => 'Quicksand',
                'heading_size' => '1.3',
                'body_size' => '1',
                'line_height' => '1.6',
            ],
            'spacing' => [
                'radius_sm' => '0.5rem',
                'radius_md' => '0.75rem',
                'radius_lg' => '1.25rem',
            ],
        ];
    }

    private function getTechDarkPreset(): array
    {
        return [
            'preset' => 'tech_dark',
            'colors' => $this->generatePalette('210 100% 50%', '240 10% 10%'),
            'typography' => [
                'font_family' => 'JetBrains Mono',
                'heading_size' => '1.3',
                'body_size' => '0.95',
                'line_height' => '1.5',
            ],
            'spacing' => [
                'radius_sm' => '0.25rem',
                'radius_md' => '0.375rem',
                'radius_lg' => '0.75rem',
            ],
        ];
    }
}
