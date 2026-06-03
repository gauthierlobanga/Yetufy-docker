# 📚 Documentation - `docs/`

Index central de la documentation du projet Yetufy.

## 🎯 Vue d'Ensemble

Yetufy est une plateforme e-commerce multi-tenant complète avec:

- ✅ Authentification sociale (Google, Facebook, Instagram, Microsoft)
- ✅ Gestion multi-tenant
- ✅ Système d'e-commerce complet
- ✅ Admin panel avec Filament
- ✅ API REST

## 📖 Guides Disponibles

### 🚀 Démarrage

| Document                                  | Durée  | Audience      |
| ----------------------------------------- | ------ | ------------- |
| **[../README.md](../README.md)**          | 10 min | Tout le monde |
| **[Démarrage Rapide](#démarrage-rapide)** | 5 min  | Développeurs  |

### 🔐 Authentification

| Document                       | Contenu                                    |
| ------------------------------ | ------------------------------------------ |
| **SOCIALITE_SETUP.md**         | Configuration OAuth détaillée par provider |
| **SOCIALITE_DEBUGGING.md**     | Debugging et tests                         |
| **SOCIALITE_ADD_PROVIDERS.md** | Ajouter de nouveaux providers              |
| **SOCIALITE_INDEX.md**         | Index complet Socialite                    |

### 📂 Structure du Projet

| Document                                             | Contenu                                     |
| ---------------------------------------------------- | ------------------------------------------- |
| **[../app/README.md](../app/README.md)**             | Code métier (Models, Services, Controllers) |
| **[../database/README.md](../database/README.md)**   | Migrations, Seeders, Factories              |
| **[../routes/README.md](../routes/README.md)**       | Définition des routes                       |
| **[../resources/README.md](../resources/README.md)** | Frontend React/Inertia                      |
| **[../tests/README.md](../tests/README.md)**         | Tests unitaires et d'intégration            |
| **[../config/README.md](../config/README.md)**       | Configuration application                   |
| **[../storage/README.md](../storage/README.md)**     | Logs, Cache, Uploads                        |

## 🚀 Démarrage Rapide

### Installation

```bash
# 1. Cloner le projet
git clone <repository-url>
cd yetu

# 2. Installer les dépendances
composer install
npm install

# 3. Configuration
cp .env.example .env
php artisan key:generate

# 4. Base de données
php artisan migrate
php artisan db:seed

# 5. Compiler les assets
npm run build

# 6. Démarrer l'environnement de développement complet
composer run dev
```

`composer run dev` démarre le serveur Laravel, le worker de queue et Vite. L'application est servie sur `http://localhost:8000`.

### Premier Administrateur

```php
php artisan tinker
>>> App\Models\User::create([
    'name' => 'Admin',
    'email' => 'admin@example.com',
    'password' => bcrypt('password'),
])->assignRole('super_admin');
```

### Accès

- 🌐 Application: `http://localhost:8000`
- 🔐 Admin: `http://localhost:8000/admin`
- Email: `admin@example.com`
- Mot de passe: `password`

## 📊 Architecture

### Flux de Requête

```
1. HTTP Request → 2. Routes → 3. Controllers → 4. Services
    ↓
5. Models (Database) → 6. Services → 7. Controllers
    ↓
8. Response (Inertia/JSON)
```

### Composants Principaux

```
┌─────────────────────────────────────┐
│         Frontend (React)             │
│  - Pages                             │
│  - Composants                        │
│  - State Management                  │
└─────────────────────────────────────┘
            ↑ ↓ (Inertia)
┌─────────────────────────────────────┐
│         Backend (Laravel)            │
│  - Routes                            │
│  - Controllers                       │
│  - Services                          │
│  - Models                            │
└─────────────────────────────────────┘
            ↑ ↓
┌─────────────────────────────────────┐
│      Database (PostgreSQL)           │
│  - Users, Products, Orders, etc.     │
└─────────────────────────────────────┘
```

## 🔑 Modules Principaux

### Authentification (`app/Http/Controllers/Auth/`)

- Email/Mot de passe
- OAuth (Google, Facebook, Instagram, Microsoft)
- Tokens API (Sanctum)
- 2FA

### E-Commerce (`app/Http/Controllers/Shop/`)

- Catalogue produits
- Panier et checkout
- Commandes
- Paiements (Stripe)
- Retours

### Admin (`app/Http/Controllers/Admin/`)

- Gestion utilisateurs
- Gestion produits
- Gestion commandes
- Paramètres

### Vendor (`app/Http/Controllers/Vendor/`)

- Dashboard vendeur
- Gestion produits
- Analyse des ventes
- Gestion des paiements

## 📝 Conventions

### Nommage

```
Models:      Singulier (Product, User)
Tables:      Pluriel (products, users)
Controllers: {Resource}Controller
Services:    {Domain}Service
Migrations:  timestamp_action_table
```

### Dossiers

```
app/                    # Code métier
├── Http/              # Contrôleurs
├── Models/            # Modèles
├── Services/          # Services
└── ...

database/             # BD
├── migrations/        # Versioning
├── seeders/          # Données initiales
└── factories/        # Données tests

resources/            # Frontend
├── js/               # Composants React
└── css/              # Stylesheets

tests/               # Tests
├── Feature/         # Intégration
└── Unit/            # Unitaires
```

## 🧪 Tester

### Commandes Courantes

```bash
# Tous les tests
php artisan test

# Tests spécifiques
php artisan test tests/Feature/Auth/

# Avec couverture
php artisan test --coverage

# Voir les requêtes lentes
php artisan test --profile
```

### Commandes Utiles

```bash
# Lancer l'environnement de développement
composer run dev

# Voir les routes
php artisan route:list

# Tinker shell
php artisan tinker

# Optimiser l'application
php artisan optimize

# Nettoyer les caches
php artisan cache:clear
php artisan config:clear
```

## 🚀 Déploiement

### Checklist Production

- [ ] Variables d'environnement configurées
- [ ] Base de données migrée
- [ ] Assets compilés (`npm run build`)
- [ ] Caches générés (`php artisan config:cache`)
- [ ] Tests passent (`php artisan test`)
- [ ] Logs configurés
- [ ] Monitoring mis en place
- [ ] Backups configurées

### Commands Production

```bash
# Optimiser pour production
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Compiler assets
npm run build

# Migrer la BD
php artisan migrate --force

# Redémarrer les workers
php artisan queue:restart
```

## 📊 Statistiques

| Métrique       | Valeur       |
| -------------- | ------------ |
| Lignes de code | 50,000+      |
| Modèles        | 15+          |
| Controllers    | 30+          |
| Services       | 20+          |
| Routes         | 100+         |
| Migrations     | 30+          |
| Tests          | 100+         |
| Documentation  | 2000+ lignes |

## 🔗 Ressources Externes

### Laravel

- [Laravel Documentation](https://laravel.com/docs)
- [Laravel API](https://laravel.com/api)
- [Laravel Ecosystem](https://laravel.com/partners)

### Frontend

- [React Documentation](https://react.dev/)
- [Inertia.js](https://inertiajs.com/)
- [Tailwind CSS](https://tailwindcss.com/)

### Base de Données

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Eloquent ORM](https://laravel.com/docs/eloquent)

### Outils

- [Composer](https://getcomposer.org/)
- [npm](https://www.npmjs.com/)
- [Vite](https://vitejs.dev/)
- [Docker](https://www.docker.com/)

## 🤝 Contribution

### Procédure

1. Fork le repository
2. Créer une branche (`git checkout -b feature/...`)
3. Commit les changements (`git commit -m 'feat: ...'`)
4. Push la branche (`git push origin feature/...`)
5. Créer une Pull Request

### Standards de Code

- ✅ Laravel PSR-12
- ✅ Tests > 75% couverture
- ✅ Typescript strict
- ✅ Pas de hardcoded values
- ✅ Documentation mise à jour

## 📞 Support

### Ressources

- 📖 [Documentation principale](../README.md)
- 🔐 [Authentification OAuth](./SOCIALITE_README.md)
- 🐛 [Debugging](./SOCIALITE_DEBUGGING.md)

### Problèmes Courants

| Problème               | Solution                                  |
| ---------------------- | ----------------------------------------- |
| "Provider not enabled" | Vérifier `.env` et `config/socialite.php` |
| Tests échouent         | Vérifier la base de données (`:memory:`)  |
| Assets non compilés    | Exécuter `npm run build`                  |
| Routes non trouvées    | Exécuter `php artisan route:cache`        |

## 📈 Roadmap

### En Cours

- ✅ Authentification OAuth
- ✅ Système e-commerce
- ✅ Admin panel

### Prévu

- [ ] OAuth Apple
- [ ] SSO entreprise
- [ ] Webhook
- [ ] Intégration IA
- [ ] Mobile app

## 📄 Licence

Ce projet est sous licence MIT. Voir [LICENSE](../LICENSE) pour plus de détails.

## 👥 Auteurs

- **Gauthier Lobanga** - Développeur Principal

## 📅 Dernière Mise à Jour

**Date**: 2026-06-01  
**Version**: 1.0.0  
**Statut**: En développement actif

---

## 🗂️ Accès Rapide aux Docs

```
Documentation/
├── 📖 README (ce fichier)
├── 🚀 [../README.md - Vue d'ensemble](../README.md)
├── 📱 [../app/README.md - Code métier](../app/README.md)
├── 💾 [../database/README.md - Base de données](../database/README.md)
├── 🛣️ [../routes/README.md - Routes](../routes/README.md)
├── 🎨 [../resources/README.md - Frontend](../resources/README.md)
├── 🧪 [../tests/README.md - Tests](../tests/README.md)
├── ⚙️ [../config/README.md - Configuration](../config/README.md)
├── 💿 [../storage/README.md - Storage](../storage/README.md)
├── 🔐 [SOCIALITE_SETUP.md - Configuration OAuth](./SOCIALITE_SETUP.md)
├── 🐛 [SOCIALITE_DEBUGGING.md - Debugging](./SOCIALITE_DEBUGGING.md)
└── ➕ [SOCIALITE_ADD_PROVIDERS.md - Ajouter providers](./SOCIALITE_ADD_PROVIDERS.md)
```

**Besoin de plus d'aide?** Consultez la documentation spécifique ou les issues du projet.
