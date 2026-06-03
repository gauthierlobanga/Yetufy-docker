# 🛣️ Routes - `routes/`

Ce dossier contient la définition de tous les routes de l'application.

## 📁 Structure

```
routes/
├── tenants/              # Routes locataires (multi-tenant)
│   ├── routes.php       # Routes principales
│   └── web.php          # Routes web
├── console/              # Routes console
│   └── routes.php       # Commandes Artisan
├── api.php              # Routes API REST
├── channels.php         # Canaux de broadcasting
└── web.php              # Routes web globales
```

## 🌐 Routes Web - `routes/web.php`

Routes pour l'interface web.

```php
// Routes publiques
Route::get('/', [HomeController::class, 'index'])->name('home');

// Routes authentifiées
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');
});

// Routes admin
Route::middleware(['auth', 'admin'])->group(function () {
    Route::resource('products', ProductController::class);
});
```

## 🏪 Routes Tenant - `routes/tenants/routes.php`

Routes pour le système multi-tenant (principales).

### Structure

```php
Route::middleware([
    'web',
    InitializeTenancyByDomain::class,
    PreventAccessFromCentralDomains::class,
])->group(function () {
    // Routes du tenant ici
});
```

### Routes Principales

```
GET     /                           # Accueil
GET     /product                    # Catalogue
GET     /product/{product}          # Détail produit
GET     /product/category/{cat}     # Catégorie
GET     /blog                       # Blog
GET     /blog/{post}                # Article blog
GET     /login                      # Connexion
POST    /login                      # Soumettre connexion
GET     /register                   # Inscription
POST    /register                   # Soumettre inscription
```

### Routes Authentifiées

```
GET     /acheteur/account           # Mon compte (acheteur)
GET     /vendor/dashboard           # Dashboard vendeur
GET     /checkout                   # Panier
POST    /checkout/process           # Traiter commande
GET     /orders                     # Mes commandes
GET     /orders/{order}             # Détail commande
```

### Routes OAuth

```
GET     /auth/{provider}/redirect   # Redirection OAuth
GET     /auth/{provider}/callback   # Callback OAuth

Providers: google, facebook, instagram, microsoft
```

## 🔌 Routes API - `routes/api.php`

Routes pour l'API REST.

### Structure

```php
Route::middleware('api')->group(function () {
    // Routes publiques
    Route::get('/products', [ProductController::class, 'index']);

    // Routes authentifiées (token)
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/orders', [OrderController::class, 'store']);
    });
});
```

### Endpoints Courants

```
# Produits
GET     /api/products               # Lister
GET     /api/products/{id}          # Détail
POST    /api/products               # Créer
PUT     /api/products/{id}          # Mettre à jour
DELETE  /api/products/{id}          # Supprimer

# Commandes
GET     /api/orders                 # Mes commandes
POST    /api/orders                 # Créer une commande
GET     /api/orders/{id}            # Détail
```

## 🎛️ Routes Console - `routes/console/routes.php`

Commandes Artisan personnalisées.

```php
Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');
```

Exécution:

```bash
php artisan inspire
```

## 📡 Canaux Broadcasting - `routes/channels.php`

Canaux pour les notifications temps réel.

```php
// Canal public
Broadcast::channel('products', function ($user) {
    return true;  // Tout le monde peut écouter
});

// Canal privé
Broadcast::channel('orders.{user_id}', function ($user, $user_id) {
    return (int) $user->id === (int) $user_id;
});

// Canal présence
Broadcast::channel('chat.{room_id}', function ($user, $room_id) {
    if ($user->canJoinRoom($room_id)) {
        return ['id' => $user->id, 'name' => $user->name];
    }
});
```

## 🔐 Middleware

### Authentification

```php
Route::middleware('auth')->group(function () {
    // Requiert authentification
});

Route::middleware('guest')->group(function () {
    // Accès seulement si non-authentifié
});
```

### Rôles et Permissions

```php
// Rôles
Route::middleware('role:admin')->group(function () {
    // Seulement admins
});

// Permissions
Route::middleware('permission:edit-products')->group(function () {
    // Seulement si autorisation
});
```

### Personnalisé

```php
Route::middleware('check-active')->group(function () {
    // Compte actif requis
});
```

## 🏷️ Nommage des Routes

### Convention

```php
// Ressource complète
Route::resource('products', ProductController::class);
// Génère: 
// - products.index    (GET /products)
// - products.show     (GET /products/{id})
// - products.store    (POST /products)
// - products.update   (PUT /products/{id})
// - products.destroy  (DELETE /products/{id})

// Routes nommées
Route::get('/dashboard', [DashboardController::class, 'index'])
    ->name('dashboard');

// Utilisation dans les templates
<a href="{{ route('dashboard') }}">Dashboard</a>
```

### Groupes de Routes

```php
// Grouper par domaine
Route::domain('{account}.platform.com')->group(function () {
    Route::get('/', [AccountController::class, 'show']);
});

// Grouper par préfixe
Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [AdminController::class, 'index'])->name('index');
    // Route nommée: admin.index
});

// Grouper par middleware
Route::middleware('auth')->group(function () {
    Route::get('/account', [AccountController::class, 'show']);
});
```

## 📍 Générateur de Routes

### Créer des URLs dans les vues

```blade
<!-- URL simple -->
<a href="{{ route('products.show', $product) }}">Voir produit</a>

<!-- URL avec paramètres -->
<a href="{{ route('products.show', ['id' => $product->id, 'tab' => 'reviews']) }}">
    Voir avis
</a>

<!-- URL complète -->
{{ route('products.show', $product, absolute: true) }}
```

### Dans les Controllers

```php
// Redirection nommée
return redirect()->route('dashboard');

// Avec messages flash
return redirect()->route('products.index')
    ->with('success', 'Produit créé!');

// Intentée (dernière URL avant redirection)
return redirect()->intended(route('dashboard'));
```

## 🧪 Tester les Routes

### Lister les routes

```bash
# Toutes les routes
php artisan route:list

# Routes spécifiques
php artisan route:list --path=api

# Avec détails
php artisan route:list -v
```

### Tests

```php
// Test d'une route
public function test_can_view_products()
{
    $response = $this->get('/products');
    $response->assertStatus(200);
}

// Test avec authentification
public function test_can_create_order()
{
    $user = User::factory()->create();
    
    $response = $this->actingAs($user)
        ->post('/orders', [
            'product_id' => 1,
            'quantity' => 5,
        ]);
    
    $response->assertRedirect(route('orders.show', $order->id));
}
```

## 📊 Hiérarchie des Routes

```
Routes publiques
├── Accueil
├── Produits
│   ├── Catalogue
│   ├── Détail
│   └── Avis
├── Blog
├── Authentification
│   ├── Login
│   ├── Register
│   └── OAuth

Routes authentifiées
├── Compte utilisateur
├── Commandes
│   ├── Liste
│   ├── Détail
│   └── Retours
├── Wishlist
└── Notifications

Routes admin
├── Utilisateurs
├── Produits
├── Commandes
└── Paramètres

Routes API
├── /api/products
├── /api/orders
└── /api/users
```

## 💡 Bonnes Pratiques

### 1. Grouper Logiquement

```php
// ✅ Bon
Route::prefix('admin')->middleware('auth', 'admin')->group(function () {
    Route::resource('products', ProductController::class);
    Route::resource('users', UserController::class);
});

// ❌ Mauvais
Route::get('/admin/products', [ProductController::class, 'index']);
Route::get('/admin/users', [UserController::class, 'index']);
```

### 2. Utiliser des Noms

```php
// ✅ Bon
Route::get('/products/{product}', [ProductController::class, 'show'])
    ->name('products.show');

// Référencer par nom
redirect()->route('products.show', $product);

// ❌ Mauvais
redirect('/products/' . $product->id);
```

### 3. Model Binding

```php
// ✅ Automatique
Route::get('/products/{product}', function (Product $product) {
    return $product;  // Laravel récupère le modèle
});

// ❌ Manuel
Route::get('/products/{id}', function ($id) {
    $product = Product::find($id);
    return $product;
});
```

## 🔗 Ressources

- [Laravel Docs - Routing](https://laravel.com/docs/routing)
- [Laravel Docs - API Resources](https://laravel.com/docs/eloquent-resources)
- [Inertia.js - Routing](https://inertiajs.com/)

---

**Besoin d'aide?** Consultez la [documentation principale](../README.md)
