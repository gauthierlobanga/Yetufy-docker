import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Check, ChevronLeft, ChevronRight, MapPin, Truck, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCheckout } from '@/hooks/ecommerce/use-checkout';
import OrderSummary from './order-summary';
import OrderItem from './order-item';
import PaymentStepper from './payment-stepper';
import { useState } from 'react';

interface Address {
    id: string;
    street: string;
    city: string;
    postal_code: string;
    country: string;
    name?: string;
}

interface ShippingMethod {
    id: string;
    name: string;
    description: string;
    price: number;
    estimatedDays: string;
}

interface PaymentMethod {
    id: string;
    name: string;
    description?: string;
}

interface CartItem {
    id: string;
    produit: {
        nom: string;
        image: string | null;
    };
    quantite: number;
    prix_unitaire: number;
    prix_total: number;
}

interface Cart {
    items: CartItem[];
    sous_total: number;
    total_taxes: number;
    total_livraison: number;
    total_remises: number;
    total_general: number;
}

interface CheckoutFormProps {
    cart: Cart;
    addresses: Address[];
    shippingMethods: ShippingMethod[];
    paymentMethods: PaymentMethod[];
}

export default function CheckoutForm({
    cart,
    addresses,
    shippingMethods,
    paymentMethods,
}: CheckoutFormProps) {
    const checkout = useCheckout();
    const [showAddressForm, setShowAddressForm] = useState(false);

    // Calculate shipping cost based on selected method
    const shippingCost =
        shippingMethods.find((m) => m.id === checkout.state.shippingMethodId)
            ?.price ?? 0;

    const selectedBillingAddress = addresses.find(
        (a) => a.id === checkout.state.billingAddressId
    );
    const selectedShippingAddress = checkout.state.sameAsShipping
        ? selectedBillingAddress
        : addresses.find((a) => a.id === checkout.state.shippingAddressId);

    const formatAddress = (address: Address | undefined) => {
        if (!address) return 'Non sélectionnée';
        return `${address.street}, ${address.city} ${address.postal_code}, ${address.country}`;
    };

    const renderStep1 = () => (
        <div className="space-y-6">
            <div>
                <h3 className="mb-4 font-semibold">Résumé de votre commande</h3>
                <div className="space-y-3">
                    {cart.items.map((item) => (
                        <OrderItem
                            key={item.id}
                            image={item.produit.image}
                            name={item.produit.nom}
                            quantity={item.quantite}
                            price={`${item.prix_unitaire.toLocaleString('fr-FR')} FCFA`}
                        />
                    ))}
                </div>
            </div>
            <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.href = route('tenant.cart.index')}
            >
                Modifier le panier
            </Button>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-8">
            {/* Billing Address */}
            <div>
                <h3 className="mb-4 flex items-center gap-2 font-semibold">
                    <MapPin className="h-5 w-5" />
                    Adresse de facturation
                </h3>
                <RadioGroup
                    value={checkout.state.billingAddressId || ''}
                    onValueChange={checkout.selectBillingAddress}
                >
                    <div className="space-y-3">
                        {addresses.length > 0 ? (
                            addresses.map((address) => (
                                <div key={address.id} className="flex items-center space-x-2">
                                    <RadioGroupItem value={address.id} id={`bill-${address.id}`} />
                                    <Label
                                        htmlFor={`bill-${address.id}`}
                                        className="flex-1 cursor-pointer"
                                    >
                                        <div className="text-sm">
                                            {address.name && (
                                                <div className="font-medium">{address.name}</div>
                                            )}
                                            <div className="text-muted-foreground">
                                                {formatAddress(address)}
                                            </div>
                                        </div>
                                    </Label>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                Aucune adresse enregistrée
                            </p>
                        )}
                    </div>
                </RadioGroup>
                {checkout.state.errors.billingAddressId && (
                    <p className="mt-2 text-sm text-red-500">
                        {checkout.state.errors.billingAddressId}
                    </p>
                )}
            </div>

            {/* Shipping Address */}
            <div>
                <div className="mb-4 flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="same-address"
                        checked={checkout.state.sameAsShipping}
                        onChange={checkout.toggleSameAsShipping}
                        className="rounded border-gray-300"
                    />
                    <Label htmlFor="same-address" className="cursor-pointer">
                        La livraison est à la même adresse que la facturation
                    </Label>
                </div>

                {!checkout.state.sameAsShipping && (
                    <div className="mt-4">
                        <h3 className="mb-4 flex items-center gap-2 font-semibold">
                            <Truck className="h-5 w-5" />
                            Adresse de livraison
                        </h3>
                        <RadioGroup
                            value={checkout.state.shippingAddressId || ''}
                            onValueChange={checkout.selectShippingAddress}
                        >
                            <div className="space-y-3">
                                {addresses.length > 0 ? (
                                    addresses.map((address) => (
                                        <div key={address.id} className="flex items-center space-x-2">
                                            <RadioGroupItem
                                                value={address.id}
                                                id={`ship-${address.id}`}
                                            />
                                            <Label
                                                htmlFor={`ship-${address.id}`}
                                                className="flex-1 cursor-pointer"
                                            >
                                                <div className="text-sm">
                                                    {address.name && (
                                                        <div className="font-medium">
                                                            {address.name}
                                                        </div>
                                                    )}
                                                    <div className="text-muted-foreground">
                                                        {formatAddress(address)}
                                                    </div>
                                                </div>
                                            </Label>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        Aucune adresse enregistrée
                                    </p>
                                )}
                            </div>
                        </RadioGroup>
                        {checkout.state.errors.shippingAddressId && (
                            <p className="mt-2 text-sm text-red-500">
                                {checkout.state.errors.shippingAddressId}
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Shipping Methods */}
            <div>
                <h3 className="mb-4 font-semibold">Méthode de livraison</h3>
                <RadioGroup
                    value={checkout.state.shippingMethodId || ''}
                    onValueChange={checkout.selectShippingMethod}
                >
                    <div className="space-y-3">
                        {shippingMethods.map((method) => (
                            <div key={method.id} className="flex items-center space-x-2">
                                <RadioGroupItem
                                    value={method.id}
                                    id={`shipping-${method.id}`}
                                />
                                <Label
                                    htmlFor={`shipping-${method.id}`}
                                    className="flex-1 cursor-pointer"
                                >
                                    <div className="text-sm">
                                        <div className="font-medium flex justify-between">
                                            <span>{method.name}</span>
                                            <span>
                                                {method.price > 0
                                                    ? `${method.price.toLocaleString('fr-FR')} FCFA`
                                                    : 'Gratuit'}
                                            </span>
                                        </div>
                                        <div className="text-muted-foreground">
                                            {method.description} - {method.estimatedDays}
                                        </div>
                                    </div>
                                </Label>
                            </div>
                        ))}
                    </div>
                </RadioGroup>
                {checkout.state.errors.shippingMethodId && (
                    <p className="mt-2 text-sm text-red-500">
                        {checkout.state.errors.shippingMethodId}
                    </p>
                )}
            </div>

            {/* Payment Methods */}
            <div>
                <h3 className="mb-4 flex items-center gap-2 font-semibold">
                    <CreditCard className="h-5 w-5" />
                    Mode de paiement
                </h3>
                <RadioGroup
                    value={checkout.state.paymentMethodId || ''}
                    onValueChange={checkout.selectPaymentMethod}
                >
                    <div className="space-y-3">
                        {paymentMethods.map((method) => (
                            <div key={method.id} className="flex items-center space-x-2">
                                <RadioGroupItem
                                    value={method.id}
                                    id={`payment-${method.id}`}
                                />
                                <Label
                                    htmlFor={`payment-${method.id}`}
                                    className="flex-1 cursor-pointer"
                                >
                                    <div className="text-sm">
                                        <div className="font-medium">{method.name}</div>
                                        {method.description && (
                                            <div className="text-muted-foreground">
                                                {method.description}
                                            </div>
                                        )}
                                    </div>
                                </Label>
                            </div>
                        ))}
                    </div>
                </RadioGroup>
                {checkout.state.errors.paymentMethodId && (
                    <p className="mt-2 text-sm text-red-500">
                        {checkout.state.errors.paymentMethodId}
                    </p>
                )}
            </div>

            {/* Notes */}
            <div>
                <Label htmlFor="notes">Notes de commande (optionnel)</Label>
                <Textarea
                    id="notes"
                    placeholder="Ajoutez vos instructions spéciales ici..."
                    value={checkout.state.notes}
                    onChange={(e) => checkout.setNotes(e.target.value)}
                    className="mt-2"
                    rows={4}
                />
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-6">
            <div>
                <h3 className="mb-4 font-semibold">Résumé de la commande</h3>
                <div className="space-y-4">
                    {/* Billing Address */}
                    <Card className="shadow-none">
                        <CardContent className="flex gap-4">
                            <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
                            <div className="flex-1">
                                <h4 className="font-medium">Adresse de facturation</h4>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {formatAddress(selectedBillingAddress)}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Shipping Address (if different) */}
                    {!checkout.state.sameAsShipping && (
                        <Card className="shadow-none">
                            <CardContent className="flex gap-4">
                                <Truck className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
                                <div className="flex-1">
                                    <h4 className="font-medium">Adresse de livraison</h4>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {formatAddress(selectedShippingAddress)}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Shipping Method */}
                    {shippingMethods.find((m) => m.id === checkout.state.shippingMethodId) && (
                        <Card className="shadow-none">
                            <CardContent className="pt-6">
                                <h4 className="font-medium">
                                    {
                                        shippingMethods.find(
                                            (m) => m.id === checkout.state.shippingMethodId
                                        )?.name
                                    }
                                </h4>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {
                                        shippingMethods.find(
                                            (m) => m.id === checkout.state.shippingMethodId
                                        )?.estimatedDays
                                    }
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Payment Method */}
                    {paymentMethods.find((m) => m.id === checkout.state.paymentMethodId) && (
                        <Card className="shadow-none">
                            <CardContent className="flex gap-4">
                                <CreditCard className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
                                <div className="flex-1">
                                    <h4 className="font-medium">
                                        {
                                            paymentMethods.find(
                                                (m) => m.id === checkout.state.paymentMethodId
                                            )?.name
                                        }
                                    </h4>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );

    const renderStep4 = () => (
        <div className="text-center space-y-4">
            <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <Check className="h-8 w-8 text-green-600" />
                </div>
            </div>
            <h3 className="text-xl font-semibold">Commande confirmée!</h3>
            <p className="text-muted-foreground">
                Veuillez procéder au paiement pour compléter votre commande.
            </p>
        </div>
    );

    const renderStep = () => {
        switch (checkout.state.currentStep) {
            case 1:
                return renderStep1();
            case 2:
                return renderStep2();
            case 3:
                return renderStep3();
            case 4:
                return renderStep4();
            default:
                return null;
        }
    };

    return (
        <section className="py-10 lg:py-20">
            <div className="px-4 lg:px-6">
                <div className="mx-auto max-w-5xl">
                    <PaymentStepper currentStep={checkout.state.currentStep} />

                    <div className="grid gap-8 lg:grid-cols-[1fr_400px] mt-10">
                        {/* Main Content */}
                        <div className="space-y-8">
                            {renderStep()}

                            {/* Navigation Buttons */}
                            <div className="flex justify-between gap-4 pt-8 border-t">
                                <Button
                                    variant="outline"
                                    onClick={checkout.previousStep}
                                    disabled={
                                        checkout.state.currentStep === 1 ||
                                        checkout.state.isLoading
                                    }
                                >
                                    <ChevronLeft className="mr-2 h-4 w-4" />
                                    Précédent
                                </Button>

                                {checkout.state.currentStep < 4 ? (
                                    <Button
                                        onClick={
                                            checkout.state.currentStep === 3
                                                ? checkout.submitCheckout
                                                : checkout.nextStep
                                        }
                                        disabled={checkout.state.isLoading}
                                        className="min-w-40"
                                    >
                                        {checkout.state.isLoading ? (
                                            <>
                                                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                                Traitement...
                                            </>
                                        ) : checkout.state.currentStep === 3 ? (
                                            'Confirmer'
                                        ) : (
                                            <>
                                                Suivant
                                                <ChevronRight className="ml-2 h-4 w-4" />
                                            </>
                                        )}
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={() =>
                                            window.location.href = route('tenant.orders.index')
                                        }
                                    >
                                        Voir mes commandes
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Order Summary Sidebar */}
                        <div>
                            <OrderSummary
                                subtotal={cart.sous_total}
                                tax={cart.total_taxes}
                                shippingCost={shippingCost}
                                discount={cart.total_remises}
                                total={cart.sous_total + cart.total_taxes + shippingCost - cart.total_remises}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
