<?php

namespace App\Services;

class ThemeHistoryService
{
    private const MAX_HISTORY = 10;

    /**
     * Ajoute un thème à l'historique
     */
    public function addToHistory(array &$configuration, array $newTheme): void
    {
        $history = $configuration['theme_history'] ?? [];

        if (! is_array($history)) {
            $history = [];
        }

        // Garder seulement les derniers MAX_HISTORY thèmes
        if (count($history) >= self::MAX_HISTORY) {
            array_shift($history);
        }

        // Ajouter le nouveau thème avec métadonnées
        $history[] = [
            'theme' => $newTheme,
            'timestamp' => now()->toIso8601String(),
            'version' => count($history) + 1,
        ];

        $configuration['theme_history'] = $history;
    }

    /**
     * Récupère l'historique complet
     */
    public function getHistory(array $configuration): array
    {
        $history = $configuration['theme_history'] ?? [];

        return is_array($history) ? $history : [];
    }

    /**
     * Récupère une version spécifique
     */
    public function getVersion(array $configuration, int $version): ?array
    {
        $history = $this->getHistory($configuration);

        foreach ($history as $entry) {
            if (isset($entry['version']) && $entry['version'] === $version) {
                return $entry['theme'];
            }
        }

        return null;
    }

    /**
     * Revient à une version précédente
     */
    public function revertToVersion(array &$configuration, int $version): ?array
    {
        $theme = $this->getVersion($configuration, $version);

        if (! $theme) {
            return null;
        }

        // Mettre à jour le thème actuel
        $configuration['theme'] = $theme;

        return $theme;
    }

    /**
     * Efface l'historique
     */
    public function clearHistory(array &$configuration): void
    {
        $configuration['theme_history'] = [];
    }

    /**
     * Récupère le nombre d'entrées d'historique
     */
    public function getHistoryCount(array $configuration): int
    {
        return count($this->getHistory($configuration));
    }

    /**
     * Récupère le dernier thème enregistré (avant le courant)
     */
    public function getLastTheme(array $configuration): ?array
    {
        $history = $this->getHistory($configuration);

        if (empty($history)) {
            return null;
        }

        $lastEntry = end($history);

        return $lastEntry['theme'] ?? null;
    }
}
