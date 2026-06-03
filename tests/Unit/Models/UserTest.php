<?php

use App\Models\User;
use App\Models\Tenant;
use App\Models\Client;
use App\Models\Adresse;
use App\Models\Panier;
use App\Models\Commande;
use App\Models\AvisClient;
use App\Models\AuditLog;
use App\Models\Post;
use Filament\Panel;
use Illuminate\Support\Facades\Schema;
use function Pest\Laravel\assertModelExists;
use function Pest\Laravel\assertModelMissing;
use function Pest\Laravel\assertSoftDeleted;

beforeEach(function () {
    // Setup test data
});

it('can create a user', function () {
    $user = User::factory()->create([
        'name' => 'John Doe',
        'email' => 'john@example.com',
    ]);

    assertModelExists($user);
    expect($user->name)->toBe('John Doe');
    expect($user->email)->toBe('john@example.com');
});

it('uses UUID as primary key', function () {
    $user = User::factory()->create();
    
    expect($user->id)->toBeString();
    expect($user->incrementing)->toBeFalse();
});

it('has fillable attributes', function () {
    $user = User::factory()->create([
        'name' => 'Test User',
        'email' => 'test@example.com',
        'is_active' => true,
    ]);

    expect($user->name)->toBe('Test User');
    expect($user->email)->toBe('test@example.com');
    expect($user->is_active)->toBeTrue();
});

it('hides sensitive attributes', function () {
    $user = User::factory()->create([
        'password' => 'secret123',
        'two_factor_secret' => '2fa_secret',
    ]);

    $array = $user->toArray();
    expect($array)->not->toHaveKey('password');
    expect($array)->not->toHaveKey('two_factor_secret');
    expect($array)->not->toHaveKey('remember_token');
});

it('casts attributes correctly', function () {
    $user = User::factory()->create([
        'is_active' => '1',
        'email_verifie' => '1',
        'preferences' => ['theme' => 'dark'],
        'email_verified_at' => '2024-01-01',
    ]);

    expect($user->is_active)->toBeBool();
    expect($user->is_active)->toBeTrue();
    expect($user->email_verifie)->toBeBool();
    expect($user->preferences)->toBeArray();
    expect($user->email_verified_at)->toBeInstanceOf(\Illuminate\Support\Carbon::class);
});

it('has many tenants', function () {
    $user = User::factory()->create();
    $tenant = Tenant::factory()->create();
    $user->tenants()->attach($tenant->id);

    expect($user->tenants)->toHaveCount(1);
    expect($user->tenants->first()->id)->toBe($tenant->id);
});

it('has many posts', function () {
    $user = User::factory()->create();
    Post::factory()->count(3)->create(['user_id' => $user->id]);

    expect($user->posts)->toHaveCount(3);
});

it('has one client', function () {
    $user = User::factory()->create();
    $client = Client::factory()->create(['user_id' => $user->id]);

    expect($user->client)->toBeInstanceOf(Client::class);
    expect($user->client->id)->toBe($client->id);
});

it('has many paniers', function () {
    $user = User::factory()->create();
    Panier::factory()->count(5)->create(['user_id' => $user->id]);

    expect($user->paniers)->toHaveCount(5);
});

it('has many commandes', function () {
    $user = User::factory()->create();
    Commande::factory()->count(2)->create(['user_id' => $user->id]);

    expect($user->commandes)->toHaveCount(2);
});

it('has many avis', function () {
    $user = User::factory()->create();
    AvisClient::factory()->count(4)->create(['user_id' => $user->id]);

    expect($user->avis)->toHaveCount(4);
});

it('has many audit logs', function () {
    $user = User::factory()->create();
    AuditLog::factory()->count(3)->create(['user_id' => $user->id]);

    expect($user->auditLogs)->toHaveCount(3);
});

it('has morph many adresses', function () {
    $user = User::factory()->create();
    Adresse::factory()->count(2)->create([
        'addressable_type' => User::class,
        'addressable_id' => $user->id,
    ]);

    expect($user->adresses)->toHaveCount(2);
});

it('returns filament name', function () {
    $user = User::factory()->create(['name' => 'Test User']);

    expect($user->getFilamentName())->toBe('Test User');
});

it('returns avatar url', function () {
    $user = User::factory()->create(['name' => 'John Doe']);

    expect($user->avatar_url)->toBeString();
    expect($user->avatar_url)->toContain('ui-avatars.com');
});

it('returns full name with prenom', function () {
    $user = User::factory()->create([
        'name' => 'Doe',
        'prenom' => 'John',
    ]);

    expect($user->full_name)->toBe('John Doe');
});

it('returns full name without prenom', function () {
    $user = User::factory()->create([
        'name' => 'John Doe',
        'prenom' => null,
    ]);

    expect($user->full_name)->toBe('John Doe');
});

it('returns initials', function () {
    $user = User::factory()->create(['name' => 'John Doe']);

    expect($user->initials)->toBe('JD');
});

it('checks if user is admin', function () {
    $admin = User::factory()->create();
    $admin->assignRole('super_admin');

    $user = User::factory()->create();

    expect($admin->is_admin)->toBeTrue();
    expect($user->is_admin)->toBeFalse();
});

it('returns last login attribute', function () {
    $user = User::factory()->create([
        'dernier_connexion' => now()->subHour(),
    ]);

    expect($user->last_login)->toBeString();
});

it('scopes active users', function () {
    User::factory()->create(['is_active' => true]);
    User::factory()->create(['is_active' => false]);
    User::factory()->create(['is_active' => true]);

    $activeUsers = User::active()->get();

    expect($activeUsers)->toHaveCount(2);
});

it('scopes inactive users', function () {
    User::factory()->create(['is_active' => true]);
    User::factory()->create(['is_active' => false]);
    User::factory()->create(['is_active' => false]);

    $inactiveUsers = User::inactive()->get();

    expect($inactiveUsers)->toHaveCount(2);
});

it('scopes verified users', function () {
    User::factory()->create(['email_verified_at' => now()]);
    User::factory()->create(['email_verified_at' => null]);
    User::factory()->create(['email_verified_at' => now()]);

    $verifiedUsers = User::verified()->get();

    expect($verifiedUsers)->toHaveCount(2);
});

it('scopes unverified users', function () {
    User::factory()->create(['email_verified_at' => now()]);
    User::factory()->create(['email_verified_at' => null]);
    User::factory()->create(['email_verified_at' => null]);

    $unverifiedUsers = User::unverified()->get();

    expect($unverifiedUsers)->toHaveCount(2);
});

it('scopes by role', function () {
    $admin = User::factory()->create();
    $admin->assignRole('super_admin');

    $user = User::factory()->create();
    $user->assignRole('user');

    $admins = User::byRole('super_admin')->get();

    expect($admins)->toHaveCount(1);
    expect($admins->first()->id)->toBe($admin->id);
});

it('scopes search by name or email', function () {
    User::factory()->create(['name' => 'John Doe', 'email' => 'john@example.com']);
    User::factory()->create(['name' => 'Jane Smith', 'email' => 'jane@example.com']);
    User::factory()->create(['name' => 'Bob Johnson', 'email' => 'bob@example.com']);

    $results = User::search('john')->get();

    expect($results)->toHaveCount(2);
});

it('returns permissions list', function () {
    $user = User::factory()->create();
    $user->givePermissionTo('edit posts', 'delete posts');

    $permissions = $user->permissions_list;

    expect($permissions)->toBeArray();
    expect($permissions)->toContain('edit posts');
    expect($permissions)->toContain('delete posts');
});

it('returns roles list', function () {
    $user = User::factory()->create();
    $user->assignRole('admin', 'editor');

    $roles = $user->roles_list;

    expect($roles)->toBeArray();
    expect($roles)->toContain('admin');
    expect($roles)->toContain('editor');
});

it('marks email as verified', function () {
    $user = User::factory()->create(['email_verified_at' => null]);

    $result = $user->markEmailAsVerified();

    expect($result)->toBeTrue();
    expect($user->email_verified_at)->not->toBeNull();
});

it('marks email as unverified', function () {
    $user = User::factory()->create(['email_verified_at' => now()]);

    $result = $user->markEmailAsUnverified();

    expect($result)->toBeTrue();
    expect($user->email_verified_at)->toBeNull();
});

it('updates last login', function () {
    $user = User::factory()->create(['dernier_connexion' => null]);

    $user->updateLastLogin();

    expect($user->dernier_connexion)->not->toBeNull();
});

it('toggles active status', function () {
    $user = User::factory()->create(['is_active' => true]);

    $user->toggleActive();

    expect($user->is_active)->toBeFalse();

    $user->toggleActive();

    expect($user->is_active)->toBeTrue();
});

it('gets preference', function () {
    $user = User::factory()->create([
        'preferences' => ['theme' => 'dark', 'language' => 'fr'],
    ]);

    expect($user->getPreference('theme'))->toBe('dark');
    expect($user->getPreference('nonexistent', 'default'))->toBe('default');
});

it('sets preference', function () {
    $user = User::factory()->create(['preferences' => null]);

    $user->setPreference('theme', 'light');

    expect($user->getPreference('theme'))->toBe('light');
});

it('sets is_active to true on creation if not set', function () {
    $user = new User([
        'name' => 'Test',
        'email' => 'test@example.com',
        'password' => bcrypt('password'),
    ]);
    $user->save();

    expect($user->is_active)->toBeTrue();
});

it('can access admin panel if super admin and active', function () {
    $admin = User::factory()->create(['is_active' => true]);
    $admin->assignRole('super_admin');

    $panel = Mockery::mock(Panel::class);
    $panel->shouldReceive('getId')->andReturn('admin');

    expect($admin->canAccessPanel($panel))->toBeTrue();
});

it('cannot access admin panel if not super admin', function () {
    $user = User::factory()->create(['is_active' => true]);
    $user->assignRole('user');

    $panel = Mockery::mock(Panel::class);
    $panel->shouldReceive('getId')->andReturn('admin');

    expect($user->canAccessPanel($panel))->toBeFalse();
});

it('can access vendeur panel if has tenant or manager role', function () {
    $user = User::factory()->create(['is_active' => true]);
    $tenant = Tenant::factory()->create();
    $user->tenants()->attach($tenant->id);

    $panel = Mockery::mock(Panel::class);
    $panel->shouldReceive('getId')->andReturn('vendeur');

    expect($user->canAccessPanel($panel))->toBeTrue();
});

it('can impersonate if super admin and active', function () {
    $admin = User::factory()->create(['is_active' => true]);
    $admin->assignRole('super_admin');

    expect($admin->canImpersonate())->toBeTrue();
});

it('cannot impersonate if not super admin', function () {
    $user = User::factory()->create(['is_active' => true]);
    $user->assignRole('user');

    expect($user->canImpersonate())->toBeFalse();
});

it('can be impersonated if not self and not id 1', function () {
    $user = User::factory()->create(['id' => '2', 'email' => 'user@example.com']);

    expect($user->canBeImpersonated())->toBeTrue();
});

it('cannot be impersonated if id is 1', function () {
    $user = User::factory()->create(['id' => '1']);

    expect($user->canBeImpersonated())->toBeFalse();
});

it('cannot be impersonated if has gmail email', function () {
    $user = User::factory()->create(['email' => 'user@gmail.com']);

    expect($user->canBeImpersonated())->toBeFalse();
});

it('has client relationship', function () {
    $user = User::factory()->create();
    $client = Client::factory()->create(['user_id' => $user->id]);

    expect($user->hasClient())->toBeTrue();
});

it('does not have client relationship', function () {
    $user = User::factory()->create();

    expect($user->hasClient())->toBeFalse();
});

it('uses soft deletes', function () {
    $user = User::factory()->create();
    $userId = $user->id;

    $user->delete();

    assertSoftDeleted('users', ['id' => $userId]);
    assertModelMissing($user);
});

it('returns tenants for super admin', function () {
    $admin = User::factory()->create();
    $admin->assignRole('super_admin');

    Tenant::factory()->count(3)->create();

    $panel = Mockery::mock(Panel::class);
    $tenants = $admin->getTenants($panel);

    expect($tenants)->toHaveCount(3);
});

it('returns own tenants for regular user', function () {
    $user = User::factory()->create();
    $tenant1 = Tenant::factory()->create();
    $tenant2 = Tenant::factory()->create();
    Tenant::factory()->create(); // Not attached to user

    $user->tenants()->attach([$tenant1->id, $tenant2->id]);

    $panel = Mockery::mock(Panel::class);
    $tenants = $user->getTenants($panel);

    expect($tenants)->toHaveCount(2);
});

it('can access tenant if super admin', function () {
    $admin = User::factory()->create();
    $admin->assignRole('super_admin');

    $tenant = Tenant::factory()->create();

    expect($admin->canAccessTenant($tenant))->toBeTrue();
});

it('can access tenant if belongs to tenant', function () {
    $user = User::factory()->create();
    $tenant = Tenant::factory()->create();
    $user->tenants()->attach($tenant->id);

    expect($user->canAccessTenant($tenant))->toBeTrue();
});

it('cannot access tenant if not belongs to tenant', function () {
    $user = User::factory()->create();
    $tenant = Tenant::factory()->create();

    expect($user->canAccessTenant($tenant))->toBeFalse();
});

it('returns adresse facturation', function () {
    $user = User::factory()->create();
    $adresse = Adresse::factory()->create([
        'addressable_type' => User::class,
        'addressable_id' => $user->id,
        'type' => 'facturation',
        'est_defaut' => true,
    ]);

    expect($user->adresseFacturation)->toBeInstanceOf(Adresse::class);
});

it('returns adresse livraison', function () {
    $user = User::factory()->create();
    $adresse = Adresse::factory()->create([
        'addressable_type' => User::class,
        'addressable_id' => $user->id,
        'type' => 'livraison',
        'est_defaut' => true,
    ]);

    expect($user->adresseLivraison)->toBeInstanceOf(Adresse::class);
});
