# Checklist de Configuration - Authentification Sociale

## 🎯 Étapes à Suivre

### Phase 1: Configuration de Base ✅ (Déjà fait)

- [x] Installation de Laravel Socialite
- [x] Création du service SocialiteService
- [x] Amélioration du contrôleur SocialiteController
- [x] Mise à jour du modèle User
- [x] Création des migrations
- [x] Création du fichier config/socialite.php
- [x] Mise à jour du .env.example
- [x] Amélioration du composant React

### Phase 2: Exécution des Migrations

- [ ] Exécuter les migrations:

  ```bash
  php artisan migrate
  ```

### Phase 3: Configuration de Google

- [ ] Aller à [Google Cloud Console](https://console.cloud.google.com/)
- [ ] Créer/Sélectionner un projet
- [ ] Activer Google+ API
- [ ] Créer des credentials OAuth 2.0
- [ ] Ajouter les URIs autorisés:
  - [ ] `http://localhost/auth/google/callback`
  - [ ] `https://votre-domaine.com/auth/google/callback`
- [ ] Copier le Client ID et Secret
- [ ] Ajouter à `.env`:

  ```env
  GOOGLE_CLIENT_ID=xxx
  GOOGLE_CLIENT_SECRET=xxx
  GOOGLE_REDIRECT_URI=http://localhost/auth/google/callback
  ```

- [ ] Tester: `http://localhost/auth/google/redirect`

### Phase 4: Configuration de Facebook

- [ ] Aller à [Meta Developers](https://developers.facebook.com/)
- [ ] Créer une nouvelle application
- [ ] Ajouter le produit "Connexion Facebook"
- [ ] Configurer les URIs valides:
  - [ ] `http://localhost/auth/facebook/callback`
  - [ ] `https://votre-domaine.com/auth/facebook/callback`
- [ ] Configurer les domaines d'application
- [ ] Copier l'ID et Secret
- [ ] Ajouter à `.env`:

  ```env
  FACEBOOK_CLIENT_ID=xxx
  FACEBOOK_CLIENT_SECRET=xxx
  FACEBOOK_REDIRECT_URI=http://localhost/auth/facebook/callback
  ```

- [ ] Tester: `http://localhost/auth/facebook/redirect`

### Phase 5: Configuration d'Instagram

- [ ] Utiliser les credentials Facebook (même application)
- [ ] Ajouter le produit "Instagram Basic Display"
- [ ] Configurer les URIs valides:
  - [ ] `http://localhost/auth/instagram/callback`
  - [ ] `https://votre-domaine.com/auth/instagram/callback`
- [ ] Ajouter à `.env`:

  ```env
  INSTAGRAM_CLIENT_ID=xxx
  INSTAGRAM_CLIENT_SECRET=xxx
  INSTAGRAM_REDIRECT_URI=http://localhost/auth/instagram/callback
  ```

- [ ] Tester: `http://localhost/auth/instagram/redirect`

### Phase 6: Configuration de Microsoft

- [ ] Aller à [Azure Portal](https://portal.azure.com/)
- [ ] Créer une nouvelle inscription d'application
- [ ] Ajouter les URIs de redirection:
  - [ ] `http://localhost/auth/microsoft/callback`
  - [ ] `https://votre-domaine.com/auth/microsoft/callback`
- [ ] Générer un secret client
- [ ] Copier l'ID et Secret
- [ ] Ajouter à `.env`:

  ```env
  MICROSOFT_CLIENT_ID=xxx
  MICROSOFT_CLIENT_SECRET=xxx
  MICROSOFT_REDIRECT_URI=http://localhost/auth/microsoft/callback
  MICROSOFT_TENANT=common
  ```

- [ ] Tester: `http://localhost/auth/microsoft/redirect`

### Phase 7: Tests Locaux

- [ ] Vérifier la configuration:

  ```bash
  php artisan tinker
  >>> config('socialite.providers')
  ```

- [ ] Tester chaque provider:
  - [ ] Google: `http://localhost/auth/google/redirect`
  - [ ] Facebook: `http://localhost/auth/facebook/redirect`
  - [ ] Instagram: `http://localhost/auth/instagram/redirect`
  - [ ] Microsoft: `http://localhost/auth/microsoft/redirect`
- [ ] Vérifier les boutons React sur la page de login

### Phase 8: Tests d'Authentification Complète

- [ ] Tester la création d'un nouveau compte via Google
- [ ] Tester la création d'un nouveau compte via Facebook
- [ ] Tester la création d'un nouveau compte via Instagram
- [ ] Tester la création d'un nouveau compte via Microsoft
- [ ] Tester la connexion avec un compte existant
- [ ] Vérifier que l'utilisateur est bien authentifié
- [ ] Vérifier les logs pour les erreurs

### Phase 9: Tests en Production

- [ ] Mettre à jour les URLs de redirection pour les domaines de production
- [ ] Reconfurer les CORS si nécessaire
- [ ] Tester avec les domaines de production
- [ ] Vérifier les logs pour les erreurs
- [ ] Tester la création de compte
- [ ] Tester la connexion

### Phase 10: Monitoring et Maintenance

- [ ] Configurer le monitoring des erreurs
- [ ] Vérifier les logs régulièrement: `storage/logs/laravel.log`
- [ ] Mettre à place des alertes pour les erreurs d'authentification
- [ ] Documenter les problèmes rencontrés

## 📋 Fichiers Modifiés/Créés

### Fichiers Créés

```
✅ config/socialite.php
✅ app/Services/SocialiteService.php
✅ docs/SOCIALITE_SETUP.md
✅ docs/SOCIALITE_INTEGRATION.md
✅ tests/Unit/Services/SocialiteServiceTest.php
✅ tests/Feature/Auth/SocialiteAuthTest.php
```

### Fichiers Modifiés

```
✅ app/Http/Controllers/Auth/SocialiteController.php
✅ app/Models/User.php (fillable)
✅ database/migrations/0001_01_01_000000_create_users_table.php
✅ database/migrations/2026_04_23_014532_add_socialite_fields_to_users_table.php
✅ .env.example
✅ resources/js/components/social-login-buttons.tsx
```

## 🧪 Commands de Test

```bash
# Exécuter tous les tests
php artisan test

# Exécuter les tests unitaires Socialite
php artisan test tests/Unit/Services/SocialiteServiceTest.php

# Exécuter les tests d'intégration
php artisan test tests/Feature/Auth/SocialiteAuthTest.php

# Vérifier la configuration
php artisan tinker
>>> config('socialite.providers')
>>> app(App\Services\SocialiteService::class)->getEnabledProviders()
```

## 🔍 Vérifications de Sécurité

- [ ] Les credentials ne sont pas en dur dans le code
- [ ] Les URLs de redirection correspondent exactement aux paramètres OAuth
- [ ] Le logging des erreurs est activé
- [ ] Les variables d'environnement sont correctement définies
- [ ] Le fichier .env n'est pas commité dans Git
- [ ] Les permissions sur les fichiers sont correctes

## 📞 Support et Dépannage

En cas de problème:

1. Voir `docs/SOCIALITE_SETUP.md` - Section "Dépannage"
2. Vérifier les logs: `storage/logs/laravel.log`
3. Vérifier la configuration: `php artisan tinker > config('socialite.providers')`
4. Vérifier que les credentials sont valides

## 📚 Documentation Recommandée

- [docs/SOCIALITE_SETUP.md](./SOCIALITE_SETUP.md) - Guide complet de configuration
- [docs/SOCIALITE_INTEGRATION.md](./SOCIALITE_INTEGRATION.md) - Résumé de l'intégration
- [Laravel Socialite Docs](https://laravel.com/docs/socialite)
