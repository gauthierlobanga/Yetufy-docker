<?php

use App\Models\Plan;
use App\Models\Tenant;
use App\Models\User;
use App\Models\VendorRequest;
use App\Services\VendorRegistrationService;
use Illuminate\Support\Facades\DB;

beforeEach(function () {
    // Nettoyer la base de données avant chaque test
    DB::statement('SET search_path TO public');
    $schemas = DB::select("SELECT schema_name FROM information_schema.schemata WHERE schema_name LIKE 'tenant_%'");
    foreach ($schemas as $schema) {
        DB::statement("DROP SCHEMA IF EXISTS \"{$schema->schema_name}\" CASCADE");
    }
});

test('tenant is created with user_id', function () {
    $user = User::factory()->create();
    $plan = Plan::where('is_free', true)->first() ?? Plan::factory()->create(['is_free' => true, 'price' => 0]);

    $vendorRequest = VendorRequest::factory()->create([
        'user_id' => $user->id,
        'plan_id' => $plan->id,
        'shop_name' => 'Test Shop',
        'shop_slug' => 'test-shop',
        'contact_email' => 'test@example.com',
        'status' => VendorRequest::STATUS_PENDING,
    ]);

    $service = app(VendorRegistrationService::class);
    $tenant = $service->approve($vendorRequest);

    expect($tenant->user_id)->toBe($user->id);
    expect($tenant->slug)->toBe('test-shop');
    expect($tenant->statut)->toBe(Tenant::STATUT_ACTIF);
});

test('tenant schema is created', function () {
    $user = User::factory()->create();
    $plan = Plan::where('is_free', true)->first() ?? Plan::factory()->create(['is_free' => true, 'price' => 0]);

    $vendorRequest = VendorRequest::factory()->create([
        'user_id' => $user->id,
        'plan_id' => $plan->id,
        'shop_name' => 'Test Shop',
        'shop_slug' => 'test-shop',
        'contact_email' => 'test@example.com',
        'status' => VendorRequest::STATUS_PENDING,
    ]);

    $service = app(VendorRegistrationService::class);
    $tenant = $service->approve($vendorRequest);

    $schemaName = 'tenant_'.$tenant->id;
    $schemaExists = DB::select('SELECT schema_name FROM information_schema.schemata WHERE schema_name = ?', [$schemaName]);

    expect($schemaExists)->not->toBeEmpty();
});

test('user is created in tenant database', function () {
    $user = User::factory()->create();
    $plan = Plan::where('is_free', true)->first() ?? Plan::factory()->create(['is_free' => true, 'price' => 0]);

    $vendorRequest = VendorRequest::factory()->create([
        'user_id' => $user->id,
        'plan_id' => $plan->id,
        'shop_name' => 'Test Shop',
        'shop_slug' => 'test-shop',
        'contact_email' => 'test@example.com',
        'status' => VendorRequest::STATUS_PENDING,
    ]);

    $service = app(VendorRegistrationService::class);
    $tenant = $service->approve($vendorRequest);

    // Attendre que les jobs soient exécutés
    sleep(2);

    // Vérifier que l'utilisateur existe dans le tenant
    tenancy()->initialize($tenant);
    $tenantUser = DB::table('users')->where('id', $user->id)->first();
    tenancy()->end();

    expect($tenantUser)->not->toBeNull();
    expect($tenantUser->email)->toBe($user->email);
});

test('tenant migrations are run', function () {
    $user = User::factory()->create();
    $plan = Plan::where('is_free', true)->first() ?? Plan::factory()->create(['is_free' => true, 'price' => 0]);

    $vendorRequest = VendorRequest::factory()->create([
        'user_id' => $user->id,
        'plan_id' => $plan->id,
        'shop_name' => 'Test Shop',
        'shop_slug' => 'test-shop',
        'contact_email' => 'test@example.com',
        'status' => VendorRequest::STATUS_PENDING,
    ]);

    $service = app(VendorRegistrationService::class);
    $tenant = $service->approve($vendorRequest);

    // Attendre que les jobs soient exécutés
    sleep(2);

    // Vérifier que les tables existent dans le tenant
    tenancy()->initialize($tenant);
    $tables = DB::select('SELECT table_name FROM information_schema.tables WHERE table_schema = current_schema()');
    tenancy()->end();

    $tableNames = collect($tables)->pluck('table_name');
    expect($tableNames)->toContain('users', 'migrations');
});
