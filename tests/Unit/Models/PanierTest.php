<?php

use App\Models\Commande;
use App\Models\Panier;
use App\Models\Produit;

it('can create a cart', function () {
    $cart = Panier::factory()->create();

    expect($cart)->toBeInstanceOf(Panier::class);
    expect($cart->statut)->toBe(Panier::STATUT_ACTIF);
});

it('adds item to cart', function () {
    $cart = Panier::factory()->create();
    $product = Produit::factory()->create(['prix_ttc' => 100]);

    $cart->ajouterItem($product, 2);
    $cart->recalculerTotaux();

    expect($cart->items)->toHaveCount(1);
    expect($cart->sous_total)->toBe(200);
});

it('removes item from cart', function () {
    $cart = Panier::factory()->create();
    $product = Produit::factory()->create();

    $item = $cart->ajouterItem($product);
    $cart->retirerItem($item->id);

    expect($cart->items)->toHaveCount(0);
});

it('updates quantity in cart', function () {
    $cart = Panier::factory()->create();
    $product = Produit::factory()->create(['prix_ttc' => 50]);

    $item = $cart->ajouterItem($product, 1);
    $cart->mettreAJourQuantite($item->id, 3);

    expect($item->fresh()->quantite)->toBe(3);
    expect($cart->fresh()->sous_total)->toBe(150);
});

it('applies delivery cost', function () {
    $cart = Panier::factory()->create();
    $cart->appliquerLivraison('standard', 10);

    expect($cart->total_livraison)->toBe(10);
    expect($cart->total_general)->toBe(10); // because cart is empty
});

it('converts cart to order', function () {
    $cart = Panier::factory()->create();
    $product = Produit::factory()->create(['prix_ttc' => 100]);
    $cart->ajouterItem($product, 2);
    $cart->recalculerTotaux();

    $order = $cart->convertirEnCommande();

    expect($order)->toBeInstanceOf(Commande::class);
    expect($cart->statut)->toBe(Panier::STATUT_CONVERTI);
    expect($order->lignes)->toHaveCount(1);
    expect($order->total)->toBe(200);
});

it('marks cart as abandoned', function () {
    $cart = Panier::factory()->create();
    $abandon = $cart->marquerAbandonne('checkout', 'User left');

    expect($cart->statut)->toBe(Panier::STATUT_ABANDONNE);
    expect($abandon->raison)->toBe('User left');
});
