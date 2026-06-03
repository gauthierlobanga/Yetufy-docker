// // resources/js/components/ecommerce/products/ProductCard.tsx
// import { Link } from '@inertiajs/react';
// import { motion } from 'framer-motion';
// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// import { Star, ShoppingCart, Heart, PackageOpen } from 'lucide-react';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { useCart } from '@/hooks/ecommerce/use-cart';
// import type { Product } from '@/types/ecommerce/products';

// interface ProductCardProps {
//     product: Product;
//     viewMode?: 'grid' | 'list';
// }

// /** Retourne une URL d’image valide ou un placeholder */
// function getImageUrl(image: string | null | undefined): string {
//     if (!image) {
//         return '/images/Vue-Storefront.png';
//     }

//     if (image.startsWith('http') || image.startsWith('/storage')) {
//         return image;
//     }

//     return `/storage/${image.replace(/^\//, '')}`;
// }

// /** Formate un nombre en devise (CDF par défaut) */
// function formatCurrency(amount: number, currency = 'CDF'): string {
//     return new Intl.NumberFormat('fr-CD', {
//         style: 'currency',
//         currency,
//         minimumFractionDigits: 0,
//     }).format(amount);
// }

// export default function ProductCard({
//     product,
//     viewMode = 'grid',
// }: ProductCardProps) {
//     const noteMoyenne = Number(product.note_moyenne) || 0;
//     const soldCount = Number(product.sold_count) || 0;
//     const { addToCart } = useCart();

//     const formatSoldCount = (count: number) =>
//         count >= 1000
//             ? `${Math.floor(count / 1000)}k+ vendus`
//             : `${count} vendu${count > 1 ? 's' : ''}`;

//     const renderStars = (size: 'sm' | 'md' = 'sm') => {
//         const iconClass = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4';

//         return Array.from({ length: 5 }, (_, i) => (
//             <Star
//                 key={i}
//                 className={`${iconClass} ${
//                     i < Math.floor(noteMoyenne)
//                         ? 'fill-yellow-400 text-yellow-400'
//                         : 'fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700'
//                 }`}
//             />
//         ));
//     };

//     const handleAddToCart = (e: React.MouseEvent) => {
//         e.preventDefault();
//         e.stopPropagation();
//         addToCart(product.id, 1);
//     };

//     // ──────────────────────────── MODE LISTE ────────────────────────────
//     if (viewMode === 'list') {
//         const oldPrice = product.est_en_promotion ? product.prix_ttc : null;
//         const currentPrice = product.prix_actuel ?? product.prix_ttc;
//         const discountPercentage = oldPrice
//             ? Math.round(((oldPrice - currentPrice) / oldPrice) * 100)
//             : (product.reduction_pourcentage ?? null);

//         return (
//             <motion.div
//                 whileHover={{ y: -2 }}
//                 className="group flex flex-col gap-4 rounded-xl border bg-card p-4 transition-colors hover:border-emerald-200 sm:flex-row dark:hover:border-emerald-800"
//             >
//                 {/* Image */}
//                 <Link href={product.url} className="block shrink-0 sm:w-48">
//                     <div className="relative aspect-square overflow-hidden rounded-lg bg-muted sm:aspect-auto sm:h-40">
//                         <img
//                             src={getImageUrl(product.image_principale)}
//                             alt={product.nom}
//                             className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
//                             loading="lazy"
//                         />
//                     </div>
//                 </Link>

//                 {/* Détails */}
//                 <div className="min-w-0 flex-1 space-y-2">
//                     <Link href={product.url} className="block">
//                         <h3 className="line-clamp-2 text-base font-semibold hover:text-emerald-600 dark:hover:text-emerald-400">
//                             {product.nom}
//                         </h3>
//                     </Link>

//                     <div className="flex flex-wrap items-center gap-2">
//                         <span className="text-xl font-bold text-foreground">
//                             {formatCurrency(currentPrice)}
//                         </span>
//                         {oldPrice && (
//                             <>
//                                 <span className="text-sm text-muted-foreground line-through">
//                                     {formatCurrency(oldPrice)}
//                                 </span>
//                                 {discountPercentage && (
//                                     <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
//                                         -{discountPercentage}%
//                                     </Badge>
//                                 )}
//                             </>
//                         )}
//                     </div>

//                     <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                         <div className="flex items-center">
//                             {renderStars('md')}
//                         </div>
//                         <span className="font-medium text-foreground">
//                             {noteMoyenne.toFixed(1)}
//                         </span>
//                         <span>·</span>
//                         <span>{formatSoldCount(soldCount)}</span>
//                     </div>

//                     {product.badge && (
//                         <Badge variant="secondary" className="text-xs">
//                             {product.badge}
//                         </Badge>
//                     )}
//                 </div>

//                 {/* Actions */}
//                 <div className="flex gap-2 sm:w-32 sm:flex-col">
//                     <Button
//                         onClick={handleAddToCart}
//                         size="sm"
//                         className="gap-2"
//                     >
//                         <ShoppingCart className="h-4 w-4" />
//                         Panier
//                     </Button>
//                     <Button variant="outline" size="sm" className="gap-2">
//                         <Heart className="h-4 w-4" />
//                         <span className="sm:hidden">Favoris</span>
//                     </Button>
//                 </div>
//             </motion.div>
//         );
//     }

//     // ──────────────────────────── MODE GRILLE ────────────────────────────
//     return (
//         <motion.div
//             whileHover={{ y: -4 }}
//             className="group relative flex h-full flex-col rounded-xl border bg-card transition-colors hover:border-emerald-200 dark:hover:border-emerald-800"
//         >
//             <Link href={product.url} className="flex flex-1 flex-col">
//                 <div className="relative aspect-square overflow-hidden rounded-t-xl bg-muted">
//                     <img
//                         src={getImageUrl(product.image_principale)}
//                         alt={product.nom}
//                         className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
//                         loading="lazy"
//                     />

//                     {/* Badges flottants */}
//                     <div className="absolute top-2 left-2 flex flex-col gap-1">
//                         {product.badge && (
//                             <Badge className="bg-emerald-600 text-white">
//                                 {product.badge}
//                             </Badge>
//                         )}
//                         {product.est_en_promotion &&
//                             product.reduction_pourcentage && (
//                                 <Badge className="bg-red-500 text-white">
//                                     -{product.reduction_pourcentage}%
//                                 </Badge>
//                             )}
//                     </div>

//                     {/* Bouton panier au survol */}
//                     <div className="absolute inset-x-0 bottom-2 px-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
//                         <Button
//                             onClick={handleAddToCart}
//                             size="sm"
//                             className="w-full gap-2 bg-white/90 text-foreground backdrop-blur-sm hover:bg-white dark:bg-gray-900/90 dark:hover:bg-gray-900"
//                         >
//                             <ShoppingCart className="h-4 w-4" />
//                             Ajouter
//                         </Button>
//                     </div>
//                 </div>

//                 {/* Contenu */}
//                 <div className="flex flex-1 flex-col p-3">
//                     <h3 className="line-clamp-2 text-sm leading-tight font-medium text-foreground">
//                         {product.nom}
//                     </h3>

//                     <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
//                         <div className="flex">{renderStars()}</div>
//                         <span className="ml-0.5">{noteMoyenne.toFixed(1)}</span>
//                         <span className="mx-1">•</span>
//                         <span>{formatSoldCount(soldCount)}</span>
//                     </div>

//                     <div className="mt-auto flex items-baseline gap-2 pt-2">
//                         <span className="text-lg font-bold text-foreground">
//                             {formatCurrency(
//                                 product.prix_actuel ?? product.prix_ttc,
//                             )}
//                         </span>
//                         {product.est_en_promotion && (
//                             <span className="text-sm text-muted-foreground line-through">
//                                 {formatCurrency(product.prix_ttc)}
//                             </span>
//                         )}
//                     </div>
//                 </div>
//             </Link>
//         </motion.div>
//     );
// }
// resources/js/components/ecommerce/products/ProductCard.tsx
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Heart, PackageOpen } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/ecommerce/use-cart';
import { useWishlist } from '@/hooks/ecommerce/use-wishlist';
import { handleImageFallback, resolveImageUrl } from '@/lib/media';
import type { Product } from '@/types/ecommerce/products';

interface ProductCardProps {
    product: Product;
    viewMode?: 'grid' | 'list';
}

/** Format devise */
function formatCurrency(amount: number, currency = 'CDF'): string {
    return new Intl.NumberFormat('fr-CD', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
    }).format(amount);
}

/** Étoiles */
function StarRating({
    rating,
    size = 'sm',
}: {
    rating: number;
    size?: 'sm' | 'md';
}) {
    const iconClass = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4';

    return (
        <div className="flex items-center">
            {Array.from({ length: 5 }, (_, i) => (
                <Star
                    key={i}
                    className={`${iconClass} ${
                        i < Math.floor(rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700'
                    }`}
                />
            ))}
        </div>
    );
}

export default function ProductCard({
    product,
    viewMode = 'grid',
}: ProductCardProps) {
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const isWishlisted = isInWishlist(product.id);
    const note = Number(product.note_moyenne) || 0;
    const sold = Number(product.sold_count) || 0;
    const oldPrice = product.est_en_promotion ? product.prix_ttc : null;
    const currentPrice = product.prix_actuel ?? product.prix_ttc;
    const discountPercent = oldPrice
        ? Math.round(((oldPrice - currentPrice) / oldPrice) * 100)
        : (product.reduction_pourcentage ?? null);
    const outOfStock = (product.quantite_stock ?? 1) <= 0;

    const formatSoldCount = (count: number) =>
        count >= 1000
            ? `${Math.floor(count / 1000)}k+ vendus`
            : `${count} vendu${count > 1 ? 's' : ''}`;

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product.id, 1);
        toast.success('Ajouté au panier');
    };

    const handleToggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('🛒 Produit ID:', product.id, typeof product.id); // ← à supprimer après vérification
        toggleWishlist(product.id);
    };

    // ──────── MODE LISTE ────────
    if (viewMode === 'list') {
        return (
            <motion.div
                whileHover={{ y: -2 }}
                className="group flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all hover:border-emerald-200 hover:shadow-md sm:flex-row dark:border-slate-800 dark:bg-slate-900/80 dark:hover:border-emerald-700"
            >
                {/* Image */}
                <Link href={product.url} className="block shrink-0 sm:w-48">
                    <div className="relative aspect-square overflow-hidden rounded-xl bg-slate-100 sm:aspect-auto sm:h-40 dark:bg-slate-800">
                        <img
                            src={resolveImageUrl(product.image_principale)}
                            alt={product.nom}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                            onError={handleImageFallback()}
                        />
                        {outOfStock && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                                <Badge variant="destructive" className="gap-1">
                                    <PackageOpen className="h-3.5 w-3.5" />{' '}
                                    Rupture
                                </Badge>
                            </div>
                        )}
                    </div>
                </Link>

                {/* Détails */}
                <div className="min-w-0 flex-1 space-y-2">
                    <Link href={product.url} className="block">
                        <h3 className="line-clamp-2 text-base font-semibold text-slate-800 hover:text-emerald-600 dark:text-slate-100 dark:hover:text-emerald-400">
                            {product.nom}
                        </h3>
                    </Link>

                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xl font-bold text-slate-900 dark:text-white">
                            {formatCurrency(currentPrice)}
                        </span>
                        {oldPrice && (
                            <>
                                <span className="text-sm text-slate-400 line-through">
                                    {formatCurrency(oldPrice)}
                                </span>
                                {discountPercent && (
                                    <Badge className="bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400">
                                        -{discountPercent}%
                                    </Badge>
                                )}
                            </>
                        )}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                        <StarRating rating={note} size="md" />
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                            {note.toFixed(1)}
                        </span>
                        <span>·</span>
                        <span>{formatSoldCount(sold)}</span>
                    </div>

                    {product.badge && (
                        <Badge variant="secondary" className="text-xs">
                            {product.badge}
                        </Badge>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 sm:w-32 sm:flex-col">
                    <Button
                        onClick={handleAddToCart}
                        size="sm"
                        className="gap-2"
                        disabled={outOfStock}
                    >
                        <ShoppingCart className="h-4 w-4" />
                        Panier
                    </Button>
                    <Button
                        variant={isWishlisted ? 'default' : 'outline'}
                        size="sm"
                        className="gap-2"
                        onClick={handleToggleWishlist}
                    >
                        <Heart
                            className={`h-4 w-4 ${isWishlisted ? 'fill-white' : ''}`}
                        />
                        <span className="sm:hidden">Favoris</span>
                    </Button>
                </div>
            </motion.div>
        );
    }

    // ──────── MODE GRILLE ────────
    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="group relative flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all hover:border-emerald-200 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/80 dark:hover:border-emerald-700"
        >
            <Link href={product.url} className="flex flex-1 flex-col">
                {/* Image */}
                <div className="relative aspect-square overflow-hidden rounded-t-2xl bg-slate-100 dark:bg-slate-800">
                    <img
                        src={resolveImageUrl(product.image_principale)}
                        alt={product.nom}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        onError={handleImageFallback()}
                    />

                    {/* Badges flottants */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {product.badge && (
                            <Badge className="bg-emerald-600 text-white shadow-sm">
                                {product.badge}
                            </Badge>
                        )}
                        {discountPercent && (
                            <Badge className="bg-rose-500 text-white shadow-sm">
                                -{discountPercent}%
                            </Badge>
                        )}
                        {outOfStock && (
                            <Badge variant="destructive" className="gap-1">
                                <PackageOpen className="h-3 w-3" /> Rupture
                            </Badge>
                        )}
                    </div>

                    {/* Boutons au survol */}
                    <div className="absolute inset-x-0 bottom-2 flex justify-center gap-2 px-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <Button
                            onClick={handleAddToCart}
                            size="sm"
                            disabled={outOfStock}
                            className="gap-1 bg-white/90 text-slate-700 shadow backdrop-blur-sm hover:bg-white dark:bg-slate-800/90 dark:text-slate-200 dark:hover:bg-slate-800"
                        >
                            <ShoppingCart className="h-4 w-4" />
                            Ajouter
                        </Button>
                        <Button
                            onClick={handleToggleWishlist}
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white dark:bg-slate-800/90 dark:hover:bg-slate-800"
                        >
                            <Heart
                                className={`h-4 w-4 ${
                                    isWishlisted
                                        ? 'fill-rose-500 text-rose-500'
                                        : 'text-slate-600'
                                }`}
                            />
                        </Button>
                    </div>
                </div>

                {/* Contenu */}
                <div className="flex flex-1 flex-col p-3">
                    <h3 className="line-clamp-2 text-sm leading-snug font-medium text-slate-800 dark:text-slate-100">
                        {product.nom}
                    </h3>

                    <div className="mt-1 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                        <StarRating rating={note} />
                        <span className="ml-0.5 font-medium">
                            {note.toFixed(1)}
                        </span>
                        <span className="mx-1">•</span>
                        <span>{formatSoldCount(sold)}</span>
                    </div>

                    <div className="mt-auto flex items-baseline gap-2 pt-2">
                        <span className="text-lg font-bold text-slate-900 dark:text-white">
                            {formatCurrency(currentPrice)}
                        </span>
                        {oldPrice && (
                            <span className="text-sm text-slate-400 line-through">
                                {formatCurrency(oldPrice)}
                            </span>
                        )}
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
