<?php

use App\Http\Middleware\TrackVisitor;
use App\Models\Tenant;
use App\Support\Tenancy\TenantStorage;
use Illuminate\Support\Facades\Route;

Route::get('/tenant-storage/{tenant:slug}/{path}', function (Tenant $tenant, string $path) {
    return TenantStorage::response($tenant, $path);
})->where('path', '.*')->withoutMiddleware(TrackVisitor::class)->name('tenant.storage');

Route::get('/storage/tenant-{slug}/{path}', function (string $slug, string $path) {
    $tenant = Tenant::where('slug', $slug)->firstOrFail();

    return TenantStorage::response($tenant, $path);
})->where('path', '.*')->withoutMiddleware(TrackVisitor::class)->name('tenant.storage.legacy');
