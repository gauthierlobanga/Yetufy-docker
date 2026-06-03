# Comment Ajouter de Nouveaux Providers OAuth

Ce guide explique comment ajouter de nouveaux fournisseurs OAuth (GitHub, LinkedIn, Twitter, etc.) à votre système d'authentification.

## 📋 Étapes Générales

### 1. Ajouter le Provider à la Configuration

Éditer `config/socialite.php`:

```php
'providers' => [
    // ... providers existants ...
    
    'github' => [
        'enabled' => env('GITHUB_CLIENT_ID') && env('GITHUB_CLIENT_SECRET'),
        'client_id' => env('GITHUB_CLIENT_ID'),
        'client_secret' => env('GITHUB_CLIENT_SECRET'),
        'redirect' => env('GITHUB_REDIRECT_URI'),
    ],
],
```

### 2. Ajouter les Variables d'Environnement

Ajouter à `.env.example`:

```env
# GitHub OAuth
# GITHUB_CLIENT_ID=
# GITHUB_CLIENT_SECRET=
# GITHUB_REDIRECT_URI=http://localhost/auth/github/callback
```

### 3. Mettre à Jour le Composant React

Éditer `resources/js/components/social-login-buttons.tsx`:

```tsx
import { FaGithub } from 'react-icons/fa'; // ou l'icône appropriée

const providers: Provider[] = [
    // ... providers existants ...
    {
        name: 'github',
        label: 'GitHub',
        icon: <FaGithub className="h-10 w-10 text-slate-700 dark:text-white" />,
    },
];
```

### 4. Configurer le Provider OAuth Externe

Allez sur la plateforme du provider (ex: GitHub) et:

- Créez une nouvelle OAuth application
- Enregistrez votre URL de callback: `http://localhost/auth/github/callback`
- Copiez les credentials (Client ID et Secret)

### 5. Ajouter les Credentials à .env

```env
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
GITHUB_REDIRECT_URI=http://localhost/auth/github/callback
```

### 6. Tester

```bash
# Vérifier la configuration
php artisan tinker
>>> config('socialite.providers.github')

# Tester la route de redirection
# http://localhost/auth/github/redirect
```

## 📘 Exemples de Providers Populaires

### GitHub

1. Allez à: <https://github.com/settings/developers>
2. New OAuth App
3. Application name: `Yetufy`
4. Authorization callback URL: `http://localhost/auth/github/callback`
5. Copiez Client ID et Client Secret

```env
GITHUB_CLIENT_ID=xxx
GITHUB_CLIENT_SECRET=xxx
GITHUB_REDIRECT_URI=http://localhost/auth/github/callback
```

### LinkedIn

1. Allez à: <https://www.linkedin.com/developers/apps>
2. Create app
3. Remplissez les informations
4. Allez à "Auth" tab
5. Authorized redirect URLs: `http://localhost/auth/linkedin/callback`

```env
LINKEDIN_CLIENT_ID=xxx
LINKEDIN_CLIENT_SECRET=xxx
LINKEDIN_REDIRECT_URI=http://localhost/auth/linkedin/callback
```

### Twitter (X)

1. Allez à: <https://developer.twitter.com/en/portal/dashboard>
2. Create a new app
3. Setup authentication
4. Callback URLs: `http://localhost/auth/twitter/callback`

```env
TWITTER_CLIENT_ID=xxx
TWITTER_CLIENT_SECRET=xxx
TWITTER_REDIRECT_URI=http://localhost/auth/twitter/callback
```

### Discord

1. Allez à: <https://discord.com/developers/applications>
2. New Application
3. OAuth2 → Redirects
4. Add redirect: `http://localhost/auth/discord/callback`

```env
DISCORD_CLIENT_ID=xxx
DISCORD_CLIENT_SECRET=xxx
DISCORD_REDIRECT_URI=http://localhost/auth/discord/callback
```

## 🛠️ Gestion des Scopes Personnalisés

Certains providers nécessitent des scopes spécifiques. Modifiez le contrôleur si nécessaire:

`app/Http/Controllers/Auth/SocialiteController.php`:

```php
public function socialiteShopRedirect($provider)
{
    // ... validation code ...

    if ($provider === 'github') {
        return Socialite::driver($provider)
            ->scopes(['read:user', 'user:email'])
            ->redirect();
    }

    if ($provider === 'linkedin') {
        return Socialite::driver($provider)
            ->scopes(['r_basicprofile', 'r_emailaddress'])
            ->redirect();
    }

    return Socialite::driver($provider)->redirect();
}
```

## 📊 Matrice de Configuration

| Provider | OAuth 2.0 | Scopes | Notes |
|----------|-----------|--------|-------|
| Google | ✅ | standard | - |
| Facebook | ✅ | public_profile, email | - |
| Instagram | ✅ | user_profile | Via Facebook |
| Microsoft | ✅ | openid, profile, email | Azure AD |
| GitHub | ✅ | read:user, user:email | - |
| LinkedIn | ✅ | r_basicprofile | - |
| Twitter | ✅ | tweet.read, users.read | - |
| Discord | ✅ | identify, email | - |

## ⚠️ Conseil: Provider-Specific Issues

### Google

- Trustworthy server URI needs to be verified
- Scopes: `openid`, `profile`, `email`

### Facebook

- Email peut ne pas être disponible pour certains comptes
- Nécessite approbation pour certains permissions

### Instagram

- Utilise les credentials Facebook
- Peut être limité pour les utilisateurs non professionnels

### Microsoft

- Plusieurs tenants disponibles (common, organizations, consumers)
- Scopes: `openid`, `profile`, `email`, `offline_access`

## 🧪 Test d'Un Nouveau Provider

```bash
# 1. Vérifier la configuration
php artisan tinker
>>> config('socialite.providers.github')

# 2. Vérifier que le service reconnaît le provider
>>> app(App\Services\SocialiteService::class)->isProviderEnabled('github')

# 3. Visiter la route de redirection
# http://localhost/auth/github/redirect

# 4. Vérifier les logs
tail -f storage/logs/laravel.log
```

## 🚀 Production Checklist

- [ ] Credentials ajoutés aux variables d'environnement de production
- [ ] URLs de redirection mises à jour pour le domaine de production
- [ ] CORS configuré correctement
- [ ] Tests effectués en production
- [ ] Logging activé et monitoré
- [ ] Erreurs traitées et documentées

## 📝 Migration Helper

Pour ajouter rapidement un nouveau provider, utilisez cette template:

```php
// config/socialite.php - à ajouter dans 'providers'
'new_provider' => [
    'enabled' => env('NEW_PROVIDER_CLIENT_ID') && env('NEW_PROVIDER_CLIENT_SECRET'),
    'client_id' => env('NEW_PROVIDER_CLIENT_ID'),
    'client_secret' => env('NEW_PROVIDER_CLIENT_SECRET'),
    'redirect' => env('NEW_PROVIDER_REDIRECT_URI'),
],
```

```tsx
// resources/js/components/social-login-buttons.tsx - à ajouter dans providers array
{
    name: 'new_provider',
    label: 'New Provider',
    icon: <YourIcon className="h-10 w-10 text-[#color]" />,
},
```

```env
# .env.example - à ajouter
# New Provider OAuth
# NEW_PROVIDER_CLIENT_ID=
# NEW_PROVIDER_CLIENT_SECRET=
# NEW_PROVIDER_REDIRECT_URI=http://localhost/auth/new_provider/callback
```

## 💡 Bonnes Pratiques

1. **Testez toujours en local d'abord**
2. **Utilisez des variables d'environnement**
3. **Documentez les scopes nécessaires**
4. **Testez les cas d'erreur**
5. **Utilisez le logging pour déboguer**
6. **Surveillez les mises à jour des APIs OAuth**

## 📞 Ressources

- [Laravel Socialite Providers](https://socialiteproviders.com/)
- [OAuth 2.0 Providers List](https://oauth.net/code/)
- [Laravel Documentation](https://laravel.com/docs/socialite)
