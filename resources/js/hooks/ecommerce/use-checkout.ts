import { router } from '@inertiajs/react';
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export interface CheckoutState {
    currentStep: number;
    billingAddressId: string | null;
    shippingAddressId: string | null;
    shippingMethodId: string | null;
    paymentMethodId: string | null;
    notes: string;
    sameAsShipping: boolean;
    errors: Record<string, string>;
    isLoading: boolean;
}

export function useCheckout() {
    const [state, setState] = useState<CheckoutState>({
        currentStep: 1,
        billingAddressId: null,
        shippingAddressId: null,
        shippingMethodId: null,
        paymentMethodId: null,
        notes: '',
        sameAsShipping: true,
        errors: {},
        isLoading: false,
    });

    const setCurrentStep = useCallback((step: number) => {
        if (step < 1 || step > 4) return;
        setState((prev) => ({ ...prev, currentStep: step }));
    }, []);

    const nextStep = useCallback(() => {
        const errors = validateCurrentStep(state);
        if (Object.keys(errors).length > 0) {
            setState((prev) => ({ ...prev, errors }));
            Object.values(errors).forEach((error) => {
                toast.error(error);
            });
            return;
        }
        setState((prev) => ({ ...prev, currentStep: Math.min(prev.currentStep + 1, 4), errors: {} }));
    }, [state]);

    const previousStep = useCallback(() => {
        setState((prev) => ({ ...prev, currentStep: Math.max(prev.currentStep - 1, 1) }));
    }, []);

    const selectBillingAddress = useCallback((addressId: string) => {
        setState((prev) => ({
            ...prev,
            billingAddressId: addressId,
            errors: { ...prev.errors, billingAddressId: '' },
        }));
    }, []);

    const selectShippingAddress = useCallback((addressId: string) => {
        setState((prev) => ({
            ...prev,
            shippingAddressId: addressId,
            errors: { ...prev.errors, shippingAddressId: '' },
        }));
    }, []);

    const toggleSameAsShipping = useCallback(() => {
        setState((prev) => ({
            ...prev,
            sameAsShipping: !prev.sameAsShipping,
            shippingAddressId: !prev.sameAsShipping ? null : prev.billingAddressId,
            errors: { ...prev.errors, shippingAddressId: '' },
        }));
    }, []);

    const selectShippingMethod = useCallback((methodId: string) => {
        setState((prev) => ({
            ...prev,
            shippingMethodId: methodId,
            errors: { ...prev.errors, shippingMethodId: '' },
        }));
    }, []);

    const selectPaymentMethod = useCallback((methodId: string) => {
        setState((prev) => ({
            ...prev,
            paymentMethodId: methodId,
            errors: { ...prev.errors, paymentMethodId: '' },
        }));
    }, []);

    const setNotes = useCallback((notes: string) => {
        setState((prev) => ({ ...prev, notes }));
    }, []);

    const submitCheckout = useCallback(async () => {
        const errors = validateCheckout(state);
        if (Object.keys(errors).length > 0) {
            setState((prev) => ({ ...prev, errors }));
            Object.values(errors).forEach((error) => {
                toast.error(error);
            });
            return;
        }

        setState((prev) => ({ ...prev, isLoading: true }));

        const shippingAddressId = state.sameAsShipping
            ? state.billingAddressId
            : state.shippingAddressId;

        router.post(
            route('tenant.checkout.process'),
            {
                adresse_facturation_id: state.billingAddressId,
                adresse_livraison_id: shippingAddressId,
                shipping_method_id: state.shippingMethodId,
                payment_method_id: state.paymentMethodId,
                notes: state.notes || null,
            },
            {
                preserveState: false,
                onError: (errors) => {
                    setState((prev) => ({
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
    }, [state]);

    const resetCheckout = useCallback(() => {
        setState({
            currentStep: 1,
            billingAddressId: null,
            shippingAddressId: null,
            shippingMethodId: null,
            paymentMethodId: null,
            notes: '',
            sameAsShipping: true,
            errors: {},
            isLoading: false,
        });
    }, []);

    return {
        state,
        setCurrentStep,
        nextStep,
        previousStep,
        selectBillingAddress,
        selectShippingAddress,
        toggleSameAsShipping,
        selectShippingMethod,
        selectPaymentMethod,
        setNotes,
        submitCheckout,
        resetCheckout,
    };
}

function validateCurrentStep(state: CheckoutState): Record<string, string> {
    const errors: Record<string, string> = {};

    switch (state.currentStep) {
        case 2:
            if (!state.billingAddressId) {
                errors.billingAddressId =
                    'Veuillez sélectionner une adresse de facturation';
            }
            if (!state.sameAsShipping && !state.shippingAddressId) {
                errors.shippingAddressId =
                    'Veuillez sélectionner une adresse de livraison';
            }
            if (!state.shippingMethodId) {
                errors.shippingMethodId =
                    'Veuillez sélectionner une méthode de livraison';
            }
            if (!state.paymentMethodId) {
                errors.paymentMethodId =
                    'Veuillez sélectionner un mode de paiement';
            }
            break;
    }

    return errors;
}

function validateCheckout(state: CheckoutState): Record<string, string> {
    const errors: Record<string, string> = {};

    if (!state.billingAddressId) {
        errors.billingAddressId = 'Adresse de facturation requise';
    }

    const shippingAddressId = state.sameAsShipping
        ? state.billingAddressId
        : state.shippingAddressId;

    if (!shippingAddressId) {
        errors.shippingAddressId = 'Adresse de livraison requise';
    }

    if (!state.shippingMethodId) {
        errors.shippingMethodId = 'Méthode de livraison requise';
    }

    if (!state.paymentMethodId) {
        errors.paymentMethodId = 'Mode de paiement requis';
    }

    return errors;
}
