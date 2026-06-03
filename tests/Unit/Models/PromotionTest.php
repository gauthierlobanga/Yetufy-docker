<?php

use App\Models\Promotion;

it('applies percentage discount', function () {
    $promotion = Promotion::factory()->create([
        'type' => Promotion::TYPE_POURCENTAGE,
        'valeur' => 20,
    ]);

    $reduction = $promotion->calculerReduction(100);
    expect($reduction)->toBe(20.0);
});

it('applies fixed amount discount', function () {
    $promotion = Promotion::factory()->create([
        'type' => Promotion::TYPE_MONTANT_FIXE,
        'valeur' => 15,
    ]);

    $reduction = $promotion->calculerReduction(50);
    expect($reduction)->toBe(15.0);
});

it('caps fixed discount to subtotal', function () {
    $promotion = Promotion::factory()->create([
        'type' => Promotion::TYPE_MONTANT_FIXE,
        'valeur' => 60,
    ]);

    $reduction = $promotion->calculerReduction(50);
    expect($reduction)->toBe(50.0);
});

it('checks if promotion is currently active', function () {
    $active = Promotion::factory()->create([
        'est_active' => true,
        'date_debut' => now()->subDay(),
        'date_fin' => now()->addDay(),
    ]);

    $inactive = Promotion::factory()->create([
        'est_active' => false,
    ]);

    expect($active->is_currently_active)->toBeTrue();
    expect($inactive->is_currently_active)->toBeFalse();
});
