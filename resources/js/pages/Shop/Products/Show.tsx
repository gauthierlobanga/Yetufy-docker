/* eslint-disable @typescript-eslint/no-unused-vars */
// resources/js/Pages/Product/Show.tsx
import { Head, Link, usePage, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Star,
    ShoppingCart,
    Heart,
    Share2,
    ChevronRight,
    Check,
    Minus,
    Plus,
    ZoomIn,
    Truck,
    ShieldCheck,
    RotateCcw,
    ChevronLeft,
    ChevronRight as ChevronRightIcon,
    Sparkles,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import ProductCard from '@/components/ecommerce/products/ProductCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useCart } from '@/hooks/ecommerce/use-cart';
import { useWishlist } from '@/hooks/ecommerce/use-wishlist';
import MainLayout from '@/layouts/main-layout';
import {
    DEFAULT_MEDIA_FALLBACK,
    handleImageFallback,
    resolveImageUrl,
} from '@/lib/media';
import type { Product } from '@/types/ecommerce/products';
import { ReviewsSection } from './avis/avis-clients';

const formatCurrency = (amount: number, currency = 'CDF') =>
    new Intl.NumberFormat('fr-CD', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
    }).format(amount);

// ─── Types locaux ──────────────────────────────────────
interface Review {
    id: number;
    note: number;
    commentaire: string;
    client: string;
    date: string;
    utile?: number;
}

interface Variant {
    id: number;
    nom: string;
    valeur: string;
    supplement_prix: number;
    stock: number;
    prix_actuel: number;
}

interface ProductShowProps extends Record<string, unknown> {
    product: {
        id: string | number;
        nom: string;
        description: string;
        short_description: string;
        prix_actuel: number;
        prix_ttc: number;
        est_en_promotion?: boolean;
        reduction_pourcentage?: number;
        note_moyenne: number;
        nombre_avis: number;
        stock_disponible: number;
        image_principale?: string;
        images?: {
            medium: string;
            large: string;
            thumb?: string;
            alt?: string;
        }[];
        brand?: { nom: string; slug: string } | null;
        categories?: { nom: string; slug: string }[];
        variantes: Variant[];
        avis: Review[];
        rating_stats?: {
            average: number;
            total: number;
            distribution: Record<number, number>;
        };
        bulk_discounts?: {
            quantity: number;
            discount_percentage: number;
            price: number;
        }[];
    };
    relatedProducts: Product[];
}

// ─── StarRating ────────────────────────────────────────
function StarRating({
    rating,
    size = 'md',
}: {
    rating: number;
    size?: 'sm' | 'md';
}) {
    const iconClass = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4';

    return (
        <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }, (_, i) => (
                <Star
                    key={i}
                    className={`${iconClass} ${
                        i < Math.floor(rating)
                            ? 'fill-amber-400 text-amber-400'
                            : i < rating
                              ? 'fill-amber-400/50 text-amber-400'
                              : 'fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700'
                    }`}
                />
            ))}
        </div>
    );
}

// ─── Galerie ───────────────────────────────────────────
function ProductGallery({
    images,
    imagePrincipale,
    nom,
}: {
    images: { medium: string; large: string; thumb?: string; alt?: string }[];
    imagePrincipale?: string;
    nom: string;
}) {
    const [selected, setSelected] = useState(0);
    const allImages = images?.length
        ? images
        : [
              {
                  medium: imagePrincipale || DEFAULT_MEDIA_FALLBACK,
                  large: imagePrincipale || DEFAULT_MEDIA_FALLBACK,
                  alt: nom,
              },
          ];
    const current = allImages[selected];

    return (
        <div className="space-y-3 max-w-7xl">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
                <img
                    src={resolveImageUrl(current.large)}
                    alt={nom}
                    className="h-full w-full object-cover"
                    onError={handleImageFallback()}
                />
                <Dialog>
                    <DialogTrigger asChild>
                        <button className="absolute top-4 right-4 rounded-full bg-white/80 p-2 shadow backdrop-blur hover:bg-white">
                            <ZoomIn className="h-4 w-4" />
                        </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl border-0 bg-transparent p-0">
                        <img
                            src={resolveImageUrl(current.large)}
                            alt={nom}
                            className="max-h-[90vh] w-full rounded-lg object-contain"
                            onError={handleImageFallback()}
                        />
                    </DialogContent>
                </Dialog>
                {allImages.length > 1 && (
                    <>
                        <button
                            onClick={() =>
                                setSelected((prev) =>
                                    prev === 0
                                        ? allImages.length - 1
                                        : prev - 1,
                                )
                            }
                            className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full bg-black/20 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/40"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() =>
                                setSelected((prev) =>
                                    prev === allImages.length - 1
                                        ? 0
                                        : prev + 1,
                                )
                            }
                            className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full bg-black/20 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/40"
                        >
                            <ChevronRightIcon className="h-5 w-5" />
                        </button>
                    </>
                )}
            </div>
            {allImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {allImages.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelected(idx)}
                            className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 ${
                                idx === selected
                                    ? 'border-emerald-500 shadow-sm'
                                    : 'border-transparent hover:border-slate-300'
                            }`}
                        >
                            <img
                                src={resolveImageUrl(img.thumb || img.medium)}
                                alt=""
                                className="h-full w-full object-cover"
                                onError={handleImageFallback()}
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Composant principal ──────────────────────────────
export default function ProductShow() {
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const { props } = usePage<ProductShowProps>();
    const { product, relatedProducts } = props;

    const [quantity, setQuantity] = useState(1);
    const [activeBulk, setActiveBulk] = useState<number | null>(null);
    const [selectedVariants, setSelectedVariants] = useState<
        Record<string, string>
    >(() => {
        const grouped = product.variantes.reduce(
            (acc, v) => {
                if (!acc[v.nom]) {
                    acc[v.nom] = [];
                }

                acc[v.nom].push(v);

                return acc;
            },
            {} as Record<string, Variant[]>,
        );
        const init: Record<string, string> = {};
        Object.keys(grouped).forEach((key) => {
            init[key] = grouped[key][0]?.valeur || '';
        });

        return init;
    });

    const bulkDiscounts = product.bulk_discounts?.length
        ? product.bulk_discounts
        : [
              {
                  quantity: 1,
                  discount_percentage: 0,
                  price: product.prix_actuel,
              },
              {
                  quantity: 2,
                  discount_percentage: 10,
                  price: product.prix_actuel * 2 * 0.9,
              },
              {
                  quantity: 3,
                  discount_percentage: 20,
                  price: product.prix_actuel * 3 * 0.8,
              },
          ];

    const handleAddToCart = () => {
        const totalQty = activeBulk || quantity;
        const variantId = Object.values(selectedVariants).length
            ? product.variantes.find(
                  (v) => v.valeur === Object.values(selectedVariants)[0],
              )?.id
            : undefined;
        addToCart(product.id, totalQty, variantId);
        toast.success('Ajouté au panier');
    };

    const toggleFav = () => {
        toggleWishlist(product.id);
    };

    return (
        <MainLayout>
            <Head title={product.nom} />
            <div className="mx-auto max-w-7xl px-4 py-8">
                {/* Fil d'Ariane */}
                <nav className="mb-6 flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                    <Link
                        href={route('home')}
                        className="hover:text-slate-700 dark:hover:text-white"
                    >
                        Accueil
                    </Link>
                    <ChevronRight className="h-4 w-4" />
                    <Link
                        href={route('tenant.product.index')}
                        className="hover:text-slate-700 dark:hover:text-white"
                    >
                        Produits
                    </Link>
                    <ChevronRight className="h-4 w-4" />
                    <span className="text-slate-900 dark:text-white">
                        {product.nom}
                    </span>
                </nav>

                <div className="grid gap-10 lg:grid-cols-2">
                    {/* Galerie */}
                    <ProductGallery
                        images={product.images || []}
                        imagePrincipale={product.image_principale}
                        nom={product.nom}
                    />

                    {/* Infos */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl dark:text-white">
                                {product.nom}
                            </h1>
                            {product.brand && (
                                <Link
                                    href={`/brand/${product.brand.slug}`}
                                    className="text-sm text-slate-500 hover:underline dark:text-slate-400"
                                >
                                    par {product.brand.nom}
                                </Link>
                            )}
                            <div className="mt-2 flex items-center gap-2">
                                <StarRating rating={product.note_moyenne} />
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    {product.note_moyenne.toFixed(1)}
                                </span>
                                <span className="text-sm text-slate-400">
                                    ({product.nombre_avis} avis)
                                </span>
                            </div>
                        </div>

                        <p className="text-slate-600 dark:text-slate-300">
                            {product.short_description}
                        </p>

                        <div className="flex items-baseline gap-3">
                            <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                                {formatCurrency(product.prix_actuel)}
                            </span>
                            {product.est_en_promotion && (
                                <span className="text-lg text-slate-400 line-through">
                                    {formatCurrency(product.prix_ttc)}
                                </span>
                            )}
                            {product.reduction_pourcentage &&
                                product.est_en_promotion && (
                                    <Badge className="bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400">
                                        -{product.reduction_pourcentage}%
                                    </Badge>
                                )}
                        </div>

                        {/* Variantes */}
                        {Object.entries(
                            product.variantes.reduce(
                                (acc, v) => {
                                    if (!acc[v.nom]) {
                                        acc[v.nom] = [];
                                    }

                                    acc[v.nom].push(v);

                                    return acc;
                                },
                                {} as Record<string, Variant[]>,
                            ),
                        ).map(([name, variants]) => (
                            <div key={name}>
                                <h3 className="mb-2 text-sm font-semibold text-slate-900 capitalize dark:text-white">
                                    {name}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {variants.map((v) => {
                                        const isSelected =
                                            selectedVariants[name] === v.valeur;
                                        const outOfStock = v.stock === 0;

                                        return (
                                            <button
                                                key={v.id}
                                                onClick={() =>
                                                    !outOfStock &&
                                                    setSelectedVariants(
                                                        (prev) => ({
                                                            ...prev,
                                                            [name]: v.valeur,
                                                        }),
                                                    )
                                                }
                                                disabled={outOfStock}
                                                className={`relative rounded-xl border px-3 py-2 text-sm transition-all ${
                                                    isSelected
                                                        ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500/20 dark:bg-emerald-900/20'
                                                        : 'border-slate-200 hover:border-emerald-300 dark:border-slate-700'
                                                } ${outOfStock ? 'cursor-not-allowed opacity-50' : ''}`}
                                            >
                                                {v.valeur}
                                                {v.supplement_prix > 0 && (
                                                    <span className="ml-1 text-xs text-slate-500">
                                                        +
                                                        {formatCurrency(
                                                            v.supplement_prix,
                                                        )}
                                                    </span>
                                                )}
                                                {outOfStock && (
                                                    <span className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/60 text-xs font-medium text-rose-500 backdrop-blur-sm">
                                                        Épuisé
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}

                        {/* Offres groupées */}
                        <div>
                            <h3 className="mb-2 text-sm font-semibold text-slate-900 dark:text-white">
                                Offres groupées
                            </h3>
                            <div className="grid grid-cols-3 gap-2">
                                {bulkDiscounts.map((opt) => {
                                    const isActive =
                                        activeBulk === opt.quantity;

                                    return (
                                        <button
                                            key={opt.quantity}
                                            onClick={() =>
                                                setActiveBulk(opt.quantity)
                                            }
                                            className={`flex flex-col items-center rounded-xl border p-3 transition-all ${
                                                isActive
                                                    ? 'border-emerald-500 bg-emerald-50 shadow-sm dark:bg-emerald-900/20'
                                                    : 'border-slate-200 hover:border-emerald-300 dark:border-slate-700'
                                            }`}
                                        >
                                            <span className="text-2xl font-bold text-slate-900 dark:text-white">
                                                {opt.quantity}
                                            </span>
                                            <span className="text-xs text-slate-500">
                                                unité(s)
                                            </span>
                                            {opt.discount_percentage > 0 && (
                                                <Badge className="mt-1 bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400">
                                                    -{opt.discount_percentage}%
                                                </Badge>
                                            )}
                                            <span className="mt-1 font-semibold text-slate-800 dark:text-slate-200">
                                                {formatCurrency(opt.price)}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Stock */}
                        <div className="flex items-center gap-2">
                            {product.stock_disponible > 0 ? (
                                <span className="flex items-center gap-1 text-sm font-medium text-emerald-600">
                                    <Check className="h-4 w-4" /> En stock (
                                    {product.stock_disponible} dispo.)
                                </span>
                            ) : (
                                <span className="text-sm font-medium text-rose-500">
                                    Rupture de stock
                                </span>
                            )}
                        </div>

                        {/* Quantité + actions */}
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                        setQuantity(Math.max(1, quantity - 1))
                                    }
                                    disabled={product.stock_disponible === 0}
                                >
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <span className="w-10 text-center text-sm font-medium text-slate-900 dark:text-white">
                                    {quantity}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setQuantity(quantity + 1)}
                                    disabled={product.stock_disponible === 0}
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            <Button
                                className="flex-1 gap-2"
                                size="lg"
                                onClick={handleAddToCart}
                                disabled={product.stock_disponible === 0}
                            >
                                <ShoppingCart className="h-5 w-5" />
                                Ajouter au panier
                            </Button>

                            <Button
                                variant="outline"
                                size="icon"
                                className="h-11 w-11"
                                onClick={toggleFav}
                            >
                                <Heart
                                    className={`h-5 w-5 ${
                                        isInWishlist(product.id)
                                            ? 'fill-rose-500 text-rose-500'
                                            : ''
                                    }`}
                                />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-11 w-11"
                            >
                                <Share2 className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* Livraison / Sécurité */}
                        <div className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm dark:border-slate-700 dark:bg-slate-800/50">
                            <div className="flex items-center gap-2">
                                <Truck className="h-4 w-4 text-emerald-500" />
                                <span className="text-slate-700 dark:text-slate-300">
                                    Livraison gratuite dès 50 000 CDF
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <RotateCcw className="h-4 w-4 text-emerald-500" />
                                <span className="text-slate-700 dark:text-slate-300">
                                    Retour sous 30 jours
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                                <span className="text-slate-700 dark:text-slate-300">
                                    Paiement 100% sécurisé
                                </span>
                            </div>
                        </div>

                        {/* Détails */}
                        <div className="border-t border-slate-200 pt-4 text-xs text-slate-400 dark:border-slate-700">
                            <p>SKU : {product.id}</p>
                            <p>
                                Catégorie :{' '}
                                {product.categories
                                    ?.map((c) => c.nom)
                                    .join(', ')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Onglets Description / Avis */}
                <Tabs defaultValue="description" className="mt-12">
                    <TabsList className="w-full justify-start rounded-none border-b border-slate-200 bg-transparent p-0 dark:border-slate-700">
                        <TabsTrigger
                            value="description"
                            className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-emerald-500 data-[state=active]:text-emerald-600"
                        >
                            Description
                        </TabsTrigger>
                        <TabsTrigger
                            value="reviews"
                            className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-emerald-500 data-[state=active]:text-emerald-600"
                        >
                            Avis ({product.avis.length})
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="description" className="pt-6">
                        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-linear-to-br from-white via-slate-50 to-white p-6 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
                            {/* En-tête décoratif */}
                            <div className="mb-6 flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                                    <Sparkles className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                                        Description du produit
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Tout ce que vous devez savoir sur cet
                                        article
                                    </p>
                                </div>
                            </div>

                            {/* Contenu riche */}
                            <div className="relative">
                                {/* Effet de fondu en bas si le contenu est long (optionnel) */}
                                <div
                                    className="prose max-w-none prose-slate dark:prose-invert prose-headings:font-semibold prose-headings:tracking-tight prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-p:leading-relaxed prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-4 prose-blockquote:border-emerald-500 prose-blockquote:bg-emerald-50/50 prose-blockquote:px-4 prose-blockquote:py-2 prose-blockquote:italic dark:prose-blockquote:bg-emerald-950/20 prose-code:rounded-md prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm dark:prose-code:bg-slate-800 prose-pre:rounded-xl prose-pre:bg-slate-100 prose-pre:p-4 dark:prose-pre:bg-slate-800 prose-img:rounded-xl prose-img:shadow-md"
                                    dangerouslySetInnerHTML={{
                                        __html: product.description,
                                    }}
                                />
                            </div>

                            {/* Pied discret avec SKU / Catégorie (déjà présent en bas, mais on peut le rappeler) */}
                            <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-slate-200 pt-4 text-xs text-slate-400 dark:border-slate-800">
                                <span className="flex items-center gap-1">
                                    <ShoppingCart className="h-3 w-3" />
                                    SKU : {product.id}
                                </span>
                                {product.categories &&
                                    product.categories.length > 0 && (
                                        <span className="flex items-center gap-1">
                                            <ChevronRight className="h-3 w-3" />
                                            {product.categories
                                                .map((c) => c.nom)
                                                .join(', ')}
                                        </span>
                                    )}
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="reviews" className="pt-6">
                        <ReviewsSection
                            productId={product.id}
                            avis={product.avis}
                            ratingStats={product.rating_stats}
                        />
                    </TabsContent>
                </Tabs>

                {/* Produits similaires */}
                {relatedProducts.length > 0 && (
                    <section className="mt-16 border-t border-slate-200 pt-12 dark:border-slate-700">
                        <div className="mb-8 text-center">
                            <span className="inline-flex items-center gap-1 text-sm font-semibold tracking-wider text-emerald-600 uppercase dark:text-emerald-400">
                                <Sparkles className="h-4 w-4" /> Recommandations
                            </span>
                            <h2 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl dark:text-white">
                                Articles similaires
                            </h2>
                            <p className="mt-2 text-slate-500 dark:text-slate-400">
                                Découvrez d'autres produits qui pourraient vous
                                plaire
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
                            {relatedProducts.slice(0, 8).map((product) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                >
                                    <ProductCard product={product} />
                                </motion.div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </MainLayout>
    );
}
