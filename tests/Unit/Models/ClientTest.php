<?php

use App\Models\Client;

it('computes full name for individual', function () {
    $client = Client::factory()->create([
        'type' => Client::TYPE_PARTICULIER,
        'civilite' => Client::CIVILITE_M,
        'prenom' => 'Jean',
        'nom' => 'Dupont',
    ]);

    expect($client->full_name)->toBe('M. Jean Dupont');
});

it('computes full name for company', function () {
    $client = Client::factory()->create([
        'type' => Client::TYPE_ENTREPRISE,
        'societe' => 'Yetu SARL',
    ]);

    expect($client->full_name)->toBe('Yetu SARL');
});

it('increments orders count and total spent', function () {
    $client = Client::factory()->create([
        'nombre_commandes' => 2,
        'total_achats' => 500,
    ]);

    $client->incrementerCommandes(150);
    expect($client->nombre_commandes)->toBe(3);
    expect($client->total_achats)->toBe(650);
    expect($client->date_dernier_achat)->not()->toBeNull();
});

it('updates loyalty level based on total spent', function () {
    $client = Client::factory()->create(['total_achats' => 0]);
    $client->mettreAJourNiveauFidelite();
    expect($client->niveau_fidelite)->toBe(Client::NIVEAU_BRONZE);

    $client->total_achats = 600;
    $client->mettreAJourNiveauFidelite();
    expect($client->niveau_fidelite)->toBe(Client::NIVEAU_ARGENT);
    expect($client->statut)->toBe(Client::STATUT_FIDELISE);

    $client->total_achats = 12000;
    $client->mettreAJourNiveauFidelite();
    expect($client->niveau_fidelite)->toBe(Client::NIVEAU_DIAMANT);
    expect($client->statut)->toBe(Client::STATUT_VIP);
});
