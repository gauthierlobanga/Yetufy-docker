<?php

use App\Models\AvisClient;

it('creates a review', function () {
    $review = AvisClient::factory()->create([
        'note' => 5,
        'commentaire' => 'Excellent produit!',
    ]);

    expect($review->note)->toBe(5);
    expect($review->commentaire)->toBe('Excellent produit!');
});

it('returns note label', function () {
    $review = AvisClient::factory()->create(['note' => 5]);
    expect($review->note_libelle)->toBe('Excellent');

    $review->note = 3;
    expect($review->note_libelle)->toBe('Bon');
});

it('approves review', function () {
    $review = AvisClient::factory()->create(['approuve' => false]);
    $review->approuver();

    expect($review->approuve)->toBeTrue();
});
