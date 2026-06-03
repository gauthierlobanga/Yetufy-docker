/* eslint-disable @typescript-eslint/no-unused-expressions */
// resources/js/hooks/ecommerce/use-wishlist.ts
import { usePage } from '@inertiajs/react';
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

function getCsrfToken(): string {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);

    if (match) {
        return decodeURIComponent(match[1]);
    }

    const meta = document.querySelector('meta[name="csrf-token"]');

    return meta?.getAttribute('content') ?? '';
}

export function useWishlist() {
    const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());

    // Vérification de l'authentification
    const { auth } = usePage().props as any;
    const isAuthenticated = !!auth?.user;

    const toggleWishlist = useCallback(
        async (productId: number | string) => {
            // Rediriger vers la connexion si non authentifié
            if (!isAuthenticated) {
                window.location.href = route('tenant.login');

                return;
            }

            // Conversion sécurisée en chaîne
            const idStr = String(productId);

            if (idStr === 'NaN' || idStr === '' || idStr === 'undefined' || idStr === 'null') {
                toast.error('Produit invalide.');

                return;
            }

            const currentlyIn = wishlistIds.has(idStr);

            // Optimistic update
            setWishlistIds((prev) => {
                const next = new Set(prev);
                currentlyIn ? next.delete(idStr) : next.add(idStr);

                return next;
            });

            try {
                const response = await fetch(`/wishlist/toggle/${idStr}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRF-TOKEN': getCsrfToken(),
                    },
                });

                if (!response.ok) {
                    const error = await response.json().catch(() => ({}));

                    throw new Error(error.message || 'Erreur serveur');
                }

                const data = await response.json();
                toast.success(data.message ?? 'Wishlist mise à jour', { duration: 2000 });
            } catch (error: any) {
                // Rétablir l'état précédent
                setWishlistIds((prev) => {
                    const next = new Set(prev);
                    currentlyIn ? next.add(idStr) : next.delete(idStr);

                    return next;
                });
                toast.error(error.message || 'Impossible de modifier la wishlist.');
            }
        },
        [wishlistIds, isAuthenticated],
    );

    const isInWishlist = useCallback(
        (productId: number | string) => wishlistIds.has(String(productId)),
        [wishlistIds],
    );

    return { toggleWishlist, isInWishlist, wishlistIds };
}
