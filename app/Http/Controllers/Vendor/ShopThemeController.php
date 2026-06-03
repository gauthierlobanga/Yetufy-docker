<?php

namespace App\Http\Controllers\Vendor;

use App\Enums\ThemePreset;
use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateShopThemeRequest;
use App\Services\ThemeCustomizationService;
use App\Services\ThemeHistoryService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ShopThemeController extends Controller
{
    public function __construct(
        private ThemeCustomizationService $themeService,
        private ThemeHistoryService $historyService
    ) {}

    /**
     * Récupère le thème actuel avec les defaults et l'historique
     */
    public function show()
    {
        if (! function_exists('tenant') || ! tenant()) {
            return response()->json(['error' => 'Tenant non trouvé'], 404);
        }

        $tenant = tenant();
        $theme = $tenant->theme() ?? \App\Models\Tenant::getThemeDefaults();
        $history = $this->historyService->getHistory($tenant->configuration ?? []);

        return response()->json([
            'current' => $theme,
            'defaults' => \App\Models\Tenant::getThemeDefaults(),
            'presets' => ThemePreset::getPresets(),
            'history' => $history,
            'history_count' => count($history),
        ]);
    }

    /**
     * Met à jour le thème du tenant
     */
    public function update(UpdateShopThemeRequest $request)
    {
        $tenant = tenant();
        if (! $tenant) {
            return response()->json(['error' => 'Tenant non trouvé'], 404);
        }

        $validated = $request->validated();

        // Valider les couleurs
        if (! $this->themeService->validateColors($validated['colors'])) {
            return response()->json(['error' => 'Couleurs invalides'], 422);
        }

        // Construire le thème complet
        $theme = [
            'preset' => $validated['preset'] ?? 'custom',
            'colors' => $validated['colors'],
            'typography' => $validated['typography'] ?? \App\Models\Tenant::getThemeDefaults()['typography'],
            'spacing' => $validated['spacing'] ?? \App\Models\Tenant::getThemeDefaults()['spacing'],
            'dark_mode' => $validated['dark_mode'] ?? null,
            'metadata' => [
                'updated_at' => now()->toIso8601String(),
                'version' => ($tenant->configuration['theme']['metadata']['version'] ?? 0) + 1,
            ],
        ];

        // Ajouter à l'historique avant la sauvegarde
        $config = $tenant->configuration ?? [];
        $this->historyService->addToHistory($config, $tenant->theme() ?? \App\Models\Tenant::getThemeDefaults());
        $tenant->configuration = $config;

        // Sauvegarder
        $tenant->updateTheme($theme);

        return response()->json([
            'success' => true,
            'theme' => $theme,
            'message' => 'Thème mis à jour avec succès',
        ]);
    }

    /**
     * Applique un preset
     */
    public function applyPreset(string $preset)
    {
        $tenant = tenant();
        if (! $tenant) {
            return response()->json(['error' => 'Tenant non trouvé'], 404);
        }

        try {
            $theme = $this->themeService->applyThemePreset($preset);
            $theme['preset'] = $preset;
            $theme['metadata'] = [
                'updated_at' => now()->toIso8601String(),
                'version' => ($tenant->configuration['theme']['metadata']['version'] ?? 0) + 1,
            ];

            // Ajouter à l'historique
            $config = $tenant->configuration ?? [];
            $this->historyService->addToHistory($config, $tenant->theme() ?? \App\Models\Tenant::getThemeDefaults());
            $tenant->configuration = $config;

            $tenant->updateTheme($theme);

            return response()->json([
                'success' => true,
                'theme' => $theme,
                'message' => "Preset '{$preset}' appliqué avec succès",
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Preset invalide'], 422);
        }
    }

    /**
     * Revient à une version précédente
     */
    public function revert(int $version)
    {
        $tenant = tenant();
        if (! $tenant) {
            return response()->json(['error' => 'Tenant non trouvé'], 404);
        }

        $config = $tenant->configuration ?? [];
        $theme = $this->historyService->revertToVersion($config, $version);

        if (! $theme) {
            return response()->json(['error' => 'Version non trouvée'], 404);
        }

        $tenant->configuration = $config;
        $tenant->save();

        return response()->json([
            'success' => true,
            'theme' => $theme,
            'message' => "Thème restauré à la version {$version}",
        ]);
    }

    /**
     * Exporte le thème actuel en JSON
     */
    public function export()
    {
        $tenant = tenant();
        if (! $tenant) {
            return response()->json(['error' => 'Tenant non trouvé'], 404);
        }

        $theme = $tenant->theme() ?? \App\Models\Tenant::getThemeDefaults();
        $json = $this->themeService->exportTheme($theme);

        return response()
            ->streamDownload(
                function () use ($json) {
                    echo $json;
                },
                "theme-{$tenant->slug}-" . now()->format('Y-m-d') . '.json',
                ['Content-Type' => 'application/json']
            );
    }

    /**
     * Importe un thème depuis un fichier JSON
     */
    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:json|max:1024',
        ]);

        $tenant = tenant();
        if (! $tenant) {
            return response()->json(['error' => 'Tenant non trouvé'], 404);
        }

        try {
            $json = file_get_contents($request->file('file')->getRealPath());
            $theme = $this->themeService->importTheme($json);

            $theme['preset'] = 'imported';
            $theme['metadata'] = [
                'updated_at' => now()->toIso8601String(),
                'version' => ($tenant->configuration['theme']['metadata']['version'] ?? 0) + 1,
                'imported_from' => $request->file('file')->getClientOriginalName(),
            ];

            // Ajouter à l'historique
            $config = $tenant->configuration ?? [];
            $this->historyService->addToHistory($config, $tenant->theme() ?? \App\Models\Tenant::getThemeDefaults());
            $tenant->configuration = $config;

            $tenant->updateTheme($theme);

            return response()->json([
                'success' => true,
                'theme' => $theme,
                'message' => 'Thème importé avec succès',
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erreur lors de l\'import: ' . $e->getMessage()], 422);
        }
    }

    /**
     * Compare deux thèmes
     */
    public function compare(Request $request)
    {
        $request->validate([
            'version1' => 'nullable|integer',
            'version2' => 'nullable|integer',
        ]);

        $tenant = tenant();
        if (! $tenant) {
            return response()->json(['error' => 'Tenant non trouvé'], 404);
        }

        $config = $tenant->configuration ?? [];
        $history = $this->historyService->getHistory($config);

        $theme1 = $request->input('version1')
            ? $this->historyService->getVersion($config, $request->input('version1'))
            : $tenant->theme();

        $theme2 = $request->input('version2')
            ? $this->historyService->getVersion($config, $request->input('version2'))
            : \App\Models\Tenant::getThemeDefaults();

        if (! $theme1 || ! $theme2) {
            return response()->json(['error' => 'Thèmes non trouvés'], 404);
        }

        $differences = $this->themeService->compareThemes($theme1, $theme2);

        return response()->json([
            'success' => true,
            'theme1' => $theme1,
            'theme2' => $theme2,
            'differences' => $differences,
        ]);
    }

    /**
     * Récupère l'historique du thème
     */
    public function history()
    {
        $tenant = tenant();
        if (! $tenant) {
            return response()->json(['error' => 'Tenant non trouvé'], 404);
        }

        $config = $tenant->configuration ?? [];
        $history = $this->historyService->getHistory($config);

        return response()->json([
            'success' => true,
            'history' => $history,
            'total' => count($history),
        ]);
    }

    /**
     * Réinitialise au thème par défaut
     */
    public function reset()
    {
        $tenant = tenant();
        if (! $tenant) {
            return response()->json(['error' => 'Tenant non trouvé'], 404);
        }

        // Ajouter à l'historique
        $config = $tenant->configuration ?? [];
        $this->historyService->addToHistory($config, $tenant->theme() ?? \App\Models\Tenant::getThemeDefaults());
        $tenant->configuration = $config;

        $tenant->resetTheme();

        return response()->json([
            'success' => true,
            'theme' => $tenant->theme(),
            'message' => 'Thème réinitialisé aux paramètres par défaut',
        ]);
    }
}
