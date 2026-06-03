/* eslint-disable react-hooks/set-state-in-effect */
// resources/js/components/navigation/ProductsMegaMenu.tsx
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    ChevronRight,
    Globe,
    Palette,
    Settings,
    ShoppingBag,
    ShoppingCart,
    Smartphone,
    Sparkles,
    Store,
    Zap,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import type { Product } from '@/types/ecommerce/products';

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

interface Category {
    [x: string]: any;
    id: number;
    nom: string;
    slug: string;
    description: string;
    produits: Product[];
    sous_categories?: string[];
    icone?: string;
}

interface Props {
    categories: Category[];
}

/* -------------------------------------------------------------------------- */
/*                               Icon Mapping                                 */
/* -------------------------------------------------------------------------- */

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    boutique: Store,
    panier: ShoppingCart,
    mobile: Smartphone,
    globe: Globe,
    palette: Palette,
    parametres: Settings,
};

/* -------------------------------------------------------------------------- */
/*                                  Helpers                                   */
/* -------------------------------------------------------------------------- */

const formatPrice = (price: number) =>
    new Intl.NumberFormat('fr-CD', {
        style: 'currency',
        currency: 'CDF',
        maximumFractionDigits: 0,
    }).format(price);

const getCategoryIcon = (category: Category) =>
    iconMap[category.icone ?? ''] ?? Store;

/* -------------------------------------------------------------------------- */
/*                              Empty Categories                              */
/* -------------------------------------------------------------------------- */

function EmptyCategories() {
    return (
        <div className="flex min-h-50 flex-col items-center justify-center px-6 py-12 text-center">
            <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-emerald-200/70 bg-linear-to-br from-emerald-500/15 to-slate-100 shadow-xl shadow-emerald-500/10 dark:border-emerald-800/50 dark:from-emerald-400/10 dark:to-slate-800">
                <Store className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Aucune catégorie disponible
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                Les catégories seront bientôt disponibles. Revenez prochainement
                pour découvrir nos nouveautés.
            </p>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*                               Empty Products                               */
/* -------------------------------------------------------------------------- */

function EmptyProducts({ categoryName }: { categoryName: string }) {
    return (
        <div className="flex min-h-50 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50/80 p-8 text-center dark:border-slate-700 dark:bg-slate-800/30">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 ring-1 ring-amber-500/20">
                <ShoppingBag className="h-8 w-8 text-amber-500" />
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                Aucun produit disponible
            </h3>
            <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                La catégorie{' '}
                <span className="font-medium">« {categoryName} »</span> sera
                bientôt enrichie avec de nouveaux produits.
            </p>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*                             Main Mega Menu                                 */
/* -------------------------------------------------------------------------- */

export function ProductsMegaMenu({ categories = [] }: Props) {
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(
        categories[0] ?? null,
    );
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Synchronise si les catégories changent
    useEffect(() => {
        if (categories.length > 0 && !selectedCategory) {
            setSelectedCategory(categories[0]);
        }
    }, [categories, selectedCategory]);

    const selectedCat = useMemo(
        () => selectedCategory ?? categories[0] ?? null,
        [selectedCategory, categories],
    );

    const handleCategoryChange = (category: Category) => {
        if (isTransitioning || selectedCat?.id === category.id) {
            return;
        }

        setIsTransitioning(true);
        setTimeout(() => {
            setSelectedCategory(category);
            setIsTransitioning(false);
        }, 100);
    };

    if (!categories.length) {
        return <EmptyCategories />;
    }

    if (!selectedCat) {
        return null;
    }

    const hasProducts = selectedCat.produits?.length > 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative w-full overflow-hidden border-x border-b border-slate-200/70 bg-white/95 shadow-[0_30px_80px_-20px_rgba(15,23,42,0.18)] backdrop-blur-2xl dark:border-slate-700/60 dark:bg-slate-900/95 dark:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.65)]"
        >
            {/* Glow décoratif */}
            <div className="pointer-events-none absolute -top-24 left-10 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="pointer-events-none absolute top-1/2 right-0 h-72 w-72 -translate-y-1/2 rounded-full bg-slate-400/10 blur-3xl dark:bg-emerald-400/5" />

            {/* Liseré supérieur */}
            <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-emerald-400/60 to-transparent" />

            <div className="grid w-full grid-cols-12">
                {/* Sidebar catégories */}
                <aside className="col-span-4 border-r border-slate-200/70 bg-slate-50/70 p-6 dark:border-slate-700/60 dark:bg-slate-900/40">
                    <div className="mb-5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10">
                                <Sparkles className="h-4 w-4 text-emerald-500" />
                            </div>
                            <span className="text-xs font-semibold tracking-widest text-slate-500 uppercase dark:text-slate-400">
                                Catégories
                            </span>
                        </div>
                        <span className="rounded-full bg-slate-200/70 px-2.5 py-1 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            {categories.length}
                        </span>
                    </div>

                    <div className="max-h-96 space-y-2 overflow-y-auto pr-1">
                        {categories.map((category) => {
                            const Icon = getCategoryIcon(category);
                            const isSelected = selectedCat.id === category.id;

                            return (
                                <button
                                    key={category.id}
                                    type="button"
                                    disabled={isTransitioning}
                                    onClick={() =>
                                        handleCategoryChange(category)
                                    }
                                    className={cn(
                                        'group relative flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-all duration-300',
                                        isSelected
                                            ? 'border-emerald-200 bg-white shadow-lg shadow-emerald-500/10 dark:border-emerald-800/50 dark:bg-slate-800'
                                            : 'border-transparent hover:border-slate-200 hover:bg-white/80 dark:hover:border-slate-700 dark:hover:bg-slate-800/60',
                                    )}
                                >
                                    {isSelected && (
                                        <div className="absolute inset-y-3 left-0 w-1 rounded-r-full bg-emerald-500" />
                                    )}
                                    <div
                                        className={cn(
                                            'flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl transition-all',
                                            isSelected
                                                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                                                : 'bg-slate-100 text-slate-600 group-hover:bg-emerald-50 group-hover:text-emerald-600 dark:bg-slate-800 dark:text-slate-400 dark:group-hover:bg-emerald-500/10 dark:group-hover:text-emerald-400',
                                        )}
                                    >
                                        {category.image ? (
                                            <img
                                                src={category.image}
                                                alt={category.nom}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <Icon className="h-5 w-5" />
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                                            {category.nom}
                                        </p>
                                        <p className="mt-0.5 line-clamp-1 text-xs text-slate-500 dark:text-slate-400">
                                            {category.description}
                                        </p>
                                    </div>
                                    <ChevronRight
                                        className={cn(
                                            'h-4 w-4 shrink-0 transition-all',
                                            isSelected
                                                ? 'translate-x-0 text-emerald-500 opacity-100'
                                                : 'translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100',
                                        )}
                                    />
                                </button>
                            );
                        })}
                    </div>
                </aside>

                {/* Panel produits */}
                <section className="col-span-8 p-6">
                    <div className="mb-6 flex items-start justify-between gap-4">
                        <div>
                            <p className="text-xs font-semibold tracking-widest text-slate-500 uppercase dark:text-slate-400">
                                Produits
                            </p>
                            <h3 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                {selectedCat.nom}
                            </h3>
                            <p className="mt-1 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
                                {selectedCat.description}
                            </p>
                        </div>
                        <Link
                            href={`/category/${selectedCat.slug}`}
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-all hover:border-emerald-200 hover:text-emerald-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-emerald-800 dark:hover:text-emerald-400"
                        >
                            Voir tout
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>

                    {/* Sous-catégories – correction TS */}
                    {(selectedCat.sous_categories?.length ?? 0) > 0 && (
                        <div className="mb-4 flex flex-wrap gap-2">
                            {selectedCat.sous_categories!.map((sub) => (
                                <Link
                                    key={sub}
                                    href={`/category/${selectedCat.slug}/${sub.toLowerCase()}`}
                                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 transition-all hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:border-emerald-800 dark:hover:bg-emerald-500/10 dark:hover:text-emerald-400"
                                >
                                    {sub}
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Produits */}
                    {hasProducts ? (
                        <div className="grid max-h-128 grid-cols-2 gap-3 overflow-y-auto pr-1 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
                            {selectedCat.produits
                                .slice(0, 12)
                                .map((product) => (
                                    <Link
                                        key={product.id}
                                        href={`/product/${product.slug}`}
                                        className="group flex flex-col overflow-hidden rounded-xl border border-slate-200/70 bg-white shadow-sm transition-all duration-200 hover:border-emerald-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-800/70 dark:hover:border-emerald-800"
                                    >
                                        <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
                                            <img
                                                src={
                                                    product.image_principale ||
                                                    '/storage/images/Vue-Storefront.png'
                                                }
                                                alt={product.nom}
                                                loading="lazy"
                                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        </div>
                                        <div className="flex flex-1 flex-col justify-between p-2.5">
                                            <h4 className="line-clamp-2 text-xs leading-tight font-medium text-slate-800 dark:text-slate-200">
                                                {product.nom}
                                            </h4>
                                        </div>
                                    </Link>
                                ))}
                        </div>
                    ) : (
                        <EmptyProducts categoryName={selectedCat.nom} />
                    )}

                    {/* CTA */}
                    <div className="mt-3 rounded-3xl border border-emerald-200/60 bg-linear-to-r from-emerald-50 to-slate-50 p-5 dark:border-emerald-800/40 dark:from-emerald-950/30 dark:to-slate-900">
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
                                <Zap className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                    Explorez nos meilleures collections de
                                    produits
                                </p>

                                <Link
                                    href={route('tenant.product.index')}
                                    className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 transition-colors hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                                >
                                    Voir tout
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </motion.div>
    );
}
