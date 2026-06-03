/* eslint-disable react-hooks/rules-of-hooks */
// resources/js/components/ecommerce/products/ProductCardCompact.tsx
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Star, Sparkles, Eye } from 'lucide-react';
import { useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/ecommerce/use-cart';
import { useWishlist } from '@/hooks/ecommerce/use-wishlist';
import { handleImageFallback, resolveImageUrl } from '@/lib/media';
import { cn } from '@/lib/utils';
import type { Product } from '@/types/ecommerce/products';

interface ProductCardCompactProps {
    product: Product;
    showDiscountBadge?: boolean;
}

function formatPrice(amount: number): string {
    return new Intl.NumberFormat('fr-CD', {
        style: 'currency',
        currency: 'CDF',
        maximumFractionDigits: 0,
    }).format(amount);
}

function compactNumber(value: number): string {
    if (value >= 1000) {
        return `${(value / 1000).toFixed(1).replace('.0', '')}k`;
    }

    return String(value);
}

export default function ProductCardCompact({
    product,
    showDiscountBadge = false,
}: ProductCardCompactProps) {
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();

    if (!product) {
        return null;
    } // sécurité

    const isWishlisted = isInWishlist(product.id);
    const rating = Number(product.note_moyenne) || 0;
    const sold = Number(product.sold_count) || 0;
    const outOfStock = (product.quantite_stock ?? 0) <= 0;

    const currentPrice = product.prix_actuel ?? product.prix_ttc;
    const oldPrice =
        product.est_en_promotion && product.prix_ttc > currentPrice
            ? product.prix_ttc
            : null;
    const discount = oldPrice
        ? Math.round(((oldPrice - currentPrice) / oldPrice) * 100)
        : product.reduction_pourcentage || 0;

    const handleAddToCart = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();

            if (!outOfStock) {
                addToCart(product.id, 1);
            }
        },
        [outOfStock, product.id, addToCart],
    );

    const handleToggleWishlist = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
        },
        [product.id, toggleWishlist],
    );

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="group h-full"
        >
            <Link href={product.url} className="block h-full">
                <article
                    className={cn(
                        'relative flex h-full flex-col overflow-hidden rounded-3xl',
                        'border border-slate-200/70 bg-white/90 backdrop-blur-xl',
                        'shadow-[0_8px_30px_rgb(15,23,42,0.06)]',
                        'transition-all duration-500',
                        'hover:-translate-y-1.5',
                        'hover:border-emerald-200/80',
                        'hover:shadow-[0_20px_60px_rgba(16,185,129,0.12)]',
                        'dark:border-slate-800/80 dark:bg-slate-900/90',
                        'dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)]',
                        'dark:hover:border-emerald-800/60',
                        'dark:hover:shadow-[0_20px_60px_rgba(16,185,129,0.08)]',
                    )}
                >
                    {/* Glow subtil */}
                    <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-emerald-500/3 via-transparent to-cyan-500/3 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                    {/* Zone image */}
                    <div className="relative">
                        <div className="aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
                            <img
                                src={resolveImageUrl(product.image_principale)}
                                alt={product.nom}
                                loading="lazy"
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                                onError={handleImageFallback()}
                            />
                        </div>

                        {/* Overlay linear */}
                        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                        {/* Badges */}
                        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                            {showDiscountBadge &&
                                product.est_en_promotion &&
                                discount > 0 && (
                                    <Badge className="rounded-full border-0 bg-rose-500 px-2.5 py-1 text-[10px] font-semibold text-white shadow-lg shadow-rose-500/25">
                                        -{discount}%
                                    </Badge>
                                )}
                            {product.badge && (
                                <Badge className="rounded-full border-0 bg-emerald-600 px-2.5 py-1 text-[10px] font-semibold text-white shadow-lg shadow-emerald-500/20">
                                    <Sparkles className="mr-1 h-3 w-3" />
                                    {product.badge}
                                </Badge>
                            )}
                            {outOfStock && (
                                <Badge
                                    variant="secondary"
                                    className="rounded-full bg-slate-900/85 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur"
                                >
                                    Rupture
                                </Badge>
                            )}
                        </div>

                        {/* Actions flottantes */}
                        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
                            {/* Wishlist */}
                            <button
                                type="button"
                                onClick={handleToggleWishlist}
                                aria-label="Ajouter aux favoris"
                                className={cn(
                                    'flex h-10 w-10 items-center justify-center rounded-2xl',
                                    'border border-white/70 bg-white/85 backdrop-blur-xl',
                                    'shadow-lg shadow-slate-900/10',
                                    'transition-all duration-300',
                                    'hover:scale-105 hover:bg-white',
                                    'dark:border-slate-700/70 dark:bg-slate-900/85',
                                    isWishlisted &&
                                        'border-rose-200 bg-rose-50 text-rose-500 dark:border-rose-800 dark:bg-rose-950/30',
                                )}
                            >
                                <Heart
                                    className={cn(
                                        'h-4 w-4 transition-all',
                                        isWishlisted && 'fill-current',
                                    )}
                                />
                            </button>

                            {/* Aperçu */}
                            <span
                                className={cn(
                                    'flex h-10 w-10 items-center justify-center rounded-2xl',
                                    'border border-white/70 bg-white/85 backdrop-blur-xl',
                                    'text-slate-600 shadow-lg shadow-slate-900/10',
                                    'opacity-0 transition-all duration-300',
                                    'translate-y-2 group-hover:translate-y-0 group-hover:opacity-100',
                                    'dark:border-slate-700/70 dark:bg-slate-900/85 dark:text-slate-300',
                                )}
                            >
                                <Eye className="h-4 w-4" />
                            </span>
                        </div>

                        {/* CTA Ajouter au panier */}
                        <div className="absolute inset-x-3 bottom-3 z-10 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                            <Button
                                size="sm"
                                onClick={handleAddToCart}
                                disabled={outOfStock}
                                className={cn(
                                    'h-11 w-full rounded-2xl border-0',
                                    'bg-linear-to-r from-emerald-600 via-emerald-500 to-teal-500',
                                    'text-sm font-semibold text-white',
                                    'shadow-lg shadow-emerald-500/25',
                                    'transition-all duration-300',
                                    'hover:shadow-xl hover:shadow-emerald-500/35',
                                    'disabled:cursor-not-allowed disabled:opacity-60',
                                )}
                            >
                                <ShoppingBag className="mr-2 h-4 w-4" />
                                Ajouter au panier
                            </Button>
                        </div>
                    </div>

                    {/* Contenu */}
                    <div className="flex flex-1 flex-col p-4">
                        {/* Note + ventes */}
                        <div className="mb-2 flex items-center gap-2 text-xs">
                            <div className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 font-medium text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
                                <Star className="h-3 w-3 fill-current" />
                                {rating.toFixed(1)}
                            </div>
                            {sold > 0 && (
                                <span className="text-slate-500 dark:text-slate-400">
                                    {compactNumber(sold)} vendus
                                </span>
                            )}
                        </div>

                        {/* Nom produit */}
                        <h3 className="line-clamp-2 min-h-11 text-sm leading-5 font-semibold text-slate-900 transition-colors group-hover:text-emerald-700 dark:text-white dark:group-hover:text-emerald-400">
                            {product.nom}
                        </h3>

                        {/* Prix */}
                        <div className="mt-auto pt-3">
                            <div className="flex flex-wrap items-end gap-2">
                                <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                                    {formatPrice(currentPrice)}
                                </span>
                                {oldPrice && (
                                    <span className="text-xs font-medium text-slate-400 line-through">
                                        {formatPrice(oldPrice)}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </article>
            </Link>
        </motion.div>
    );
}
