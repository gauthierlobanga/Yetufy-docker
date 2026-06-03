<?php

use App\Models\Commande;

it('creates an order', function () {
    $order = Commande::factory()->create([
        'numero_commande' => 'CMD-ABC123',
    ]);

    expect($order->numero_commande)->toBe('CMD-ABC123');
});

it('marks order as paid', function () {
    $order = Commande::factory()->create(['statut' => Commande::STATUT_EN_ATTENTE]);
    $order->marquerPayee();

    expect($order->statut)->toBe(Commande::STATUT_EN_COURS);
    expect($order->date_paiement)->not()->toBeNull();
});

it('marks order as delivered', function () {
    $order = Commande::factory()->create(['statut' => Commande::STATUT_EN_COURS]);
    $order->marquerLivree();

    expect($order->statut)->toBe(Commande::STATUT_TERMINE);
    expect($order->date_livraison)->not()->toBeNull();
});

it('cancels order', function () {
    $order = Commande::factory()->create();
    $order->annuler();

    expect($order->statut)->toBe(Commande::STATUT_ANNULE);
});
