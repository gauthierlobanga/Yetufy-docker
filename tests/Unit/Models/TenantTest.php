<?php

use App\Models\Client;
use App\Models\Commande;
use App\Models\Panier;
use App\Models\Plan;
use App\Models\Produit;
use App\Models\Tenant;
use App\Models\TypeDocumentLegal;
use App\Models\User;
use App\Models\VendorRequest;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

use function Pest\Laravel\assertModelExists;
use function Pest\Laravel\assertModelMissing;
use function Pest\Laravel\assertSoftDeleted;

beforeEach(function () {
    // Setup test data
});

it('can create a tenant', function () {
    $tenant = Tenant::factory()->create([
        'raison_sociale' => 'Test Company',
        'slug' => 'test-company',
        'email' => 'test@example.com',
        'statut' => Tenant::STATUT_EN_ATTENTE,
    ]);

    assertModelExists($tenant);
    expect($tenant->raison_sociale)->toBe('Test Company');
    expect($tenant->slug)->toBe('test-company');
    expect($tenant->statut)->toBe(Tenant::STATUT_EN_ATTENTE);
});

it('uses UUID as primary key', function () {
    $tenant = Tenant::factory()->create();

    expect($tenant->id)->toBeString();
    expect(Str::isUuid($tenant->id))->toBeTrue();
    expect($tenant->incrementing)->toBeFalse();
});

it('auto-generates slug from raison_sociale', function () {
    $tenant = Tenant::factory()->create([
        'raison_sociale' => 'Ma Super Entreprise',
        'slug' => null,
    ]);

    expect($tenant->slug)->toBe('ma-super-entreprise');
});

it('auto-generates UUID on creation', function () {
    $tenant = new Tenant([
        'raison_sociale' => 'Test',
        'email' => 'test@example.com',
    ]);
    $tenant->save();

    expect($tenant->id)->toBeString();
    expect(Str::isUuid($tenant->id))->toBeTrue();
});

it('has fillable attributes', function () {
    $tenant = Tenant::factory()->create([
        'raison_sociale' => 'Test Company',
        'slug' => 'test-company',
        'email' => 'test@example.com',
        'telephone' => '+243123456789',
        'is_active' => true,
        'type_entite' => Tenant::TYPE_SARL,
        'statut' => Tenant::STATUT_ACTIF,
    ]);

    expect($tenant->raison_sociale)->toBe('Test Company');
    expect($tenant->email)->toBe('test@example.com');
    expect($tenant->telephone)->toBe('+243123456789');
    expect($tenant->is_active)->toBeTrue();
    expect($tenant->type_entite)->toBe(Tenant::TYPE_SARL);
});

it('hides password and remember_token', function () {
    $tenant = Tenant::factory()->create([
        'password' => 'secret123',
    ]);

    $array = $tenant->toArray();
    expect($array)->not->toHaveKey('password');
    expect($array)->not->toHaveKey('remember_token');
});

it('casts attributes correctly', function () {
    $tenant = Tenant::factory()->create([
        'is_active' => '1',
        'configuration' => ['key' => 'value'],
        'metadata' => ['meta' => 'data'],
        'date_activation' => '2024-01-01',
        'date_expiration' => '2024-12-31',
    ]);

    expect($tenant->is_active)->toBeBool();
    expect($tenant->is_active)->toBeTrue();
    expect($tenant->configuration)->toBeArray();
    expect($tenant->configuration)->toBe(['key' => 'value']);
    expect($tenant->metadata)->toBeArray();
    expect($tenant->date_activation)->toBeInstanceOf(Carbon::class);
    expect($tenant->date_expiration)->toBeInstanceOf(Carbon::class);
});

it('returns correct statuts list', function () {
    $statuts = Tenant::getStatuts();

    expect($statuts)->toBeArray();
    expect($statuts)->toHaveKey(Tenant::STATUT_ACTIF);
    expect($statuts)->toHaveKey(Tenant::STATUT_INACTIF);
    expect($statuts)->toHaveKey(Tenant::STATUT_EN_ATTENTE);
    expect($statuts)->toHaveKey(Tenant::STATUT_SUSPENDU);
    expect($statuts[Tenant::STATUT_ACTIF])->toBe('Actif');
});

it('returns correct types entite list', function () {
    $types = Tenant::getTypesEntite();

    expect($types)->toBeArray();
    expect($types)->toHaveKey(Tenant::TYPE_SARL);
    expect($types)->toHaveKey(Tenant::TYPE_SA);
    expect($types)->toHaveKey(Tenant::TYPE_SUARL);
    expect($types[Tenant::TYPE_SARL])->toBe('SARL');
});

it('hashes password on set', function () {
    $tenant = Tenant::factory()->create([
        'password' => 'plain_password',
    ]);

    expect($tenant->password)->not->toBe('plain_password');
    expect(Hash::check('plain_password', $tenant->password))->toBeTrue();
});

it('does not rehash already hashed password', function () {
    $hashed = Hash::make('password');
    $tenant = Tenant::factory()->create([
        'password' => $hashed,
    ]);

    expect($tenant->password)->toBe($hashed);
});

it('belongs to a plan', function () {
    $plan = Plan::factory()->create();
    $tenant = Tenant::factory()->create(['plan_id' => $plan->id]);

    expect($tenant->plan)->toBeInstanceOf(Plan::class);
    expect($tenant->plan->id)->toBe($plan->id);
});

it('has many users', function () {
    $tenant = Tenant::factory()->create();
    $user = User::factory()->create();
    $tenant->users()->attach($user->id);

    expect($tenant->users)->toHaveCount(1);
    expect($tenant->users->first()->id)->toBe($user->id);
});

it('has many produits', function () {
    $tenant = Tenant::factory()->create();

    $count = $tenant->run(function () {
        Produit::factory()->count(3)->create();

        return Produit::count();
    });

    expect($count)->toBe(3);
});

it('has many commandes', function () {
    $tenant = Tenant::factory()->create();

    $count = $tenant->run(function () {
        Commande::factory()->count(5)->create();

        return Commande::count();
    });

    expect($count)->toBe(5);
});

it('has many clients', function () {
    $tenant = Tenant::factory()->create();

    $count = $tenant->run(function () {
        Client::factory()->count(10)->create();

        return Client::count();
    });

    expect($count)->toBe(10);
});

it('has many paniers', function () {
    $tenant = Tenant::factory()->create();

    $count = $tenant->run(function () {
        Panier::factory()->count(7)->create();

        return Panier::count();
    });

    expect($count)->toBe(7);
});

it('has one vendor request', function () {
    $tenant = Tenant::factory()->create();
    $vendorRequest = VendorRequest::factory()->create(['tenant_id' => $tenant->id]);

    expect($tenant->vendorRequest)->toBeInstanceOf(VendorRequest::class);
    expect($tenant->vendorRequest->id)->toBe($vendorRequest->id);
});

it('checks if tenant is active', function () {
    $activeTenant = Tenant::factory()->create([
        'statut' => Tenant::STATUT_ACTIF,
        'is_active' => true,
    ]);

    $inactiveTenant = Tenant::factory()->create([
        'statut' => Tenant::STATUT_INACTIF,
        'is_active' => false,
    ]);

    expect($activeTenant->estActif())->toBeTrue();
    expect($inactiveTenant->estActif())->toBeFalse();
});

it('checks if tenant is expired', function () {
    $expiredTenant = Tenant::factory()->create([
        'date_expiration' => now()->subDay(),
    ]);

    $activeTenant = Tenant::factory()->create([
        'date_expiration' => now()->addMonth(),
    ]);

    expect($expiredTenant->estExpire())->toBeTrue();
    expect($activeTenant->estExpire())->toBeFalse();
});

it('checks if tenant is accessible', function () {
    $tenant = Tenant::factory()->create([
        'statut' => Tenant::STATUT_ACTIF,
        'is_active' => true,
    ]);
    VendorRequest::factory()->create([
        'tenant_id' => $tenant->id,
        'status' => VendorRequest::STATUS_APPROVED,
    ]);

    expect($tenant->isAccessible())->toBeTrue();
});

it('gets and sets configuration', function () {
    $tenant = Tenant::factory()->create([
        'configuration' => null,
    ]);

    $tenant->setConfiguration('theme.primary', '#ff0000');
    $tenant->save();

    expect($tenant->getConfiguration('theme.primary'))->toBe('#ff0000');
    expect($tenant->getConfiguration('theme.nonexistent', 'default'))->toBe('default');
});

it('uses soft deletes', function () {
    $tenant = Tenant::factory()->create();
    $tenantId = $tenant->id;

    $tenant->delete();

    assertSoftDeleted('tenants', ['id' => $tenantId]);
    assertModelMissing($tenant);
});

it('returns filament name', function () {
    $tenant = Tenant::factory()->create([
        'raison_sociale' => 'Test Company',
    ]);

    expect($tenant->getFilamentName())->toBe('Test Company');
});

it('returns tenant name', function () {
    $tenant = Tenant::factory()->create([
        'raison_sociale' => 'My Company',
    ]);

    expect($tenant->getTenantName())->toBe('My Company');
});

it('returns url attribute', function () {
    $tenant = Tenant::factory()->create([
        'slug' => 'my-tenant',
    ]);

    expect($tenant->url)->toContain('my-tenant');
});

it('returns admin url attribute', function () {
    $tenant = Tenant::factory()->create([
        'slug' => 'my-tenant',
    ]);

    expect($tenant->admin_url)->toContain('vendeur');
});

it('checks if trial is expired', function () {
    $plan = Plan::factory()->create(['trial_days' => 30]);
    $tenant = Tenant::factory()->create([
        'plan_id' => $plan->id,
        'date_activation' => now()->subDays(35),
    ]);

    expect($tenant->isTrialExpired())->toBeTrue();
});

it('returns trial ends at attribute', function () {
    $plan = Plan::factory()->create(['trial_days' => 30]);
    $tenant = Tenant::factory()->create([
        'plan_id' => $plan->id,
        'date_activation' => now(),
    ]);

    $trialEndsAt = $tenant->getTrialEndsAtAttribute();

    expect($trialEndsAt)->toBeInstanceOf(Carbon::class);
    expect($trialEndsAt->diffInDays(now()))->toBe(30);
});

it('has many documents legaux', function () {
    $tenant = Tenant::factory()->create();
    $typeDocument = TypeDocumentLegal::factory()->create();

    $tenant->documentsLegaux()->attach($typeDocument->id, [
        'numero_document' => '123456',
        'date_delivrance' => now(),
    ]);

    expect($tenant->documentsLegaux)->toHaveCount(1);
});

it('gets rccm attribute', function () {
    $tenant = Tenant::factory()->create();
    $rccm = TypeDocumentLegal::factory()->create(['code' => 'RCCM']);

    $tenant->documentsLegaux()->attach($rccm->id, [
        'numero_document' => 'RCCM-12345',
    ]);

    expect($tenant->rccm)->toBe('RCCM-12345');
});

it('gets patente attribute', function () {
    $tenant = Tenant::factory()->create();
    $patente = TypeDocumentLegal::factory()->create(['code' => 'PATENTE']);

    $tenant->documentsLegaux()->attach($patente->id, [
        'numero_document' => 'PAT-67890',
    ]);

    expect($tenant->patente)->toBe('PAT-67890');
});

it('gets ifu attribute', function () {
    $tenant = Tenant::factory()->create();
    $ifu = TypeDocumentLegal::factory()->create(['code' => 'IFU']);

    $tenant->documentsLegaux()->attach($ifu->id, [
        'numero_document' => 'IFU-99999',
    ]);

    expect($tenant->ifu)->toBe('IFU-99999');
});

it('checks if documents obligatoires are complets', function () {
    $tenant = Tenant::factory()->create();

    $type1 = TypeDocumentLegal::factory()->create(['code' => 'RCCM', 'est_obligatoire' => true]);
    $type2 = TypeDocumentLegal::factory()->create(['code' => 'PATENTE', 'est_obligatoire' => true]);

    $tenant->documentsLegaux()->attach($type1->id, ['numero_document' => '123']);
    $tenant->documentsLegaux()->attach($type2->id, ['numero_document' => '456']);

    expect($tenant->documentsObligatoiresComplets())->toBeTrue();
});

it('calculates pourcentage verification', function () {
    $tenant = Tenant::factory()->create();

    $type1 = TypeDocumentLegal::factory()->create();
    $type2 = TypeDocumentLegal::factory()->create();

    $tenant->documentsLegaux()->attach($type1->id, ['est_verifie' => true]);
    $tenant->documentsLegaux()->attach($type2->id, ['est_verifie' => false]);

    expect($tenant->pourcentage_verification)->toBe(50.0);
});

it('gets documents manquants', function () {
    $tenant = Tenant::factory()->create();

    $type1 = TypeDocumentLegal::factory()->create(['code' => 'RCCM', 'est_obligatoire' => true]);
    $type2 = TypeDocumentLegal::factory()->create(['code' => 'PATENTE', 'est_obligatoire' => true]);

    $tenant->documentsLegaux()->attach($type1->id, ['numero_document' => '123']);

    $manquants = $tenant->documents_manquants;
    expect($manquants)->toContain('PATENTE');
});
