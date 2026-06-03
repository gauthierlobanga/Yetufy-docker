/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/consistent-type-imports */
// resources/js/hooks/ecommerce/use-cart.ts
import { router, usePage } from '@inertiajs/react';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { createElement } from 'react';
import { useCallback, useState, useEffect } from 'react';
import { toast } from 'sonner';

interface CartItem {
    variante: any;
    options_selectionnees: any;
    id: number;
    produit: {
        brand: import("react/jsx-runtime").JSX.Element;
        sold_count: boolean; id: number; nom: string; slug: string; image: string | null
    };
    quantite: number;
    prix_unitaire: number;
    prix_total: number;
    options?: any;
}

interface Cart {
    id: number;
    nb_articles: number;
    sous_total: number;
    total_taxes: number;
    total_livraison: number;
    total_remises: number;
    total_general: number;
    items: CartItem[];
    promotions: Array<{ code: string; montant: number }>;
}

function getToastStyle(type: 'success' | 'error' = 'success') {
    const isDark = document.documentElement.classList.contains('dark');

    const styles = {
        success: {
            light: {
                background: '#ecfdf5',
                color: '#064e3b',
                border: '1px solid #a7f3d0',
            },
            dark: {
                background: '#022c22',
                color: '#d1fae5',
                border: '1px solid #065f46',
            },
        },
        error: {
            light: {
                background: '#fef2f2',
                color: '#991b1b',
                border: '1px solid #fecaca',
            },
            dark: {
                background: '#450a0a',
                color: '#fee2e2',
                border: '1px solid #7f1d1d',
            },
        },
        warning: {
            light: {
                background: '#fef2f2',
                color: '#991b1b',
                border: '1px solid #fecaca',
            },
            dark: {
                background: '#450a0a',
                color: '#fee2e2',
                border: '1px solid #7f1d1d',
            },
        },
        info: {
            light: {
                background: '#fef2f2',
                color: '#991b1b',
                border: '1px solid #fecaca',
            },
            dark: {
                background: '#450a0a',
                color: '#fee2e2',
                border: '1px solid #7f1d1d',
            },
        },
    };

    return isDark ? styles[type].dark : styles[type].light;
}

export function useCartItems() {
    const { props } = usePage<{ cart?: Cart }>();
    const cart = props.cart;

    const itemCount = cart?.items?.reduce((sum, item) => sum + item.quantite, 0) ?? 0;

    const updateQuantity = useCallback((itemId: number, quantity: number) => {
        router.patch(route('tenant.cart.update', itemId), { quantite: quantity }, {
            preserveScroll: true,
            preserveState: true,
            only: ['cart'],
            showProgress: false,
            // eslint-disable-next-line react-hooks/immutability
            onSuccess: () => reloadCart(),
        });
    }, []);

    const removeItem = useCallback((itemId: number) => {
        router.delete(route('tenant.cart.remove', itemId), {
            preserveScroll: true,
            preserveState: true,
            only: ['cart'],
            showProgress: false,
            onSuccess: () => {
                reloadCart();
                toast.success('Produit retiré du panier', {
                    description: 'L\'article a été supprimé avec succès.',
                    icon: createElement(Trash2, { className: 'h-5 w-5 text-white' }),
                    duration: 2500,
                    style: { background: '#1e293b', color: '#f8fafc', border: '1px solid #334155' },
                });
            },
        });
    }, []);

    const addToCart = useCallback((productId: number | string, quantity = 1, variantId?: number) => {
        router.post(route('tenant.cart.add', productId), { quantity, variante_id: variantId }, {
            preserveScroll: true,
            preserveState: true,
            only: ['cart'],
            showProgress: false,
            onSuccess: () => {
                reloadCart();
                toast.success('Produit ajouté au panier', {
                    description: 'L\'article a été ajouté avec succès.',
                    icon: createElement(ShoppingCart, { className: 'h-8 w-8 text-emerald-800' }),
                    duration: 2500,
                    style: { background: '#10f298', color: '#2f3030', border: '1px solid #09f5ba' },
                });
            },
        });
    }, []);

    const clearCart = useCallback(() => {
        router.post(route('tenant.cart.clear'), {}, {
            preserveScroll: true,
            preserveState: true,
            only: ['cart'],
            showProgress: false,
            onSuccess: () => {
                reloadCart();
                toast.success('Panier vidé');
            },
        });
    }, []);

    const applyCoupon = useCallback((code: string) => {
        router.post(route('tenant.cart.apply-coupon'), { code }, {
            preserveScroll: true,
            preserveState: true,
            only: ['cart'],
            showProgress: false,
            onSuccess: () => {
                reloadCart();
                toast.success('Code promo appliqué');
            },
            onError: (errors) => toast.error(errors.code || 'Erreur'),
        });
    }, []);

    const removeCoupon = useCallback(() => {
        router.delete(route('tenant.cart.remove-coupon'), {
            preserveScroll: true,
            preserveState: true,
            only: ['cart'],
            showProgress: false,
            onSuccess: () => {
                reloadCart();
                toast.success('Code promo retiré');
            },
        });
    }, []);

    /** Force la mise à jour partielle de la prop `cart` sans recharger toute la page */
    function reloadCart() {
        router.get(window.location.href, {}, {
            only: ['cart'],
            preserveState: true,
            preserveScroll: true,
            replace: true,
            showProgress: false,
        });
    }

    return { cart, itemCount, addToCart, updateQuantity, removeItem, clearCart, applyCoupon, removeCoupon };
}

export function useCart() {
    const { props } = usePage<{ cart?: Cart }>();

    const cart = props.cart;
    const itemCount = cart?.items?.reduce((sum, item) => sum + item.quantite, 0) ?? 0;

    const updateQuantity = useCallback((itemId: number, quantity: number) => {
        router.patch(route('tenant.cart.update', itemId), { quantite: quantity }, {
            preserveScroll: true,
            preserveState: true,
            only: ['cart'],
            showProgress: false,
            onSuccess: () => router.reload({ only: ['cart'] }),
        });
    }, []);

    const addToCart = useCallback((productId: number | string, quantity = 1, variantId?: number) => {
        router.post(route('tenant.cart.add', productId), { quantity, variante_id: variantId }, {
            preserveScroll: true,
            preserveState: true,
            only: ['cart'],
            showProgress: false,
            onSuccess: () => {
                router.reload({ only: ['cart'] });
                toast.success('Produit ajouté au panier', {
                    description: 'L\'article a été ajouté avec succès.',
                    icon: createElement(ShoppingCart, { className: 'h-5 w-5 text-emerald-500' }),
                    duration: 2500,
                    style: getToastStyle('success'),
                });
            },
        });
    }, []);

    const removeItem = useCallback((itemId: number) => {
        router.delete(route('tenant.cart.remove', itemId), {
            preserveScroll: true,
            preserveState: true,
            only: ['cart'],
            showProgress: false,
            onSuccess: () => {
                router.reload({ only: ['cart'] });
                toast.success('Produit retiré du panier', {
                    description: 'L\'article a été supprimé avec succès.',
                    icon: createElement(Trash2, { className: 'h-5 w-5 text-red-500' }),
                    duration: 2500,
                    style: getToastStyle('error'),
                });
            },
        });
    }, []);

    const clearCart = useCallback(() => {
        router.post(route('tenant.cart.clear'), {}, {
            preserveScroll: true,
            only: ['cart'],
            showProgress: false,
            onSuccess: () => {
                router.reload({ only: ['cart'] });
                toast.success('Panier vidé');
            },
        });
    }, []);

    const applyCoupon = useCallback((code: string) => {
        router.post(route('tenant.cart.apply-coupon'), { code }, {
            preserveScroll: true,
            onSuccess: () => {
                router.reload({ only: ['cart'] });
                toast.success('Code promo appliqué');
            },
            onError: (errors) => toast.error(errors.code || 'Erreur'),
        });
    }, []);

    const removeCoupon = useCallback(() => {
        router.delete(route('tenant.cart.remove-coupon'), {
            preserveScroll: true,
            onSuccess: () => {
                router.reload({ only: ['cart'] });
                toast.success('Code promo retiré');
            },
        });
    }, []);

    return {
        cart,
        itemCount,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        applyCoupon,
        removeCoupon,
    };
}
