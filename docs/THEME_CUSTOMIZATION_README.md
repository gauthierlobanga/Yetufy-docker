# Système de Personnalisation de Thème - Documentation

## 📋 Vue d'ensemble

Le système de personnalisation de thème permet aux tenants de personnaliser complètement l'apparence de leur boutique en ligne avec:

- **7 presets professionnels** prêts à l'emploi
- **Contrôles avancés** de couleurs (HSL/RGB)
- **Typographie personnalisable** (police, taille, hauteur de ligne)
- **Espacement configurable** (border-radius)
- **Support du mode sombre**
- **Historique complet** avec possibilité de revert
- **Export/Import JSON** pour partager les thèmes
- **Validation WCAG** des contrastes
- **Aperçu en direct** des changements

## 🏗️ Architecture

### Backend (Laravel)

#### Services
- **ThemeCustomizationService** - Logique métier de personnalisation
  - `generatePalette()` - Génère une palette cohérente
  - `validateColors()` - Valide le format HSL
  - `applyThemePreset()` - Applique un preset
  - `generateDarkModeVariant()` - Génère dark mode auto
  - `getContrastRatio()` - Calcule le contraste WCAG
  - `exportTheme()` / `importTheme()` - Export/import JSON
  - `compareThemes()` - Compare deux thèmes

- **ThemeHistoryService** - Gestion de l'historique
  - `addToHistory()` - Ajoute une version
  - `getHistory()` - Récupère l'historique
  - `revertToVersion()` - Revient à une version
  - Max 10 versions précédentes

#### Models
- **Tenant** - Modèle enrichi
  - `theme()` - Accesseur pour le thème actuel
  - `updateTheme(array)` - Mutateur pour sauvegarder
  - `resetTheme()` - Réinitialise au thème par défaut
  - `getThemeDefaults()` - Récupère les valeurs par défaut

#### Controllers
- **ShopThemeController** - API pour la gestion du thème
  - `GET /api/theme` - Récupère le thème actuel + presets
  - `POST /api/theme` - Met à jour le thème
  - `POST /api/theme/preset/{preset}` - Applique un preset
  - `POST /api/theme/revert/{version}` - Revient à une version
  - `GET /api/theme/export` - Télécharge JSON
  - `POST /api/theme/import` - Importe depuis JSON
  - `GET /api/theme/history` - Récupère l'historique
  - `POST /api/theme/reset` - Réinitialise

#### Validation
- **UpdateShopThemeRequest** - Valide les données
  - Validation des couleurs (format HSL)
  - Validation des typographies
  - Validation des presets

#### Enums
- **ThemePreset** - 7 presets professionnels
  - Modern Emerald
  - Professional Blue
  - Vibrant Orange
  - Minimalist Gray
  - Luxury Purple
  - Nature Green
  - Tech Dark

### Frontend (React)

#### Composants
1. **ShopThemeCustomizer** - Composant principal
   - Interface complète avec onglets
   - Gestion des presets
   - Édition des couleurs
   - Aperçu en direct
   - Historique
   - Export/Import
   - Export/Import

2. **PresetGallery** - Galerie des presets
   - Affichage visuel des presets
   - Miniatures de couleurs
   - Descriptions
   - Aperçu avant/après

3. **ColorPicker** - Sélecteur de couleur avancé
   - Sliders HSL (Teinte, Saturation, Luminosité)
   - Couleurs rapides prédéfinies
   - Copie vers presse-papiers
   - Aperçu en direct

4. **ThemePreviewPanel** - Aperçu des composants
   - Boutons (primaire, secondaire, danger)
   - Badges et tags
   - Alertes (succès, info, erreur)
   - Cartes
   - Formulaires
   - Tous les éléments avec les couleurs du thème

## 📊 Structure des Données

### Schéma du Thème (stocké dans `tenants.configuration['theme']`)

```json
{
  "preset": "modern_emerald",
  "colors": {
    "--primary": "142 76% 36%",
    "--primary-foreground": "0 0% 100%",
    "--secondary": "215 16% 91%",
    "--secondary-foreground": "215 16% 47%",
    "--accent": "142 76% 85%",
    "--accent-foreground": "142 76% 36%",
    "--destructive": "0 84% 60%",
    "--destructive-foreground": "0 0% 100%",
    "--background": "0 0% 100%",
    "--foreground": "215 16% 47%",
    "--card": "0 0% 100%",
    "--card-foreground": "215 16% 47%",
    "--border": "215 16% 47%",
    "--input": "215 16% 47%",
    "--ring": "142 76% 36%",
    "--muted": "215 16% 80%",
    "--muted-foreground": "215 16% 47%",
    "--popover": "0 0% 100%",
    "--popover-foreground": "215 16% 47%"
  },
  "typography": {
    "font_family": "Inter",
    "heading_size": 1.25,
    "body_size": 1,
    "line_height": 1.5
  },
  "spacing": {
    "radius_sm": "0.375rem",
    "radius_md": "0.5rem",
    "radius_lg": "1rem"
  },
  "dark_mode": {
    "enabled": true,
    "colors": { /* ... */ }
  },
  "metadata": {
    "updated_at": "2026-06-02T...",
    "version": 1
  }
}
```

### Historique (stocké dans `tenants.configuration['theme_history']`)

```json
[
  {
    "theme": { /* ... thème complet ... */ },
    "timestamp": "2026-06-02T10:00:00Z",
    "version": 1
  },
  {
    "theme": { /* ... */ },
    "timestamp": "2026-06-02T11:30:00Z",
    "version": 2
  }
]
```

## 🚀 Utilisation

### Pour les développeurs

#### Accéder au thème actuel du tenant

```php
$tenant = tenant();
$theme = $tenant->theme(); // Récupère le thème actuel
```

#### Mise à jour du thème

```php
$theme = [
    'preset' => 'custom',
    'colors' => [ /* ... */ ],
    'typography' => [ /* ... */ ],
    'spacing' => [ /* ... */ ],
];

$tenant->updateTheme($theme);
```

#### Réinitialiser au thème par défaut

```php
$tenant->resetTheme();
```

#### Utiliser le service de personnalisation

```php
$service = app(ThemeCustomizationService::class);

// Générer une palette cohérente
$palette = $service->generatePalette('142 76% 36%', '215 16% 47%');

// Valider les couleurs
$valid = $service->validateColors($colors);

// Générer dark mode
$darkMode = $service->generateDarkModeVariant($colors);

// Appliquer un preset
$theme = $service->applyThemePreset('professional_blue');

// Vérifier le contraste WCAG
$ratio = $service->getContrastRatio('142 76% 36%', '0 0% 100%');
$isAACompliant = $service->isWcagAACompliant('142 76% 36%', '0 0% 100%');
```

### Pour les utilisateurs (Tenants)

1. **Accès au personnalisateur**
   - Cliquer le bouton 🎨 en haut à droite du header
   - Utiliser le formulaire "Personnaliser ma boutique"

2. **Appliquer un preset**
   - Aller à l'onglet "🎨 Presets"
   - Cliquer sur un preset pour le prévisualiser
   - Cliquer "Appliquer le thème" pour valider

3. **Personnalisation avancée**
   - Aller à l'onglet "🌈 Couleurs"
   - Utiliser les sliders HSL pour chaque couleur
   - Utiliser les couleurs rapides prédéfinies
   - L'aperçu se met à jour en temps réel

4. **Aperçu**
   - Aller à l'onglet "👁️ Aperçu"
   - Voir comment tous les composants s'affichent
   - Vérifier le contraste et la lisibilité

5. **Historique**
   - Aller à l'onglet "⏱️ Historique"
   - Voir toutes les versions précédentes
   - Cliquer sur une version pour la restaurer

6. **Export/Import**
   - Cliquer "Exporter" pour télécharger le thème en JSON
   - Cliquer "Importer" pour charger un thème depuis un fichier
   - Cliquer "Réinitialiser" pour revenir au thème par défaut

## 🎨 Format HSL

Les couleurs sont stockées en format HSL (Hue, Saturation, Lightness):

```
H S% L%
```

Exemple: `142 76% 36%` (Émeraude)

- **H (Teinte)** : 0-360 (0°=rouge, 120°=vert, 240°=bleu)
- **S (Saturation)** : 0-100% (0%=gris, 100%=couleur pure)
- **L (Luminosité)** : 0-100% (0%=noir, 50%=couleur normale, 100%=blanc)

## ✅ Validation WCAG

Le système valide automatiquement les contrastes selon les normes WCAG:

- **AA Normal**: Ratio ≥ 4.5:1 (pour texte normal)
- **AA Large**: Ratio ≥ 3:1 (pour texte large 18pt+)
- **AAA Normal**: Ratio ≥ 7:1 (pour texte normal)
- **AAA Large**: Ratio ≥ 4.5:1 (pour texte large 18pt+)

## 📦 Presets Disponibles

### 1. **Modern Emerald** (Défaut)
- Primaire: Émeraude #10b981
- Neutre: Ardoise gris
- Parfait pour: Boutiques modernes, produits naturels

### 2. **Professional Blue**
- Primaire: Bleu professionnel #3b82f6
- Neutre: Noir/gris foncé
- Parfait pour: Services professionnels, B2B

### 3. **Vibrant Orange**
- Primaire: Orange vibrant #f97316
- Neutre: Gris neutre
- Parfait pour: Créativité, énergie, jeunesse

### 4. **Minimalist Gray**
- Primaire: Gris clair
- Neutre: Noir/gris foncé
- Parfait pour: Design épuré, minimalisme

### 5. **Luxury Purple**
- Primaire: Violet luxe #8b5cf6
- Neutre: Noir très foncé
- Parfait pour: Premium, luxe, élégance

### 6. **Nature Green**
- Primaire: Vert nature #16a34a
- Neutre: Pierre brun
- Parfait pour: Écologie, bien-être, naturel

### 7. **Tech Dark**
- Primaire: Cyan tech #06b6d4
- Neutre: Noir pur
- Parfait pour: Technologie, innovation, moderne

## 🔐 Sécurité

- ✅ Validation stricte des couleurs (format HSL)
- ✅ Restriction des polices (liste blanche)
- ✅ Validation WCAG des contrastes
- ✅ Limité à 10 versions d'historique
- ✅ Authentification requise
- ✅ Propriétaire du tenant requis

## 📱 Responsive

- ✅ Mobile-first design
- ✅ Adapté aux petits écrans
- ✅ Tabs onglets adaptatifs
- ✅ Sliders tactiles
- ✅ Gallerie responsive

## 🚄 Performance

- Stockage dans JSONB (PostgreSQL)
- Pas de migration supplémentaire
- Historique limité (max 10 versions)
- Cache des presets (enum)
- Pas de requêtes N+1

## 📝 TODO - Améliorations futures

- [ ] Gradient support pour les couleurs
- [ ] Shadow customization
- [ ] Font upload custom
- [ ] Preset sharing entre tenants
- [ ] Preview live on actual shop
- [ ] Color harmony suggestions
- [ ] A/B testing de thèmes
- [ ] Analytics sur les changements
- [ ] Undo/Redo UX amélioré
- [ ] Accessibility checker avancé

## 🐛 Debugging

### Logs
Les changements de thème sont loggés dans les logs Laravel standard.

### Historique manquant
L'historique est stocké dans `configuration['theme_history']`. Vérifier que la colonne JSON est bien supportée.

### Thème non appliqué
- Vérifier que le tenant a bien la configuration `theme`
- Vérifier que les CSS variables sont bien appliquées
- Vérifier que le page reload s'est bien effectué

## 📞 Support

Pour les problèmes:
1. Vérifier la console du navigateur (erreurs JavaScript)
2. Vérifier les logs Laravel (`storage/logs`)
3. Vérifier la base de données (colonne `configuration`)
4. Tester avec un preset par défaut

---

**Créé**: 2026-06-02  
**Dernière mise à jour**: 2026-06-02  
**Versio**: 1.0.0  
**Auteur**: Système de Personnalisation de Thème
