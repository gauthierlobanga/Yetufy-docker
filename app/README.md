# 📱 Application Code - `app/`

Ce dossier contient toute la logique métier de l'application Laravel.

## 📁 Structure

```
app/
├── Actions/                  # Actions réutilisables
├── Ai/                      # Intégrations IA (Claude, etc)
├── Concerns/                # Traits partagés
├── Console/                 # Commandes Artisan
├── Contracts/               # Interfaces/contrats
├── Enums/                   # Énumérations
├── Events/                  # Événements métier
├── Filament/                # Panneaux Filament (Admin)
├── Http/                    # Controllers, Middleware, etc
├── Jobs/                    # Jobs en arrière-plan
├── Listeners/               # Écouteurs d'événements
├── Models/                  # Modèles Eloquent
├── Notifications/           # Notifications
├── Observers/               # Observateurs de modèles
├── Policies/                # Politiques d'autorisation
├── Providers/               # Service providers
├── Services/                # Services métier
├── Settings/                # Paramètres d'application
├── Support/                 # Classes de support
├── Tenancy/                 # Gestion du multi-tenant
├── Traits/                  # Traits réutilisables
└── ValueObjects/            # Objets de valeur
```

## 🎯 Répertoires Principaux

### `Http/`

Contient les contrôleurs, middleware et logique HTTP.

```
Http/
├── Controllers/
│   ├── Auth/              # Authentification
│   ├── Admin/             # Admin panel
│   ├── Shop/              # E-commerce
│   ├── Vendor/            # Espace vendeur
│   └── ...
├── Middleware/
├── Requests/              # Form Requests (validation)
├── Resources/             # API Resources
└── Responses/             # Réponses personnalisées
```

**Exemple: Controller**

```php
namespace App\Http\Controllers\Shop;

class ProductController extends Controller
{
    public function index()
    {
        return inertia('products/index', [
            'products' => Product::paginate()
        ]);
    }
}
```

### `Models/`

Modèles Eloquent et relations de base de données.

```
Models/
├── User.php              # Utilisateur
├── Product.php           # Produit
├── Order.php             # Commande
├── Shop.php              # Boutique/Tenant
├── ...
```

**Exemple: Model**

```php
namespace App\Models;

class Product extends Model
{
    protected $fillable = ['name', 'description', 'price'];
    
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}
```

### `Services/`

Logique métier centralisée et réutilisable.

```
Services/
├── SocialiteService.php   # Authentification OAuth
├── ProductService.php     # Logique produits
├── OrderService.php       # Logique commandes
└── ...
```

**Exemple: Service**

```php
namespace App\Services;

class SocialiteService
{
    public function findOrCreateUser($socialUser, $provider)
    {
        // Logique de création/authentification
    }
}
```

### `Jobs/`

Jobs en arrière-plan exécutés via la queue.

```
Jobs/
├── ProcessOrder.php
├── SendNotification.php
└── ...
```

### `Events/` & `Listeners/`

Système d'événements pub/sub.

```
Events/
├── OrderCreated.php       # Événement
└── 

Listeners/
├── SendOrderConfirmation.php  # Écouteur
```

### `Notifications/`

Notifications (email, SMS, etc).

```
Notifications/
├── OrderConfirmation.php
├── PaymentReceived.php
└── ...
```

### `Policies/`

Autorisation des actions utilisateur.

```
Policies/
├── ProductPolicy.php
├── OrderPolicy.php
└── ...
```

**Exemple: Policy**

```php
public function update(User $user, Product $product)
{
    return $user->id === $product->shop_id;
}
```

### `Filament/`

Panneaux d'administration Filament.

```
Filament/
├── Resources/
│   ├── ProductResource.php
│   └── OrderResource.php
├── Pages/
│   └── Dashboard.php
└── Widgets/
```

### `Providers/`

Service providers pour l'enregistrement des services.

```
Providers/
├── AppServiceProvider.php
├── AuthServiceProvider.php
└── EventServiceProvider.php
```

### `Traits/` & `Concerns/`

Code réutilisable partagé entre modèles.

```
Traits/
├── HasTimestamps.php
├── HasUuids.php
└── ...

Concerns/
├── HasUserPreferences.php
└── ...
```

### `Enums/`

Énumérations pour les valeurs limitées.

```
Enums/
├── OrderStatus.php       # pending, completed, cancelled
├── ProductStatus.php     # draft, published, archived
└── ...
```

### `ValueObjects/`

Objets de valeur pour encapsuler des données.

```
ValueObjects/
├── Money.php            # Montant en devise
├── Address.php          # Adresse
└── ...
```

### `Tenancy/`

Gestion du multi-tenant (isolation par boutique).

```
Tenancy/
├── Middleware/
├── Models/
└── ...
```

### `Console/`

Commandes Artisan personnalisées.

```
Console/
├── Commands/
│   ├── CreateAdmin.php
│   ├── GenerateReport.php
│   └── ...
```

**Exemple: Command**

```php
php artisan make:admin --email=admin@example.com
```

## 🔄 Flux de Données

### Request → Response

```
HTTP Request
    ↓
Route
    ↓
Controller
    ↓
Service (logique métier)
    ↓
Model (base de données)
    ↓
Service (transformation)
    ↓
Controller
    ↓
Response (Inertia/JSON)
```

### Exemple Complet

```php
// 1. Route (routes/tenants/routes.php)
Route::get('/products/{product}', [ProductController::class, 'show']);

// 2. Controller
class ProductController
{
    public function show(Product $product, ProductService $service)
    {
        $data = $service->prepareProductData($product);
        return inertia('products/show', $data);
    }
}

// 3. Service
class ProductService
{
    public function prepareProductData(Product $product)
    {
        return [
            'product' => $product->load('reviews'),
            'recommendations' => $this->getRecommendations($product)
        ];
    }
}

// 4. Model
class Product extends Model
{
    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}
```

## 📝 Conventions

### Nommage des Classes

| Type | Convention | Exemple |
|------|-----------|---------|
| Model | Singulier | `Product`, `User`, `Order` |
| Controller | Ressource + Controller | `ProductController`, `OrderController` |
| Service | Nom domaine + Service | `ProductService`, `PaymentService` |
| Job | Action + Job | `ProcessOrder`, `SendNotification` |
| Event | Action + Ed | `ProductCreated`, `OrderProcessed` |
| Listener | Action + Listener | `SendConfirmation`, `UpdateInventory` |
| Policy | Singulier + Policy | `ProductPolicy`, `OrderPolicy` |

### Nommage des Méthodes

```php
// CRUD
store()      // Créer
show()       // Afficher
update()     // Mettre à jour
destroy()    // Supprimer
index()      // Lister

// Requêtes
get()        // Récupérer
find()       // Chercher par ID
where()      // Requête avec filtre
first()      // Premier résultat

// Vérifications
is*()        // Vrai/Faux (isActive)
has*()       // Relation existe (hasReviews)
can*()       // Autorisation (canEdit)
```

## 🧪 Tester l'Application

### Unit Tests

```bash
# Tous les tests
php artisan test

# Dossier spécifique
php artisan test tests/Unit/Services/
```

### Tinker Shell

```bash
php artisan tinker

>>> $product = App\Models\Product::find(1)
>>> $product->reviews()->count()
>>> $product->load('shop')
```

## 🚀 Bonnes Pratiques

### 1. Services au lieu de Logique dans les Controllers

```php
// ❌ Mauvais
class ProductController {
    public function store(Request $request) {
        $product = new Product();
        $product->name = $request->name;
        // 100 lignes de logique...
    }
}

// ✅ Bon
class ProductController {
    public function store(Request $request, ProductService $service) {
        $product = $service->create($request->validated());
    }
}
```

### 2. Modèles Minces, Services Épais

```php
// ❌ Model gonflé
class Product extends Model {
    public function calculateDiscount() { /* ... */ }
    public function sendNotification() { /* ... */ }
    public function generateReport() { /* ... */ }
}

// ✅ Service séparé
class ProductService {
    public function calculateDiscount(Product $product) { /* ... */ }
    public function sendNotification(Product $product) { /* ... */ }
    public function generateReport(Product $product) { /* ... */ }
}
```

### 3. Utiliser les Events pour les Actions Asynchrones

```php
// ✅ Bon - avec événement
class OrderController {
    public function store(Request $request) {
        $order = Order::create($request->validated());
        OrderCreated::dispatch($order);
        return redirect('/success');
    }
}

// Listener exécuté en arrière-plan
class SendConfirmation implements ShouldQueue {
    public function handle(OrderCreated $event) {
        Mail::send(new OrderConfirmation($event->order));
    }
}
```

## 📊 Hiérarchie des Modèles

```
User
├── (multi-tenant via tenants())
├── Orders
├── Addresses
└── Preferences

Shop (Tenant)
├── Products
├── Categories
├── Orders
└── Settings

Product
├── Reviews
├── Images
└── Category

Order
├── Items
├── Payment
└── Shipment
```

## 🔗 Ressources

- [Laravel Docs - Eloquent](https://laravel.com/docs/eloquent)
- [Laravel Docs - Controllers](https://laravel.com/docs/controllers)
- [Laravel Docs - Services Pattern](https://laravel.com/docs/service-container)
- [Filament Documentation](https://filamentphp.com/)

---

**Besoin d'aide?** Consultez la [documentation principale](../README.md)
