<?php

use App\Models\Contact;
use App\Models\User;

it('creates a contact message', function () {
    $contact = Contact::factory()->create([
        'nom' => 'Jean',
        'email' => 'jean@example.com',
        'message' => 'Bonjour',
    ]);

    expect($contact->full_name)->toBe('Jean ');
    expect($contact->status_label)->toBe('En attente');
});

it('marks as read', function () {
    $contact = Contact::factory()->create(['status' => Contact::STATUS_EN_ATTENTE]);
    $contact->marquerLu();

    expect($contact->status)->toBe(Contact::STATUS_LU);
    expect($contact->lu_at)->not()->toBeNull();
});

it('marks as replied', function () {
    $user = User::factory()->create();
    $contact = Contact::factory()->create();
    $contact->marquerRepondu($user, 'Merci pour votre message');

    expect($contact->status)->toBe(Contact::STATUS_REPONDU);
    expect($contact->reponse)->toBe('Merci pour votre message');
});
