/* eslint-disable @typescript-eslint/no-unused-vars */
// resources/js/pages/Shop/Wishlist/Index.tsx
import type { PageProps } from '@inertiajs/core';
import { Link, router, usePage, Head } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Heart,
    ShoppingBag,
    Trash2,
    Sparkles,
    Lock,
    Globe,
    ArrowRight,
} from 'lucide-react';
import { toast } from 'sonner';

import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { useCart } from '@/hooks/ecommerce/use-cart';
import { cn } from '@/lib/utils';
import tenant from '@/routes/tenant';

// ---------- Types ----------
interface WishlistItem {
    id: string;
    quantite: number;
    note?: string | null;
    produit: {
        id: string;
        nom: string;
        slug: string;
        prix_actuel: number | string;
        image_principale?: string | null;
        url: string;
    };
}

interface Props extends PageProps {
    wishlist: {
        nom: string;
        est_publique: boolean;
    };
    items: WishlistItem[];
}

// ---------- Helpers ----------
function getImageUrl(image?: string | null): string {
    if (!image) {
        return '/images/Vue-Storefront.png';
    }

    if (
        image.startsWith('http://') ||
        image.startsWith('https://') ||
        image.startsWith('/storage') ||
        image.startsWith('/')
    ) {
        return image;
    }

    return `/storage/${image.replace(/^\//, '')}`;
}

function formatPrice(amount: number | string): string {
    const value = Number(amount);

    if (Number.isNaN(value)) {
        return String(amount);
    }

    return new Intl.NumberFormat('fr-CD', {
        style: 'currency',
        currency: 'CDF',
        maximumFractionDigits: 0,
    }).format(value);
}

// ---------- Page ----------
export default function ShopWishlistPage() {
    const { wishlist, items } = usePage<Props>().props;
    const { addToCart } = useCart();

    const handleRemove = (productId: string) => {
        router.delete(route('tenant.wishlist.remove', productId), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () =>
                toast.success('Produit retiré de votre liste de souhaits'),
            onError: () =>
                toast.error('Une erreur est survenue lors de la suppression'),
        });
    };

    const handleAddToCart = (productId: string, quantity: number = 1) => {
        addToCart(productId, quantity);
        toast.success('Produit ajouté au panier');
    };

    return (
        <SidebarProvider
            style={
                {
                    '--sidebar-width': 'calc(var(--spacing) * 72)',
                    '--header-height': 'calc(var(--spacing) * 12)',
                } as React.CSSProperties
            }
        >
            <Head title={wishlist.nom} />
            <AppSidebar />
            <SidebarInset>
                <SiteHeader />
                <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-emerald-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
                    <div className="flex flex-1 flex-col gap-6 p-4 pt-0 md:p-6 md:pt-0">
                        {/* En-tête de page */}
                        <div className="space-y-1">
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                {wishlist.nom}
                            </h1>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Retrouvez vos coups de cœur, comparez vos
                                favoris et ajoutez-les au panier en un clic.
                            </p>
                        </div>

                        {/* Hero card */}
                        <div
                            className={cn(
                                'relative overflow-hidden rounded-3xl border',
                                'border-slate-200/70 bg-white/80 backdrop-blur-xl',
                                'shadow-[0_10px_40px_rgba(15,23,42,0.06)]',
                                'dark:border-slate-800/70 dark:bg-slate-900/70',
                            )}
                        >
                            <div className="absolute inset-0 bg-linear-to-br from-rose-500/4 via-transparent to-emerald-500/4" />
                            <div className="relative flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/20">
                                        <Heart className="h-7 w-7 fill-current" />
                                    </div>
                                    <div>
                                        <div className="mb-2 flex flex-wrap items-center gap-2">
                                            <Badge
                                                variant="secondary"
                                                className="rounded-full border-0 bg-rose-50 px-3 py-1 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400"
                                            >
                                                <Sparkles className="mr-1 h-3 w-3" />
                                                Mes favoris
                                            </Badge>
                                            <Badge
                                                variant="outline"
                                                className="rounded-full"
                                            >
                                                {wishlist.est_publique ? (
                                                    <>
                                                        <Globe className="mr-1 h-3 w-3" />
                                                        Publique
                                                    </>
                                                ) : (
                                                    <>
                                                        <Lock className="mr-1 h-3 w-3" />
                                                        Privée
                                                    </>
                                                )}
                                            </Badge>
                                        </div>
                                        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                                            {items.length}{' '}
                                            {items.length > 1
                                                ? 'articles sauvegardés'
                                                : 'article sauvegardé'}
                                        </h2>
                                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                            Gardez vos produits préférés à
                                            portée de main et ajoutez-les au
                                            panier au bon moment.
                                        </p>
                                    </div>
                                </div>
                                {items.length > 0 && (
                                    <Button
                                        asChild
                                        variant="outline"
                                        className="rounded-2xl"
                                    >
                                        <Link
                                            href={route('tenant.product.index')}
                                        >
                                            Continuer mes achats
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Contenu */}
                        <AnimatePresence mode="wait">
                            {items.length > 0 ? (
                                <motion.div
                                    key="wishlist-grid"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.35 }}
                                    className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
                                >
                                    {items.map((item, index) => (
                                        <motion.article
                                            key={item.id}
                                            initial={{ opacity: 0, y: 16 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{
                                                duration: 0.35,
                                                delay: index * 0.04,
                                            }}
                                            className={cn(
                                                'group relative overflow-hidden rounded-3xl',
                                                'border border-slate-200/70 bg-white/90 backdrop-blur-xl',
                                                'shadow-[0_8px_30px_rgba(15,23,42,0.06)]',
                                                'transition-all duration-500 hover:-translate-y-1.5',
                                                'hover:border-emerald-200 hover:shadow-[0_20px_60px_rgba(16,185,129,0.10)]',
                                                'dark:border-slate-800/70 dark:bg-slate-900/90',
                                            )}
                                        >
                                            {/* Glow */}
                                            <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-emerald-500/3 via-transparent to-rose-500/3 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                                            {/* Image */}
                                            <Link
                                                href={item.produit.url}
                                                className="relative block aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800"
                                            >
                                                <img
                                                    src={getImageUrl(
                                                        item.produit
                                                            .image_principale,
                                                    )}
                                                    alt={item.produit.nom}
                                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    loading="lazy"
                                                />
                                                <div className="absolute inset-0 bg-linear-to-t from-black/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                                                {/* Remove button */}
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        handleRemove(
                                                            item.produit.id,
                                                        );
                                                    }}
                                                    className={cn(
                                                        'absolute top-3 right-3 z-10 flex h-10 w-10 items-center justify-center rounded-2xl',
                                                        'border border-white/70 bg-white/85 backdrop-blur-xl',
                                                        'text-slate-500 shadow-lg shadow-slate-900/10',
                                                        'transition-all duration-300 hover:scale-105 hover:bg-red-50 hover:text-red-600',
                                                        'dark:border-slate-700/70 dark:bg-slate-900/85',
                                                    )}
                                                    aria-label="Retirer de la wishlist"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>

                                                {/* Favorite badge */}
                                                <div className="absolute top-3 left-3">
                                                    <Badge className="rounded-full border-0 bg-rose-500 px-2.5 py-1 text-[10px] font-semibold text-white shadow-lg shadow-rose-500/20">
                                                        <Heart className="mr-1 h-3 w-3 fill-current" />
                                                        Favori
                                                    </Badge>
                                                </div>
                                            </Link>

                                            {/* Content */}
                                            <div className="p-5">
                                                <Link
                                                    href={item.produit.url}
                                                    className="block"
                                                >
                                                    <h3 className="line-clamp-2 min-h-11 text-sm leading-5 font-semibold text-slate-900 transition-colors group-hover:text-emerald-700 dark:text-white dark:group-hover:text-emerald-400">
                                                        {item.produit.nom}
                                                    </h3>
                                                </Link>

                                                <div className="mt-3">
                                                    <p className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                                                        {formatPrice(
                                                            item.produit
                                                                .prix_actuel,
                                                        )}
                                                    </p>
                                                </div>

                                                <div className="mt-3 space-y-1">
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                                        Quantité souhaitée :{' '}
                                                        <span className="font-medium text-slate-700 dark:text-slate-300">
                                                            {item.quantite}
                                                        </span>
                                                    </p>
                                                    {item.note && (
                                                        <p className="line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
                                                            Note : {item.note}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="mt-5 flex gap-2">
                                                    <Button
                                                        onClick={() =>
                                                            handleAddToCart(
                                                                item.produit.id,
                                                                item.quantite,
                                                            )
                                                        }
                                                        className={cn(
                                                            'h-11 flex-1 rounded-2xl border-0',
                                                            'bg-linear-to-r from-emerald-600 to-emerald-500',
                                                            'text-white shadow-lg shadow-emerald-500/20',
                                                            'hover:shadow-xl hover:shadow-emerald-500/30',
                                                        )}
                                                    >
                                                        <ShoppingBag className="mr-2 h-4 w-4" />
                                                        Ajouter
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        onClick={() =>
                                                            handleRemove(
                                                                item.produit.id,
                                                            )
                                                        }
                                                        className="h-11 w-11 rounded-2xl border-slate-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-slate-700 dark:hover:border-red-800 dark:hover:bg-red-950/20"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </motion.article>
                                    ))}
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={cn(
                                        'flex flex-col items-center justify-center',
                                        'rounded-3xl border border-dashed border-slate-200/80',
                                        'bg-white/70 px-6 py-20 text-center backdrop-blur-xl',
                                        'dark:border-slate-800 dark:bg-slate-900/40',
                                    )}
                                >
                                    <div className="relative mb-6">
                                        <div className="absolute inset-0 rounded-full bg-rose-500/20 blur-2xl" />
                                        <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-linear-to-br from-rose-500 to-pink-500 text-white shadow-xl shadow-rose-500/20">
                                            <Heart className="h-10 w-10" />
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                        Votre wishlist est vide
                                    </h3>
                                    <p className="mt-3 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                                        Ajoutez vos produits préférés à votre
                                        liste de souhaits pour les retrouver
                                        rapidement et les acheter au meilleur
                                        moment.
                                    </p>
                                    <Button
                                        asChild
                                        className="mt-8 h-11 rounded-2xl bg-linear-to-r from-emerald-600 to-emerald-500 px-6 text-white shadow-lg shadow-emerald-500/20"
                                    >
                                        <Link
                                            href={route('tenant.product.index')}
                                        >
                                            Découvrir des produits
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
