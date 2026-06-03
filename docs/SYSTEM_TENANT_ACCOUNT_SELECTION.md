# Système de Sélection de Compte Tenant - Documentation Complète

## 📋 Vue d'ensemble

Système unifié permettant aux vendeurs authentifiés de:

- **Voir tous leurs comptes/boutiques** en un seul endroit
- **Accéder directement** au dashboard d'une boutique
- **Créer une nouvelle boutique** facilement sans perte de session
- **Gérer plusieurs boutiques** depuis le même compte

## 🔄 Flux utilisateur complet

```
 ┌────────────────────────────────────────┐
 │           USER SE CONNECTE             │
 └───────────────────┬────────────────────┘
                     │
        ┌────────────┴──────────────┐
        │  RedirectVendorAfterLogin |
        │      (middleware)         |
        └────────────┬──────────────┘
                     │
        ┌────────────▼──────────────┐
        │     /selection-compte     |
        │    (account-selection)    |
        └────────────┬──────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
   ┌─────▼───────┐       ┌───────▼─────┐
   │ HAS TENANTS │       │  NO TENANTS │
   └─────┬───────┘       └───────┬─────┘
         │                       │
┌────────▼──────────┐  ┌─────────▼─────────┐
│ Show tenants list │  │ Show empty state  │
│ - Chaque boutique │  │ + Créer boutique  │
│ - Options actions │  │   button only     │
└────────┬──────────┘  └─────────┬─────────┘
         │                       │
    ┌────┴─────────┬──────────┐  │
    │              │          │  │
┌───▼────┐    ┌────▼──────┐ ┌─┴──▼──────┐
│ Clique │    │  Ajouter  │ │  Créer    │
│boutique│    │ boutique  │ │ boutique  │
└───┬────┘    └────┬──────┘ └──────┬────┘
    │              │              │
┌───▼────┐    ┌────▼─────┐    ┌───▼──────┐
│  SSO   │    │  /plans  │    │  /plans  │
│ Login  │    │ (vendor) │    │ (vendor) │
└───┬────┘    └────┬─────┘    └────┬─────┘
    │              │               │
    └───────────┴──────────────────┘
                │
    ┌───────────▼──────────┐
    │  Create new tenant   │
    │  or select existing  │
    └───────────┬──────────┘
                │
    ┌───────────▼────────────┐
    │ /vendor/success/{slug} │
    │ + "Gérer mes boutiques"│
    └───────────┬────────────┘
                │
    ┌───────────▼──────────────┐
    │   /selection-compte      │
    │    (back to list)        │
    └──────────────────────────┘
```

## 🛣️ Routes Laravel

```php
// Middleware: auth
Route::middleware('auth')->prefix('selection-compte')->name('central.account-selection.')->group(function () {
    // Affiche la page de sélection (avec ou sans boutiques)
    Route::get('/', [TenantAccountController::class, 'index'])->name('index');
    
    // Redirige vers plans pour créer une nouvelle boutique
    Route::get('/ajouter', [TenantAccountController::class, 'addAccount'])->name('add-account');
    
    // Sélectionne une boutique et redirige via SSO
    Route::get('/{tenant:slug}/continuer', [TenantAccountController::class, 'select'])->name('select');
});
```

## 🎯 Contrôleurs

### TenantAccountController.php

**`index()`**

- Récupère tous les tenants propres à l'utilisateur
- Les affiche avec `account-selection.tsx`
- **Important**: N'affiche pas d'erreur si vide, laisse la vue gérer

**`select($tenant)`**

- Vérifie l'ownership du tenant
- Génère une URL SSO sécurisée avec token chiffré
- Redirige vers le dashboard tenant

**`addAccount()`**

- Simple redirection vers `vendor.register`
- Permet de créer une nouvelle boutique sans logout

### VendorRegistrationController.php

**`vendeurIndex()`**

- ✅ Supprimé la vérification de redirection
- Permet la création de **plusieurs boutiques**
- Affiche les plans disponibles

## 🎨 Composants React

### account-selection.tsx

- **État 1: Avec boutiques**
  - Affiche le profil utilisateur
  - Liste toutes les boutiques
  - Bouton "Ajouter une boutique"
  
- **État 2: Sans boutique**
  - Message "Aucune boutique créée"
  - Bouton "Créer votre boutique"

### Success.tsx

- ✅ Nouveau: Bouton "Gérer mes boutiques"
- Redirige vers `/selection-compte`

## 🔐 Sécurité

### Authentification SSO Tenant

- Token chiffré avec `Crypt::encryptString()`
- Données du payload:

  ```json
  {
    "user_id": "uuid",
    "tenant_id": "uuid",
    "expires_at": 1234567890
  }
  ```

- Expiration: **5 minutes**

### Vérifications

- Propriété du tenant (`is_owner=true`)
- Token valide et non expiré
- User ID cohérent

## 🔑 Listeners

### RedirectVendorAfterLogin.php

- **Change**: Toujours redirige vers `/selection-compte`
- Pas de logique conditionnelle
- Même comportement pour users avec/sans boutique

## 📊 Architecture de données

### User ↔ Tenant (many-to-many)

```
user_tenant table:
- user_id
- tenant_id
- is_owner: boolean (true = propriétaire)
```

### Tenant (multi-tenant)

```
tenants table (central):
- id
- raison_sociale (shop name)
- slug (unique identifier)
- email
- logo_url
- statut (ACTIF)
- is_active (true)
```

## ✅ Cas d'usage couverts

- [x] User avec une boutique → voir sa boutique
- [x] User avec plusieurs boutiques → voir toutes
- [x] User sans boutique → créer sa première
- [x] User ajoute nouvelle boutique → retour vers liste
- [x] User clique sur boutique → SSO → dashboard
- [x] Après création → lien vers sélection

## 🚀 Déploiement

### Fichiers modifiés

1. `routes/web.php` - Routes account selection
2. `app/Listeners/RedirectVendorAfterLogin.php` - Middleware redirect
3. `app/Http/Controllers/central/TenantAccountController.php` - Logique
4. `app/Http/Controllers/Main/VendorRegistrationController.php` - Allow multi-shop
5. `resources/js/pages/auth/account-selection.tsx` - UI (with/without tenants)
6. `resources/js/pages/Vendor/Success.tsx` - Add back link

### Build & Cache

```bash
npm run build
php artisan cache:clear
php artisan view:clear
```

## 📈 Améliorations futures

- [ ] Afficher le statut du plan actif pour chaque boutique
- [ ] Indicateur de date d'expiration du plan
- [ ] Statistiques rapides (commandes, revenus)
- [ ] Gestion de collaborateurs
- [ ] Archivage/suppression de boutique
- [ ] Switching rapide entre boutiques (menu top)
