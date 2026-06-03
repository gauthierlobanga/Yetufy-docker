<?php

use App\Models\AvisClient;
use App\Models\Produit;

it('can create a product', function () {
    $product = Produit::factory()->create([
        'nom' => 'Smartphone',
        'prix_ttc' => 299.99,
    ]);

    expect($product)->toBeInstanceOf(Produit::class);
    expect($product->nom)->toBe('Smartphone');
    expect($product->prix_ttc)->toBe(299.99);
});

it('auto-generates slug from nom', function () {
    $product = Produit::factory()->create(['nom' => 'Mon Super Produit', 'slug' => null]);

    expect($product->slug)->toBe('mon-super-produit');
});

it('has many avis', function () {
    $product = Produit::factory()->create();
    $avis = AvisClient::factory()->count(3)->create(['produit_id' => $product->id]);

    expect($product->avis)->toHaveCount(3);
});

it('calculates average rating', function () {
    $product = Produit::factory()->create();
    AvisClient::factory()->create(['produit_id' => $product->id, 'note' => 5, 'approuve' => true]);
    AvisClient::factory()->create(['produit_id' => $product->id, 'note' => 3, 'approuve' => true]);

    expect($product->note_moyenne)->toBe(4.0);
});

it('checks stock availability', function () {
    $product = Produit::factory()->create(['quantite_stock' => 10]);

    expect($product->hasSufficientStock(5))->toBeTrue();
    expect($product->hasSufficientStock(15))->toBeFalse();
});

it('decrements stock correctly', function () {
    $product = Produit::factory()->create(['quantite_stock' => 10]);

    $product->decrementerStock(3);
    expect($product->quantite_stock)->toBe(7);
    expect($product->sold_count)->toBe(3);
});

it('publishes product when stock becomes positive after being out', function () {
    $product = Produit::factory()->create(['quantite_stock' => 0, 'statut' => Produit::STATUS_OUT_OF_STOCK]);

    $product->incrementerStock(5);
    expect($product->statut)->toBe(Produit::STATUS_PUBLISHED);
});
