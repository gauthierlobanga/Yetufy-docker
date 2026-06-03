# 🧪 Tests - `tests/`

Ce dossier contient tous les tests unitaires et d'intégration.

## 📁 Structure

```
tests/
├── Feature/              # Tests d'intégration
│   ├── Auth/
│   ├── Shop/
│   └── ...
├── Unit/                 # Tests unitaires
│   ├── Services/
│   ├── Models/
│   └── ...
├── Pest.php             # Configuration Pest
└── TestCase.php         # Classe de base
```

## 🧪 Types de Tests

### Tests Unitaires - `tests/Unit/`

Testent des composants isolés (service, helper, modèle).

```php
// tests/Unit/Services/SocialiteServiceTest.php
namespace Tests\Unit\Services;

use App\Services\SocialiteService;
use PHPUnit\Framework\TestCase;

class SocialiteServiceTest extends TestCase
{
    private SocialiteService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new SocialiteService();
    }

    public function test_is_provider_enabled_returns_true()
    {
        config()->set('socialite.providers.google', [
            'enabled' => true,
        ]);

        $this->assertTrue(
            $this->service->isProviderEnabled('google')
        );
    }
}
```

### Tests d'Intégration - `tests/Feature/`

Testent le comportement complet (routes, BD, logique).

```php
// tests/Feature/Auth/LoginTest.php
namespace Tests\Feature\Auth;

use App\Models\User;
use Tests\TestCase;

class LoginTest extends TestCase
{
    public function test_user_can_login(): void
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
        ]);

        $response = $this->post('/login', [
            'email' => 'test@example.com',
            'password' => 'password',
        ]);

        $response->assertRedirect('/dashboard');
        $this->assertAuthenticatedAs($user);
    }

    public function test_user_cannot_login_with_wrong_password(): void
    {
        User::factory()->create([
            'email' => 'test@example.com',
        ]);

        $response = $this->post('/login', [
            'email' => 'test@example.com',
            'password' => 'wrong',
        ]);

        $response->assertSessionHasErrors('email');
        $this->assertGuest();
    }
}
```

## 🏃 Exécuter les Tests

```bash
# Tous les tests
php artisan test

# Dossier spécifique
php artisan test tests/Feature/Auth/

# Fichier spécifique
php artisan test tests/Feature/Auth/LoginTest.php

# Avec output verbeux
php artisan test --verbose

# Avec couverture de code
php artisan test --coverage

# S'arrêter au premier erreur
php artisan test --stop-on-failure

# Afficher les tests lents
php artisan test --profile

# Exécuter les tests en parallèle
php artisan test --parallel
```

## 📝 Écrire des Tests

### Setup et Teardown

```php
class ProductTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        // Code exécuté avant chaque test
        $this->actingAs(User::factory()->create());
    }

    protected function tearDown(): void
    {
        // Code exécuté après chaque test
        parent::tearDown();
    }
}
```

### Fixtures avec Factories

```php
public function test_can_create_product()
{
    $shop = Shop::factory()->create();
    $category = Category::factory()->for($shop)->create();

    $response = $this->post('/products', [
        'name' => 'Test Product',
        'category_id' => $category->id,
        'price' => 99.99,
    ]);

    $this->assertDatabaseHas('products', [
        'name' => 'Test Product',
    ]);
}
```

### Assertions Courantes

```php
// HTTP
$response->assertStatus(200);
$response->assertOk();
$response->assertNotFound();
$response->assertRedirect('/dashboard');

// Base de données
$this->assertDatabaseHas('users', ['email' => 'test@example.com']);
$this->assertDatabaseMissing('users', ['email' => 'old@example.com']);

// Authentification
$this->assertAuthenticated();
$this->assertAuthenticatedAs($user);
$this->assertGuest();

// Sessions
$response->assertSessionHas('success');
$response->assertSessionHasErrors('email');

// Views
$response->assertViewIs('products.show');
$response->assertViewHas('products');
```

## 📊 Couverture de Code

```bash
# Générer un rapport de couverture
php artisan test --coverage

# Avec détails HTML
php artisan test --coverage --coverage-html=coverage/
```

Voir `coverage/index.html` pour un rapport détaillé.

### Objectifs de Couverture

| Partie | Couverture Minimale |
|--------|-------------------|
| Models | 80% |
| Services | 90% |
| Controllers | 70% |
| Global | 75% |

## 🔄 Test Helpers

### Authentification

```php
// Authentifier un utilisateur
$this->actingAs($user);

// Se déconnecter
Auth::logout();

// Tester l'autorisation
$this->post('/products', $data)->assertForbidden();
```

### Requêtes HTTP

```php
// GET
$response = $this->get('/products');

// POST
$response = $this->post('/products', [
    'name' => 'Test',
    'price' => 99.99,
]);

// PUT/PATCH
$response = $this->patch('/products/1', ['name' => 'Updated']);

// DELETE
$response = $this->delete('/products/1');
```

### Seeding

```php
public function test_with_fresh_database()
{
    $this->seed();  // Exécuter DatabaseSeeder

    // Ou seeder spécifique
    $this->seed(ProductSeeder::class);
}
```

## 🐛 Debugging

### Dump et Die

```php
$response->dump();     // Affiche le contenu
$response->dd();       // Affiche et arrête
```

### Logs de Tests

```php
// Voir les logs de la base de données
config(['database.log' => true]);

// Les requêtes SQL seront affichées
```

## 📋 Checklist de Test

Avant de commit:

- [ ] Tous les tests passent (`php artisan test`)
- [ ] Couverture minimale atteinte (75%)
- [ ] Aucune erreur PHP
- [ ] Code formaté (`composer run lint`)

## 🏆 Bonnes Pratiques

### 1. Tests Courts et Focalisés

```php
// ✅ Bon - Une responsabilité
public function test_user_can_login(): void
{
    $user = User::factory()->create();
    $this->actingAs($user);
    $this->assertTrue(Auth::check());
}

// ❌ Mauvais - Trop de assertions
public function test_full_user_flow(): void
{
    // 50 lignes de logique...
}
```

### 2. Nommer Clairement

```php
// ✅ Bon
public function test_authenticated_user_can_create_product(): void
public function test_unauthenticated_user_cannot_delete_product(): void

// ❌ Mauvais
public function test_product_1(): void
public function test_works(): void
```

### 3. Utiliser les Arrange-Act-Assert

```php
// ✅ Bon - Structure claire
public function test_can_update_product(): void
{
    // Arrange (Préparer)
    $product = Product::factory()->create(['name' => 'Old']);
    
    // Act (Agir)
    $response = $this->patch("/products/{$product->id}", [
        'name' => 'New',
    ]);
    
    // Assert (Vérifier)
    $response->assertOk();
    $this->assertEquals('New', $product->fresh()->name);
}
```

### 4. Mocker les Appels Externes

```php
// ✅ Bon
public function test_payment_processing(): void
{
    Stripe::shouldReceive('charge')
        ->andReturn(['status' => 'succeeded']);

    $response = $this->post('/checkout', $orderData);
    $response->assertOk();
}
```

## 📊 Types de Tests Recommandés

```
Unit Tests:         20%
Integration Tests:  50%
Feature Tests:      30%

Pyramide de Test
      /\
     /  \  E2E (Selenium, Playwright)
    /____\
   /      \
  / Integ. \  Tests d'intégration
 /________\
/          \
/ Unit     \  Tests unitaires
/__________\
```

## 🔗 Ressources

- [Laravel Testing Docs](https://laravel.com/docs/testing)
- [Pest PHP](https://pestphp.com/)
- [PHPUnit](https://phpunit.de/)
- [Testing Best Practices](https://laravel.com/docs/testing#best-practices)

---

**Besoin d'aide?** Consultez la [documentation principale](../README.md)
