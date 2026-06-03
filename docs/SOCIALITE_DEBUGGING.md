# Guide de Debugging et Tests - Authentification Sociale

## 🔍 Debugging Rapide

### 1. Vérifier la Configuration

```bash
# Entrer dans tinker
php artisan tinker

# Voir tous les providers
>>> config('socialite.providers')

# Voir un provider spécifique
>>> config('socialite.providers.google')

# Voir les providers activés
>>> app(App\Services\SocialiteService::class)->getEnabledProviders()

# Vérifier si un provider est activé
>>> app(App\Services\SocialiteService::class)->isProviderEnabled('google')
```

### 2. Vérifier les Variables d'Environnement

```bash
# Voir les variables
php artisan tinker
>>> env('GOOGLE_CLIENT_ID')
>>> env('FACEBOOK_CLIENT_SECRET')

# Ou directement dans le shell
echo $GOOGLE_CLIENT_ID
```

### 3. Vérifier la Base de Données

```bash
# Voir les utilisateurs créés via OAuth
php artisan tinker
>>> App\Models\User::where('provider', '!=', null)->get()

# Voir un utilisateur spécifique
>>> App\Models\User::where('email', 'user@example.com')->first()

# Vérifier les champs provider
>>> App\Models\User::pluck('provider', 'email')
```

## 📋 Checklist de Test Manual

### Test 1: Redirection Google

```bash
# 1. Visiter la route
curl -v http://localhost/auth/google/redirect

# Attendu: HTTP 302 Redirect vers Google
```

### Test 2: Redirection Facebook

```bash
# 1. Visiter la route
curl -v http://localhost/auth/facebook/redirect

# Attendu: HTTP 302 Redirect vers Facebook
```

### Test 3: Créer un Utilisateur via OAuth

```bash
# 1. Se connecter via Google (manuellement dans le navigateur)
# 2. Vérifier la création de l'utilisateur

php artisan tinker
>>> App\Models\User::where('provider', 'google')->first()
```

### Test 4: Vérifier l'Email Vérifié

```bash
php artisan tinker
>>> $user = App\Models\User::where('email', 'user@example.com')->first()
>>> $user->email_verified_at  # Doit être non-null
```

## 🐛 Erreurs Courantes et Solutions

### Erreur 1: "Provider not enabled"

```
❌ Symptôme: HTTP redirect avec message "Le fournisseur d'authentification X n'est pas disponible"

✅ Solution:
1. Vérifier que les variables d'environnement sont définies:
   - GOOGLE_CLIENT_ID
   - GOOGLE_CLIENT_SECRET
   
2. Relancer le cache:
   php artisan config:cache
   
3. Vérifier dans tinker:
   >>> config('socialite.providers.google.enabled')
```

### Erreur 2: "Invalid client ID"

```
❌ Symptôme: Erreur OAuth lors de la redirection

✅ Solution:
1. Vérifier les credentials:
   - Les copier exactement depuis le provider
   - Vérifier qu'il n'y a pas d'espaces
   
2. Tester les credentials:
   php artisan tinker
   >>> env('GOOGLE_CLIENT_ID')
   
3. Renouveler les credentials si nécessaire:
   - Aller sur Google Cloud Console
   - Recréer les credentials
   - Mettre à jour .env
```

### Erreur 3: "Callback URL mismatch"

```
❌ Symptôme: Erreur "redirect_uri_mismatch" lors du callback

✅ Solution:
1. Vérifier que l'URL correspond exactement:
   - Configuration OAuth: http://localhost/auth/google/callback
   - .env: GOOGLE_REDIRECT_URI=http://localhost/auth/google/callback
   
2. Vérifier les domaines autorisés:
   - Google: authorized JavaScript origins et redirect URIs
   - Facebook: Valid OAuth Redirect URIs
   
3. Attention à la casse et aux trailing slashes:
   - ❌ http://localhost/auth/google/Callback
   - ✅ http://localhost/auth/google/callback
```

### Erreur 4: "Authentication failed"

```
❌ Symptôme: Erreur générique lors du callback

✅ Solution:
1. Vérifier les logs:
   tail -f storage/logs/laravel.log
   
2. Vérifier les scopes:
   - Certains providers nécessitent des scopes spécifiques
   - Vérifier dans la configuration du provider OAuth
   
3. Tester avec un autre navigateur/compte:
   - Peut être un problème spécifique au compte
```

### Erreur 5: "Email verification"

```
❌ Symptôme: Utilisateur créé mais email non vérifié

✅ Solution:
- C'est normal, le code le fait automatiquement
- Vérifier:
  php artisan tinker
  >>> $user = App\Models\User::where('provider', 'google')->first()
  >>> $user->email_verified_at  # Doit être non-null
```

## 📊 Logs et Monitoring

### Vérifier les Erreurs Récentes

```bash
# Voir les 50 dernières lignes du log
tail -50 storage/logs/laravel.log

# Voir les erreurs en temps réel
tail -f storage/logs/laravel.log

# Chercher les erreurs Socialite
grep -i socialite storage/logs/laravel.log

# Compter les erreurs
grep -c "ERROR" storage/logs/laravel.log
```

### Formater les Logs pour Lisibilité

```bash
# Voir uniquement les erreurs
grep "ERROR" storage/logs/laravel.log | tail -20

# Voir les erreurs avec contexte
grep -A 5 "ERROR" storage/logs/laravel.log | tail -30

# Voir les dernières tentatives de connexion
grep -i "socialite\|auth" storage/logs/laravel.log | tail -50
```

## 🧪 Tests Automatisés

### Exécuter les Tests Socialite

```bash
# Tous les tests Socialite
php artisan test tests/Feature/Auth/SocialiteAuthTest.php

# Tests unitaires du service
php artisan test tests/Unit/Services/SocialiteServiceTest.php

# Tous les tests
php artisan test

# Avec output verbeux
php artisan test --verbose

# Arrêter au premier erreur
php artisan test --stop-on-failure
```

### Écrire un Test Personnalisé

```php
// tests/Feature/Auth/TestCustomProvider.php
<?php

namespace Tests\Feature\Auth;

use Tests\TestCase;

class TestCustomProvider extends TestCase
{
    public function test_custom_provider_redirect()
    {
        config()->set('socialite.providers.custom', [
            'enabled' => true,
            'client_id' => 'test',
            'client_secret' => 'test',
        ]);
        
        // Test...
    }
}
```

## 🔑 Commandes Utiles

```bash
# Nettoyer le cache de configuration
php artisan config:cache
php artisan cache:clear

# Migrer la base de données
php artisan migrate

# Voir l'état des migrations
php artisan migrate:status

# Rollback les migrations (DANGER!)
php artisan migrate:rollback

# Voir les routes disponibles
php artisan route:list | grep socialite

# Voir la configuration
php artisan config:show socialite.providers

# Entrer dans le tinker shell
php artisan tinker

# Sortir de tinker
exit
```

## 📱 Tests dans le Navigateur

### Test 1: Vérifier le Composant React

1. Ouvrir <http://localhost/login>
2. Vérifier que les boutons sociaux s'affichent
3. Vérifier que les icônes sont correctes
4. Vérifier le responsive (redimensionner)

### Test 2: Tester la Redirection

1. Cliquer sur "Se connecter avec Google"
2. Vérifier la redirection vers Google
3. Accepter les permissions
4. Vérifier la redirection vers le callback

### Test 3: Vérifier la Création d'Utilisateur

1. Se connecter avec un nouveau compte
2. Vérifier la création de l'utilisateur
3. Vérifier la redirection
4. Vérifier l'authentification

### Test 4: Tester la Fusion de Comptes

1. Créer un compte avec email "<test@example.com>" et mot de passe
2. Se déconnecter
3. Se connecter avec Google avec le même email
4. Vérifier que c'est le même utilisateur
5. Vérifier que les champs provider sont mis à jour

## 📊 Monitoring en Production

### Alertes Recommandées

```
1. Si taux d'erreur > 5% sur 5 minutes
2. Si aucune authentification réussie pendant 1 heure
3. Si logs contiennent "provider not enabled"
4. Si logs contiennent "authentication failed" plus de 10 fois
```

### Métriques à Suivre

```
1. Nombre d'utilisateurs créés par provider par jour
2. Taux de succès d'authentification par provider
3. Temps moyen de callback
4. Erreurs par type
```

## 🎯 Checklist de Production

- [ ] Tous les logs sont centralisés
- [ ] Les alertes sont configurées
- [ ] Les credentials sont sécurisés
- [ ] Les URLs de callback sont correctes
- [ ] Les tests ont été effectués
- [ ] La documentation a été mise à jour
- [ ] L'équipe a été formée

## 💡 Conseils de Debugging

1. **Lire les logs d'abord** - ils contiennent généralement la cause
2. **Vérifier les variables d'environnement** - c'est souvent le problème
3. **Tester en local d'abord** - avant de passer à la production
4. **Utiliser Tinker** - pour tester rapidement
5. **Vérifier les credentials** - copiez-collez exactement
6. **Pas de caches stales** - exécutez `config:cache`

## 📚 Ressources

- [Laravel Docs - Debugging](https://laravel.com/docs/errors)
- [Laravel Docs - Logging](https://laravel.com/docs/logging)
- [Laravel Docs - Tinker](https://laravel.com/docs/tinker)
- [Socialite Documentation](https://laravel.com/docs/socialite)
