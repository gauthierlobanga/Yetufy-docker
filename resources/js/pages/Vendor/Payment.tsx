// resources/js/Pages/Vendor/VendorPayment.tsx
import { ShieldCheckIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

type VendorPaymentProps = {
    plan: {
        name: string;
        formatted_price: string;
        trial_days: number;
    };
    vendorRequest: {
        shop_name: string;
        shop_slug: string;
    };
};

export default function VendorPayment({
    plan,
    vendorRequest,
}: VendorPaymentProps) {
    const [processing, setProcessing] = useState(false);

    const handlePayment = () => {
        setProcessing(true);
        window.location.href = route('vendor.payment.checkout');
    };

    return (
        <>
            <Head title="Paiement" />

            <div className="mx-auto max-w-2xl px-4 py-12">
                {/* En-tête */}
                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-bold text-foreground">
                        Finaliser votre inscription
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Plan sélectionné :{' '}
                        <strong className="font-semibold">{plan.name}</strong>
                    </p>
                </div>

                {/* Résumé de la commande */}
                <div className="mb-8 rounded-2xl border border-border bg-card p-8 shadow-sm">
                    <h2 className="mb-6 text-xl font-bold text-foreground">
                        Résumé de votre commande
                    </h2>

                    <div className="space-y-4">
                        <div className="flex justify-between border-b border-border py-2">
                            <span className="text-muted-foreground">
                                Plan {plan.name}
                            </span>
                            <span className="font-semibold text-foreground">
                                {plan.formatted_price}
                            </span>
                        </div>

                        {plan.trial_days > 0 && (
                            <div className="flex justify-between border-b border-border py-2">
                                <span className="text-muted-foreground">
                                    Période d'essai ({plan.trial_days} jours)
                                </span>
                                <span className="font-semibold text-primary">
                                    Gratuit
                                </span>
                            </div>
                        )}

                        <div className="flex justify-between py-3 text-lg font-bold">
                            <span className="text-foreground">Total</span>
                            <span className="text-primary">
                                {plan.formatted_price}/mois
                            </span>
                        </div>

                        {plan.trial_days > 0 && (
                            <p className="text-center text-sm text-muted-foreground">
                                Vous ne serez facturé qu'après la période
                                d'essai de {plan.trial_days} jours. Vous pouvez
                                annuler à tout moment.
                            </p>
                        )}
                    </div>
                </div>

                {/* Informations de la boutique */}
                <div className="mb-8 rounded-2xl border border-border bg-card p-8 shadow-sm">
                    <h2 className="mb-4 text-xl font-bold text-foreground">
                        Votre boutique
                    </h2>

                    <div className="space-y-3">
                        <div>
                            <span className="text-muted-foreground">Nom :</span>
                            <span className="ml-2 font-medium text-foreground">
                                {vendorRequest.shop_name}
                            </span>
                        </div>
                        <div>
                            <span className="text-muted-foreground">
                                Adresse :
                            </span>
                            <span className="ml-2 font-medium text-foreground">
                                {vendorRequest.shop_slug}.
                                {window.location.hostname}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Sécurité */}
                <div className="mb-8 flex items-center justify-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <LockClosedIcon className="h-4 w-4 text-primary" />
                        <span>Paiement sécurisé</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <ShieldCheckIcon className="h-4 w-4 text-primary" />
                        <span>Protection des données</span>
                    </div>
                </div>

                {/* Bouton de paiement */}
                <button
                    onClick={handlePayment}
                    disabled={processing}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-lg font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
                >
                    {processing ? (
                        <>
                            <svg
                                className="h-5 w-5 animate-spin"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                />
                            </svg>
                            Redirection vers la page de paiement...
                        </>
                    ) : (
                        <>Payer {plan.formatted_price} et créer ma boutique</>
                    )}
                </button>

                <p className="mt-4 text-center text-sm text-muted-foreground">
                    En cliquant sur ce bouton, vous serez redirigé vers la page
                    de paiement sécurisée de Stripe.
                </p>

                {/* Retour */}
                <div className="mt-6 text-center">
                    <Link
                        href={route('vendor.configure')}
                        className="text-sm text-primary underline underline-offset-4 hover:text-primary/80"
                    >
                        ← Retour à la configuration
                    </Link>
                </div>
            </div>
        </>
    );
}
