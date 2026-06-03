# ⚙️ Configuration - `config/`

Ce dossier contient tous les fichiers de configuration de l'application.

## 📁 Structure

```
config/
├── app.php              # Configuration app
├── auth.php             # Authentification
├── cache.php            # Cache
├── database.php         # Base de données
├── queue.php            # Queue jobs
├── mail.php             # Email
├── socialite.php        # OAuth (créé)
├── filesystems.php      # Stockage fichiers
├── services.php         # Services tiers
├── sanctum.php          # API tokens
└── ...
```

## 🔑 Fichiers Principaux

### `app.php`

Configuration générale de l'application.

```php
'name' => 'Yetufy',              // Nom de l'appli
'debug' => env('APP_DEBUG'),     // Debug mode
'timezone' => 'UTC',             // Timezone
'locale' => 'en',                // Langue
```

### `auth.php`

Configuration de l'authentification.

```php
'defaults' => [
    'guard' => 'web',            // Guard par défaut
    'passwords' => 'users',      // Broker par défaut
],

'guards' => [
    'web' => [                   // Guard web
        'driver' => 'session',
        'provider' => 'users',
    ],

    'api' => [                   // Guard API
        'driver' => 'sanctum',
        'provider' => 'users',
    ],
],

'providers' => [
    'users' => [
        'driver' => 'eloquent',
        'model' => App\Models\User::class,
    ],
],
```

### `database.php`

Configuration de la base de données.

```php
'default' => env('DB_CONNECTION', 'sqlite'),

'connections' => [
    'sqlite' => [
        'driver' => 'sqlite',
        'url' => env('DATABASE_URL'),
        'database' => env('DB_DATABASE', database_path('database.sqlite')),
    ],

    'mysql' => [
        'driver' => 'mysql',
        'host' => env('DB_HOST'),
        'database' => env('DB_DATABASE'),
        'username' => env('DB_USERNAME'),
        'password' => env('DB_PASSWORD'),
    ],
],
```

### `socialite.php`

Configuration OAuth (créée lors de l'intégration).

```php
'providers' => [
    'google' => [
        'enabled' => env('GOOGLE_CLIENT_ID') && env('GOOGLE_CLIENT_SECRET'),
        'client_id' => env('GOOGLE_CLIENT_ID'),
        'client_secret' => env('GOOGLE_CLIENT_SECRET'),
        'redirect' => env('GOOGLE_REDIRECT_URI'),
    ],
    // ... autres providers
],
```

### `queue.php`

Configuration des jobs en arrière-plan.

```php
'default' => env('QUEUE_CONNECTION', 'database'),

'connections' => [
    'sync' => [
        'driver' => 'sync',  // Synchrone (développement)
    ],

    'database' => [
        'driver' => 'database',
        'table' => 'jobs',
    ],

    'redis' => [
        'driver' => 'redis',
        'connection' => 'default',
    ],
],
```

### `mail.php`

Configuration des emails.

```php
'default' => env('MAIL_MAILER', 'log'),

'mailers' => [
    'log' => [
        'driver' => 'log',      // Développement
    ],

    'smtp' => [
        'driver' => 'smtp',
        'host' => env('MAIL_HOST'),
        'port' => env('MAIL_PORT'),
        'username' => env('MAIL_USERNAME'),
        'password' => env('MAIL_PASSWORD'),
    ],
],
```

### `filesystems.php`

Configuration du stockage de fichiers.

```php
'default' => env('FILESYSTEM_DISK', 'local'),

'disks' => [
    'local' => [
        'driver' => 'local',
        'root' => storage_path('app'),
    ],

    'public' => [
        'driver' => 'local',
        'root' => storage_path('app/public'),
        'url' => env('APP_URL') . '/storage',
    ],

    's3' => [
        'driver' => 's3',
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION'),
        'bucket' => env('AWS_BUCKET'),
    ],
],
```

## 🔧 Variables d'Environnement

Les variables d'environnement sont définies dans le fichier `.env`.

### Variables Essentielles

```env
# Application
APP_NAME=Yetufy
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost

# Key
APP_KEY=base64:xyz...

# Base de données
DB_CONNECTION=sqlite
DB_DATABASE=database.sqlite

# OAuth
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
STRIPE_KEY=pk_xxx
STRIPE_SECRET=sk_xxx
```

### Charger des Variables

```php
// Dans les fichiers de config
'debug' => env('APP_DEBUG', false),

// Dans l'application
echo env('APP_NAME');
```

## 🔄 Charger les Configurations

### Dans les Controllers

```php
// Accéder à la configuration
$appName = config('app.name');
$authGuard = config('auth.defaults.guard');

// Avec valeur par défaut
$timeout = config('session.lifetime', 120);

// Modifier temporairement
config(['app.debug' => true]);
```

### Dans les Templates Blade

```blade
{{ config('app.name') }}
{{ config('services.stripe.key') }}
```

## 📝 Bonnes Pratiques

### 1. Utiliser des Fichiers de Config

```php
// ✅ Bon
config('socialite.providers.google.enabled')

// ❌ Mauvais
if (getenv('GOOGLE_CLIENT_ID')) {
    // ...
}
```

### 2. Mettre en Cache les Configurations

```bash
# En production
php artisan config:cache

# Pendant le développement (watch mode)
php artisan config:clear
```

### 3. Variables d'Environnement Sensibles

```env
# Ne JAMAIS commiter le .env
APP_KEY=secret
DB_PASSWORD=secret
STRIPE_SECRET_KEY=secret

# Utiliser .env.example
# Configurer les variables en production via:
# - Variables d'environnement du serveur
# - Gestionnaire de secrets (AWS Secrets Manager)
# - Docker secrets
```

## 🔒 Sécurité

### Secrets Sensibles

```php
// ❌ Mauvais - Secrets en dur
'stripe_key' => 'sk_live_xyz',

// ✅ Bon - Via variables d'environnement
'stripe_key' => env('STRIPE_SECRET_KEY'),
```

### Rotation des Clés

```bash
# Générer une nouvelle clé d'application
php artisan key:generate

# Mettre à jour le cache si nécessaire
php artisan config:cache
```

## 🧪 Configuration pour Tests

Les tests utilisent une configuration spéciale via `phpunit.xml`.

```xml
<phpunit>
    <php>
        <env name="APP_ENV" value="testing"/>
        <env name="DB_CONNECTION" value="sqlite"/>
        <env name="DB_DATABASE" value=":memory:"/>
    </php>
</phpunit>
```

## 📚 Fichiers de Configuration Courants

| Fichier | Usage |
|---------|-------|
| `app.php` | Paramètres généraux |
| `auth.php` | Authentification |
| `database.php` | Base de données |
| `cache.php` | Cache |
| `queue.php` | Jobs asynchrones |
| `mail.php` | Emails |
| `filesystems.php` | Stockage fichiers |
| `services.php` | Services tiers |
| `socialite.php` | OAuth |

## 🔗 Ressources

- [Laravel Docs - Configuration](https://laravel.com/docs/configuration)
- [Environment Variables](https://laravel.com/docs/configuration#environment-configuration)

---

**Besoin d'aide?** Consultez la [documentation principale](../README.md)
