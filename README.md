# 🛍️ Yetufy - Plateforme E-Commerce Multi-Tenant

**Une plateforme e-commerce moderne, multi-tenant et complète construite avec Laravel, React et Inertia.js**

## 📋 Vue d'Ensemble

Yetufy est une plateforme e-commerce avancée qui permet aux vendeurs de gérer leurs boutiques en ligne dans un environnement multi-tenant. Elle combine la puissance de Laravel 13 avec React pour une expérience utilisateur moderne et réactive.

### 🎯 Caractéristiques Principales

- ✅ **Multi-Tenant** - Chaque vendeur a son propre espace isolé
- ✅ **Authentification Sociale** - Google, Facebook, Instagram, Microsoft OAuth
- ✅ **Gestion de Produits** - Catalogue complet avec catégories, marques, promotions
- ✅ **Système de Commandes** - Gestion complète du cycle de vie des commandes
- ✅ **Panier et Checkout** - Expérience client fluide
- ✅ **Paiements** - Intégration Stripe et Cashier
- ✅ **Analytics** - Tableaux de bord avancés
- ✅ **Blog** - Système de blog intégré
- ✅ **API REST** - Endpoints complètes avec Sanctum
- ✅ **Admin Panel** - Interface d'administration avec Filament
- ✅ **Notifications** - Temps réel avec Reverb

## 🚀 Démarrage Rapide

### Prérequis

- PHP 8.3+
- Node.js 18+
- PostgreSQL
- Composer
- npm

### Installation

```bash
# 1. Cloner le repository
git clone <repository-url>
cd yetu

# 2. Installer les dépendances PHP
composer install

# 3. Copier le fichier d'environnement
cp .env.example .env

# 4. Générer la clé d'application
php artisan key:generate

# 5. Exécuter les migrations
php artisan migrate

# 6. Installer les dépendances npm
npm install

# 7. Compiler les assets
npm run build

# 8. Démarrer l'environnement de développement complet
composer run dev
```

`composer run dev` lance `php artisan serve`, `php artisan queue:work` et `npm run dev`.
L'application locale est disponible sur `http://localhost:8000`.

### Configuration Initiale

```bash
# Créer un administrateur
php artisan tinker
>>> App\Models\User::create([
    'name' => 'Admin',
    'email' => 'admin@example.com',
    'password' => bcrypt('password'),
    'is_active' => true,
])->assignRole('super_admin');

# Accéder à l'admin panel
# http://localhost:8000/admin
```

### Dépannage mémoire en développement

Si PHP affiche `Allowed memory size exhausted` pendant `composer run dev`, commencez par vérifier que les commandes Artisan démarrent avec une limite basse:

```bash
php -d memory_limit=256M artisan list
php -d memory_limit=256M artisan wayfinder:generate --with-form
```

Une commande Artisan qui injecte un service trop lourd dans son constructeur peut forcer Laravel à résoudre une chaîne complète au démarrage. Les commandes doivent préférer l'injection dans `handle()` et les services doivent éviter les dépendances circulaires. Le script de développement utilise `queue:work --sleep=3` plutôt que `queue:listen` pour éviter de redémarrer tout le framework en boucle.

## 📁 Structure du Projet

```
yetu/
├── app/                          # Code métier de l'application
│   ├── Http/                    # Controllers, Middleware, Requests, Resources
│   ├── Models/                  # Eloquent models
│   ├── Services/                # Logique métier (ex: SocialiteService)
│   ├── Jobs/                    # Jobs en arrière-plan
│   ├── Events/                  # Événements
│   ├── Listeners/               # Écouteurs d'événements
│   ├── Notifications/           # Notifications
│   ├── Filament/                # Panneaux Filament (admin)
│   └── ...
├── config/                       # Fichiers de configuration
│   └── socialite.php            # Configuration OAuth
├── database/
│   ├── migrations/              # Migrations de base de données
│   ├── seeders/                 # Seeders
│   └── factories/               # Factories pour tests
├── routes/                       # Définition des routes
│   ├── tenants/                 # Routes tenant
│   ├── console/                 # Routes console
│   └── api.php                  # API REST
├── resources/
│   ├── js/                      # Composants React
│   ├── css/                     # Fichiers CSS
│   └── views/                   # Templates Blade
├── tests/                        # Tests unitaires et d'intégration
├── storage/                      # Fichiers générés (logs, cache)
├── public/                       # Fichiers publics
├── docs/                         # Documentation du projet
│   ├── SOCIALITE_SETUP.md
│   ├── SOCIALITE_DEBUGGING.md
│   └── ...
├── .env.example                  # Template d'environnement
├── composer.json                 # Dépendances PHP
├── package.json                  # Dépendances Node
├── vite.config.js               # Configuration Vite
└── README.md                     # Ce fichier
```

## 📚 Documentation

### Guides Disponibles

- 📖 [Vue d'Ensemble du Projet](./docs/README.md)
- 🔐 [Authentification Sociale](./SOCIALITE_README.md)
- 📋 [Checklist Socialite](./SOCIALITE_CHECKLIST.md)
- 🔧 [Configuration OAuth](./docs/SOCIALITE_SETUP.md)
- 🐛 [Debugging et Tests](./docs/SOCIALITE_DEBUGGING.md)
- ➕ [Ajouter de Nouveaux Providers](./docs/SOCIALITE_ADD_PROVIDERS.md)

### Documentation par Module

- 📱 [Application - app/](./app/README.md)
- 💾 [Base de Données - database/](./database/README.md)
- 🛣️ [Routes - routes/](./routes/README.md)
- 🎨 [Ressources - resources/](./resources/README.md)
- 🧪 [Tests - tests/](./tests/README.md)
- ⚙️ [Configuration - config/](./config/README.md)
- 💿 [Storage - storage/](./storage/README.md)

## 🛠️ Stack Technologique

### Backend

| Outil      | Version | Usage                    |
| ---------- | ------- | ------------------------ |
| Laravel    | 13.0    | Framework principal      |
| PHP        | 8.3+    | Langage serveur          |
| PostgreSQL | Latest  | Base de données          |
| Inertia.js | 3.0     | Bridge React-Laravel     |
| Filament   | 5.0     | Panel d'administration   |
| Socialite  | 5.26    | Authentification sociale |

### Frontend

| Outil        | Version | Usage        |
| ------------ | ------- | ------------ |
| React        | 18+     | Framework UI |
| TypeScript   | Latest  | Typage       |
| Tailwind CSS | 4.0     | Styling      |
| Vite         | Latest  | Bundler      |
| Lucide React | Latest  | Icônes       |

### Services

| Service       | Usage                    |
| ------------- | ------------------------ |
| Stripe        | Paiements                |
| Pusher/Reverb | Notifications temps réel |
| AWS S3        | Stockage de fichiers     |
| Laravel Scout | Recherche                |
| Redis         | Cache/Queue              |

## 🔑 Fonctionnalités Clés

### Pour les Clients

- 🛒 Parcourir les produits
- ❤️ Ajouter à la wishlist
- ⭐ Laisser des avis
- 💬 Commenter sur le blog
- 📦 Suivi des commandes
- 👤 Gérer les adresses
- 🔓 Authentification sociale

### Pour les Vendeurs

- 📊 Tableau de bord analytics
- 📦 Gestion des produits
- 📈 Promotions et remises
- 📋 Gestion des commandes
- 💳 Gestion des paiements
- 🎨 Customisation du thème
- 📝 Gestion des pages statiques
- 🤖 Assistance IA

### Pour les Administrateurs

- 👥 Gestion des utilisateurs
- 🏪 Gestion des boutiques/tenants
- 📊 Analytics globales
- 🔧 Configuration système
- 🛡️ Gestion des permissions
- 📝 Modération du blog

## 📊 Base de Données

### Principaux Modèles

```
Users
  ├── Tenants (shops)
  ├── Addresses
  ├── Wishlists
  └── Orders

Products
  ├── Categories
  ├── Brands
  ├── Reviews
  └── Images

Orders
  ├── Order Items
  ├── Payments
  └── Shipments

Blog
  ├── Posts
  ├── Comments
  └── Categories
```

Voir [database/README.md](./database/README.md) pour plus de détails.

## 🔐 Authentification

### Types d'Authentification

1. **Email/Mot de Passe** - Authentification classique
2. **OAuth Sociale** - Google, Facebook, Instagram, Microsoft
3. **API Tokens** - Sanctum pour accès API
4. **Administrateur** - Filament avec rôles/permissions

### Middleware d'Authentification

- `auth` - Utilisateur authentifié
- `verified` - Email vérifié
- `admin` - Administrateur
- `vendor` - Vendeur

## 🚦 Routes

### Routes Publiques

```
GET  /                          # Accueil
GET  /product                   # Catalogue produits
GET  /product/{product}         # Détail produit
GET  /blog                      # Blog
GET  /login                     # Connexion
GET  /register                  # Inscription
```

### Routes Authentifiées

```
GET  /acheteur/account          # Compte acheteur
GET  /vendor/dashboard          # Dashboard vendeur
GET  /checkout                  # Panier et checkout
GET  /orders                    # Mes commandes
```

### Routes Admin

```
/admin/dashboard                # Dashboard
/admin/users                    # Gestion utilisateurs
/admin/shops                    # Gestion boutiques
/admin/products                 # Gestion produits
```

Voir [routes/README.md](./routes/README.md) pour plus de détails.

## 🧪 Tests

```bash
# Tous les tests
php artisan test

# Tests spécifiques
php artisan test tests/Feature/Auth/

# Avec couverture
php artisan test --coverage

# Tests Socialite
php artisan test tests/Feature/Auth/SocialiteAuthTest.php
```

Voir [tests/README.md](./tests/README.md) pour plus de détails.

## 🔄 Développement

### Commandes Utiles

```bash
# Développement local
composer run dev

# Compilation des assets
npm run dev              # Développement
npm run build           # Production

# Migrations
php artisan migrate              # Exécuter
php artisan migrate:rollback     # Annuler
php artisan migrate:refresh      # Rafraîchir
php artisan migrate:seed         # Seeder

# Cache
php artisan config:cache         # Cache config
php artisan cache:clear          # Vider le cache
php artisan view:clear          # Vider les vues

# Tinker shell
php artisan tinker              # Interactif PHP REPL
```

### Code Quality

```bash
# Linting
composer run lint

# Format code
pint --parallel

# Static analysis
./vendor/bin/phpstan analyse app/
```

## 📝 Conventions de Code

### Nommage

- **Classes**: PascalCase (ProductController)
- **Méthodes**: camelCase (getProducts)
- **Constantes**: UPPER_SNAKE_CASE (CACHE_TTL)
- **Variables**: camelCase (productName)
- **Fichiers**: kebab-case ou PascalCase

### Structure

- **Controllers**: `{Resource}Controller`
- **Models**: Singulier (Product, User)
- **Migrations**: Timestamp + action descriptive
- **Routes**: RESTful patterns

## 🔒 Sécurité

### Bonnes Pratiques

- ✅ Validation de toutes les entrées utilisateur
- ✅ Protection CSRF sur tous les formulaires
- ✅ Rate limiting sur les routes sensibles
- ✅ Encryption des données sensibles
- ✅ Logging des actions critiques
- ✅ Permissions basées sur les rôles

### Variables d'Environnement

Ne commitez **jamais** `.env` ou les secrets:

```bash
# Secrets à configurer en production
APP_KEY                 # Clé d'application
DB_PASSWORD            # Mot de passe BD
STRIPE_SECRET_KEY      # Clé Stripe
GOOGLE_CLIENT_SECRET   # Secrets OAuth
```

## 📦 Déploiement

### Production

```bash
# 1. Optimiser l'application
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 2. Compiler les assets
npm run build

# 3. Exécuter les migrations
php artisan migrate --force

# 4. Redémarrer les workers
php artisan queue:restart
```

### Environnements

- `local` - Développement local
- `staging` - Environnement de test
- `production` - Production

## 📞 Support et Contribution

### Issues et Bugs

1. Vérifier que le bug existe toujours
2. Créer une issue avec reproduction
3. Fournir les logs et stack traces
4. Indiquer la version utilisée

### Contributions

1. Fork le repository
2. Créer une branche (`git checkout -b feature/...`)
3. Commit les changements (`git commit -m 'feat: ...'`)
4. Push la branche (`git push origin feature/...`)
5. Créer une Pull Request

## 📋 Checklist Avant Déploiement

- [ ] Tous les tests passent (`php artisan test`)
- [ ] Code formaté (`composer run lint`)
- [ ] Migrations exécutées (`php artisan migrate`)
- [ ] Assets compilés (`npm run build`)
- [ ] Variables d'environnement correctes
- [ ] Logs vérifiés
- [ ] Sauvegardes effectuées
- [ ] DNS configuré
- [ ] SSL/HTTPS activé
- [ ] Monitoring mis en place

## 📊 Statistiques du Projet

- **Langage Principal**: PHP (Laravel)
- **Framework Frontend**: React with TypeScript
- **Base de Données**: PostgreSQL/MySQL
- **Lignes de Code**: 50,000+
- **Modules**: 20+
- **Tests**: 100+
- **Documentation**: 2000+ lignes

## 📅 Changelog

### Version 1.0.0 (En développement)

- ✅ Authentification OAuth (Google, Facebook, Instagram, Microsoft)
- ✅ Gestion multi-tenant
- ✅ Système d'e-commerce complet
- ✅ Admin panel avec Filament
- ✅ API REST avec Sanctum

Voir [CHANGELOG.md](./CHANGELOG.md) pour l'historique complet.

## 📄 Licence

Ce projet est sous la licence MIT. Voir [LICENSE](./LICENSE) pour plus de détails.

## 👥 Auteurs

- **Gauthier Lobanga** - Développeur Principal

## 🙏 Remerciements

- [Laravel Community](https://laravel.com/)
- [React Community](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Filament](https://filamentphp.com/)

## 📞 Contact

- 📧 Email: <contact@yetufy.com>
- 🌐 Website: <https://yetufy.com>
- 💬 Discord: [Lien Communauté]

---

**Pour commencer**, consultez la [documentation complète](./docs/README.md).

**Dernière mise à jour**: 2026-06-01
