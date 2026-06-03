<?php

use App\Models\LigneCommande;

it('calculates subtotal', function () {
    $line = LigneCommande::factory()->create([
        'quantite' => 3,
        'prix_unitaire' => 25.50,
    ]);

    expect($line->sous_total)->toBe(76.50);
});
