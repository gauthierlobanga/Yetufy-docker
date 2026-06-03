<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PublicStorageController extends Controller
{
    /**
     * Servir un fichier du disque public de manière sécurisée.
     */
    public function show(Request $request, string $path = '')
    {
        // Nettoyer le chemin : refuser les retours en arrière et les chemins absolus
        if (str_contains($path, '..') || str_starts_with($path, '/')) {
            abort(403, 'Chemin interdit.');
        }

        // Vérifier que le fichier existe sur le disque 'public'
        $disk = Storage::disk('public');
        if (!$disk->exists($path)) {
            abort(404, 'Fichier introuvable.');
        }

        // Récupérer le chemin absolu réel (sécurisé contre les liens symboliques malveillants)
        $fullPath = $disk->path($path);
        $realPath = realpath($fullPath);

        // Vérifier que le fichier résolu est bien dans le répertoire attendu
        $storageReal = realpath(storage_path('app/public'));
        if (!$realPath || !str_starts_with($realPath, $storageReal)) {
            abort(403, 'Accès non autorisé.');
        }

        return response()->file($realPath, [
            'Cache-Control' => 'public, max-age=31536000, immutable',
        ]);
    }
}
