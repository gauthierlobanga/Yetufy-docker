# Architecture et Implémentation Technique - Checkout

## Structure des Fichiers

```
app/Http/Controllers/Shop/
├── CheckoutController.php          [MODIFIÉ] - Logique checkout
app/Models/
├── Commande.php                    [MODIFIÉ] - Boot hook pour statut
resources/js/components/ecommerce/checkout/
├── checkout-form.tsx               [NOUVEAU] - Formulaire principal (refactorisé)
├── add-address-modal.tsx           [NOUVEAU] - Modal adresse
├── order-summary.tsx               [MODIFIÉ] - Props dynamiques
├── payment-stepper.tsx             [EXISTANT] - Stepper (inchangé)
├── order-item.tsx                  [EXISTANT] - Affichage article
resources/js/hooks/ecommerce/
├── use-checkout.ts                 [NOUVEAU] - Hook gestion d'état
resources/js/pages/Shop/Checkout/
├── Index.tsx                       [EXISTANT] - Page principale (compatible)
docs/
├── CHECKOUT_IMPROVEMENTS.md        [NOUVEAU] - Documentation utilisateur
└── CHECKOUT_TECHNICAL.md           [NOUVEAU] - Ce fichier
```

## Patterns et Conventions

### 1. Validation Backend (Laravel)

**Pattern de validation avec messages personnalisés:**

```php
$validated = $request->validate([
    'field' => 'required|type|...constraint',
    'other' => 'sometimes|nullable|constraint',
], [
    'field.required' => 'Message clair en français',
    'field.type' => 'Autre message contextualisé',
]);
```

**Avantages:**

- Messages localisés
- Validation stricte
- Feedback utilisateur clair

### 2. État React avec Hook Personnalisé

**Pattern useCheckout:**

```typescript
// État central
const [state, setState] = useState<CheckoutState>({...});

// Méthodes pour modifications
const selectBillingAddress = useCallback((id) => {
    setState(prev => ({
        ...prev,
        billingAddressId: id,
        errors: { ...prev.errors, billingAddressId: '' },
    }));
}, []);

// Retour d'objet avec tous les accesseurs
return {
    state,
    selectBillingAddress,
    // ... autres méthodes
};
```

**Avantages:**

- État prévisible
- Réutilisable
- Testable
- Clear separation of concerns

### 3. Validation Frontend

**Pattern validation step-by-step:**

```typescript
function validateCurrentStep(state: CheckoutState): Record<string, string> {
    const errors: Record<string, string> = {};
    
    switch (state.currentStep) {
        case 2:
            if (!state.billingAddressId) {
                errors.billingAddressId = 'Message clair';
            }
            // ... autres validations
            break;
    }
    
    return errors;
}

// Utilisation:
const errors = validateCurrentStep(state);
if (Object.keys(errors).length > 0) {
    setState(prev => ({ ...prev, errors }));
    Object.values(errors).forEach(err => toast.error(err));
    return;
}
```

### 4. Soumission Inertia

**Pattern POST avec gestion d'erreurs:**

```typescript
router.post(
    route('tenant.checkout.process'),
    {
        adresse_facturation_id: state.billingAddressId,
        // ... autres données
    },
    {
        preserveState: false,
        onError: (errors) => {
            setState(prev => ({
                ...prev,
                errors: errors as Record<string, string>,
                isLoading: false,
            }));
            Object.values(errors).forEach((error: any) => {
                toast.error(error);
            });
        },
    }
);
```

## Flux de Données

### Frontend → Backend

```
CheckoutForm (component)
    ↓
useCheckout (hook)
    ├─ state management
    ├─ validation
    └─ submitCheckout()
        ↓
router.post('/checkout/process')
    ↓
Laravel Backend
```

### Backend → Frontend

```
CheckoutController::checkoutIndex()
    ↓
Inertia::render('Shop/Checkout/Index', [
    'cart' => $formatted_cart,
    'addresses' => $addresses,
    'shippingMethods' => $methods,
    'paymentMethods' => $methods,
])
    ↓
Inertia Page (React)
    ↓
CheckoutForm component (reçoit props)
```

## Gestion des Erreurs

### Stratégie Multi-Niveaux

```
1. FRONTEND VALIDATION
   ↓
2. BACKEND VALIDATION (Laravel validate())
   ↓
3. BUSINESS LOGIC VALIDATION (vérifications supplémentaires)
   ↓
4. DATABASE OPERATIONS (try-catch)
   ↓
5. ERROR RESPONSE + LOGGING
```

### Exemple Complet

```php
// 1. Frontend validation (useCheckout.ts)
if (!billingAddressId) return error;

// 2. Backend validation (Laravel)
$validated = $request->validate([
    'adresse_facturation_id' => 'required|exists:adresses,id',
]);

// 3. Business validation
$address = Auth::user()->adresses()->find($validated['adresse_facturation_id']);
if (!$address) return error;

// 4. Operation
try {
    $commande = $cart->convertirEnCommande();
    // ...
} catch (Exception $e) {
    // 5. Logging
    Log::error('Checkout error', [...]);
    return error;
}
```

## Extensibilité

### Ajouter une Nouvelle Méthode de Paiement

```php
// 1. CheckoutController - Mettre à jour la validation
'payment_method_id' => 'required|string|in:mobile_money,card,cash,nouvelle_methode',

// 2. Frontend - Ajouter à defaultPayment
const defaultPayment: PaymentMethod[] = [
    // ... existants
    { id: 'nouvelle_methode', name: 'Nouvelle Méthode', description: '...' },
];

// 3. Frontend - Ajouter un IconComponent si nécessaire
```

### Ajouter une Nouvelle Étape

```typescript
// 1. Modifier CheckoutState
interface CheckoutState {
    // ... existants
    nouvelleEtape: any;
}

// 2. Ajouter dans validateCurrentStep()
case 5: // nouvelle étape
    if (!state.nouvelleEtape) {
        errors.nouvelleEtape = 'Message...';
    }

// 3. Ajouter rendu dans CheckoutForm
const renderStep5 = () => (
    <div>
        {/* Contenu nouvelle étape */}
    </div>
);

// 4. Mettre à jour le switch rendu:
case 5:
    return renderStep5();
```

## Performance

### Optimisations Mises en Place

1. **useCallback**: Méthodes du hook mémorisées

```typescript
const selectBillingAddress = useCallback((id: string) => {
    // ...
}, []);
```

1. **Validation optimisée**: Pas de re-validation inutile
2. **Sticky position**: OrderSummary reste visible
3. **Progressive loading**: Toast après action

## Testing

### Unit Tests (Frontend)

```typescript
describe('useCheckout', () => {
    it('should validate step 2 completely', () => {
        const checkout = useCheckout();
        const errors = validateCurrentStep({
            ...checkout.state,
            billingAddressId: null,
        });
        expect(errors.billingAddressId).toBeDefined();
    });
});
```

### Feature Tests (Backend)

```php
test('checkout with valid addresses creates order', function () {
    $user = User::factory()->create();
    $address = Address::factory()->for($user)->create();
    
    $this->actingAs($user)
        ->post(route('tenant.checkout.process'), [
            'adresse_facturation_id' => $address->id,
            'adresse_livraison_id' => $address->id,
            'payment_method_id' => 'card',
            'shipping_method_id' => 'standard',
        ])
        ->assertRedirect();
    
    $this->assertDatabaseHas('commandes', [
        'client_id' => $user->client->id,
        'statut' => 'en_attente',
    ]);
});
```

## Considérations Futures

### Améliorations Possibles

1. **Promo Codes**: Ajouter étape pour code promo
2. **Gift Cards**: Support pour cartes cadeaux
3. **Notifications**: Email/SMS après commande
4. **Tracking**: Intégration tracking livreur
5. **Ratings**: Évaluation après livraison
6. **Wishlists**: Ajouter à la liste de souhaits

### Refactoring Possible

1. **Commande Service**: Extraire `convertirEnCommande()` dans service
2. **Address Service**: Valider adresses dans service dédié
3. **Payment Service**: Abstraire la logique de paiement
4. **Events**: Dispatcher événements (OrderCreated, etc.)

## Debugging

### Logs Importants

```php
// Succès
Log::info('Order created successfully', [
    'order_id' => $commande->id,
    'user_id' => Auth::id(),
    'total' => $commande->total,
]);

// Erreurs
Log::error('Checkout error', [
    'message' => $e->getMessage(),
    'user' => Auth::id(),
    'cart' => $cart->id,
    'trace' => $e->getTraceAsString(),
]);
```

### Commandes Utiles

```bash
# Voir les logs du checkout
tail -f storage/logs/laravel.log | grep "Checkout\|Order created"

# Voir les commandes d'un utilisateur
php artisan tinker
>>> User::find(1)->client->commandes()->with('lignes')->get();

# Vérifier le statut d'une commande
>>> Commande::find('uuid')->statut;  // Doit être 'en_attente'
```

## Checklist Maintenance

- [ ] Logs checkout vérifiés régulièrement
- [ ] Validation des adresses fiable
- [ ] Stocks correctement décrémentés
- [ ] Statut commandes correct
- [ ] Performance < 2s
- [ ] Tests unitaires passent
- [ ] Aucun warning TypeScript
- [ ] Messages d'erreur clairs
