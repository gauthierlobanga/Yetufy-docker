// resources/js/Pages/Shop/Categories/Index.tsx
import { Head, Link, usePage } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowRight,
    Package,
    Sparkles,
    ShoppingBag,
    Grid3X3,
    Tag,
    Store,
    Search,
    X,
    LayoutGrid,
    Grid2X2,
    LayoutDashboard,
} from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import MainLayout from '@/layouts/main-layout';
import { handleImageFallback, resolveImageUrl } from '@/lib/media';
import type { Category } from '@/types/ecommerce/products';

interface PageProps extends Record<string, unknown> {
    categories: Category[];
}

type ViewMode = 'comfortable' | 'compact' | 'bento';

export default function CategoriesIndex() {
    const { props } = usePage<PageProps>();
    const { categories } = props;

    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<string>('name_asc');
    const [viewMode, setViewMode] = useState<ViewMode>('comfortable');
    const [isLoading, setIsLoading] = useState(false); // État de chargement pour les squelettes

    // Filtrage et tri locaux
    const filteredCategories = useMemo(() => {
        let result = [...categories];

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (cat) =>
                    cat.nom.toLowerCase().includes(query) ||
                    (cat.description?.toLowerCase() ?? '').includes(query),
            );
        }

        switch (sortBy) {
            case 'name_asc':
                result.sort((a, b) => a.nom.localeCompare(b.nom));
                break;
            case 'name_desc':
                result.sort((a, b) => b.nom.localeCompare(a.nom));
                break;
            case 'products_desc':
                result.sort(
                    (a, b) => (b.products_count ?? 0) - (a.products_count ?? 0),
                );
                break;
            case 'products_asc':
                result.sort(
                    (a, b) => (a.products_count ?? 0) - (b.products_count ?? 0),
                );
                break;
        }

        return result;
    }, [categories, searchQuery, sortBy]);

    // Déclenchement du squelette lors d'un changement de filtre ou de mode
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsLoading(true);
        const timer = setTimeout(() => setIsLoading(false), 300);

        return () => clearTimeout(timer);
    }, [viewMode, searchQuery, sortBy]);

    const clearSearch = () => setSearchQuery('');

    const gridClass = useMemo(() => {
        switch (viewMode) {
            case 'compact':
                return 'grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6';
            case 'comfortable':
                return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5';
            case 'bento':
                return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 auto-rows-auto';
            default:
                return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5';
        }
    }, [viewMode]);

    // Nombre de squelettes à afficher selon le mode
    const skeletonCount = viewMode === 'compact' ? 6 : 8;

    return (
        <MainLayout>
            <Head title="Toutes les catégories" />

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-linear-to-b from-emerald-50/50 via-white to-white py-14 md:py-20 dark:from-emerald-950/20 dark:via-slate-950 dark:to-slate-950">
                <div className="pointer-events-none absolute -top-20 -right-20 h-96 w-96 rounded-full bg-emerald-100/20 blur-3xl dark:bg-emerald-900/10" />
                <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-slate-100/30 blur-3xl dark:bg-slate-800/10" />

                <div className="relative mx-auto max-w-7xl px-4 text-center">
                    <motion.span
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                    >
                        <Grid3X3 className="h-4 w-4" />
                        {categories.length} catégorie
                        {categories.length > 1 ? 's' : ''} disponible
                        {categories.length > 1 ? 's' : ''}
                    </motion.span>
                    <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-800 md:text-5xl lg:text-6xl dark:text-white">
                        Explorez nos{' '}
                        <span className="bg-linear-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent dark:from-emerald-400 dark:to-emerald-300">
                            univers
                        </span>
                    </h1>
                    <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-500 dark:text-slate-400">
                        Chaque catégorie a été pensée pour vous offrir une
                        expérience unique. Laissez-vous guider.
                    </p>
                </div>
            </section>

            {/* Grille de catégories */}
            <section className="py-16">
                <div className="mx-auto max-w-7xl px-4">
                    {/* Barre d'outils */}
                    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative w-full sm:w-96">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <Input
                                placeholder="Rechercher une catégorie..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="h-10 rounded-xl border-slate-200 bg-white/80 pr-8 pl-9 text-sm backdrop-blur-sm transition-all focus:border-emerald-400 dark:border-slate-700 dark:bg-slate-900/70 dark:focus:border-emerald-500"
                            />
                            {searchQuery && (
                                <button
                                    onClick={clearSearch}
                                    className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                        <div className="flex items-center gap-3">
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="h-10 w-40 rounded-xl border-slate-200 bg-white/80 text-sm backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/70">
                                    <SelectValue placeholder="Trier par" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="name_asc">
                                        Nom A-Z
                                    </SelectItem>
                                    <SelectItem value="name_desc">
                                        Nom Z-A
                                    </SelectItem>
                                    <SelectItem value="products_desc">
                                        Plus de produits
                                    </SelectItem>
                                    <SelectItem value="products_asc">
                                        Moins de produits
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            <div className="flex items-center rounded-xl border border-slate-200 bg-white/80 p-1 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/70">
                                {(
                                    [
                                        'comfortable',
                                        'compact',
                                        'bento',
                                    ] as ViewMode[]
                                ).map((mode) => (
                                    <button
                                        key={mode}
                                        onClick={() => setViewMode(mode)}
                                        className={`rounded-lg p-1.5 transition-all ${
                                            viewMode === mode
                                                ? 'bg-emerald-100 text-emerald-700 shadow-sm dark:bg-emerald-900/40 dark:text-emerald-400'
                                                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                                        }`}
                                        title={
                                            mode === 'bento'
                                                ? 'Bento'
                                                : mode === 'compact'
                                                  ? 'Compact'
                                                  : 'Confortable'
                                        }
                                    >
                                        {mode === 'comfortable' && (
                                            <LayoutGrid className="h-4 w-4" />
                                        )}
                                        {mode === 'compact' && (
                                            <Grid2X2 className="h-4 w-4" />
                                        )}
                                        {mode === 'bento' && (
                                            <LayoutDashboard className="h-4 w-4" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Message de résultat */}
                    {searchQuery && (
                        <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
                            {filteredCategories.length} catégorie
                            {filteredCategories.length > 1 ? 's' : ''} trouvée
                            {filteredCategories.length > 1 ? 's' : ''} pour «{' '}
                            {searchQuery} »
                        </p>
                    )}

                    {/* Contenu : chargement, grille ou état vide */}
                    {filteredCategories.length > 0 ? (
                        isLoading ? (
                            <div className={`grid gap-4 ${gridClass}`}>
                                {Array.from({ length: skeletonCount }).map(
                                    (_, i) => (
                                        <div
                                            key={i}
                                            className={
                                                viewMode === 'compact'
                                                    ? 'flex items-center gap-3'
                                                    : ''
                                            }
                                        >
                                            <Skeleton
                                                className={`${viewMode === 'compact' ? 'h-10 w-10 rounded-lg' : 'aspect-square w-full rounded-2xl'}`}
                                            />
                                            <div className="flex-1 space-y-2">
                                                <Skeleton className="h-4 w-2/3" />
                                                {viewMode !== 'compact' && (
                                                    <Skeleton className="h-3 w-1/2" />
                                                )}
                                            </div>
                                        </div>
                                    ),
                                )}
                            </div>
                        ) : (
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={viewMode}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className={`grid gap-4 ${gridClass}`}
                                >
                                    {filteredCategories.map(
                                        (category, index) => (
                                            <motion.div
                                                key={category.id}
                                                layout
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                transition={{
                                                    delay: index * 0.02,
                                                    duration: 0.25,
                                                }}
                                                className={`${
                                                    viewMode === 'bento'
                                                        ? index === 0
                                                            ? 'sm:col-span-2' // première carte large mais hauteur normale
                                                            : index === 3
                                                              ? 'sm:col-span-2'
                                                              : ''
                                                        : ''
                                                } overflow-hidden`}
                                            >
                                                <CategoryCard
                                                    category={category}
                                                    viewMode={viewMode}
                                                />
                                            </motion.div>
                                        ),
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        )
                    ) : (
                        <EmptyState
                            searchQuery={searchQuery}
                            onClear={clearSearch}
                        />
                    )}
                </div>
            </section>

            {/* Section avantages */}
            <section className="border-t border-slate-200 bg-slate-50/70 py-16 dark:border-slate-800 dark:bg-slate-900/50">
                <div className="mx-auto max-w-7xl px-4 text-center">
                    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                        <Sparkles className="h-4 w-4" /> Pourquoi nos catégories
                    </span>
                    <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-800 dark:text-white">
                        Une navigation pensée pour vous
                    </h2>
                    <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
                        {[
                            {
                                icon: Grid3X3,
                                title: 'Catégories organisées',
                                desc: 'Trouvez facilement ce que vous cherchez grâce à notre arborescence claire.',
                            },
                            {
                                icon: ShoppingBag,
                                title: 'Produits exclusifs',
                                desc: 'Chaque catégorie propose une sélection unique de produits artisanaux.',
                            },
                            {
                                icon: Sparkles,
                                title: 'Nouveautés permanentes',
                                desc: 'De nouvelles catégories et produits ajoutés régulièrement.',
                            },
                        ].map(({ icon: Icon, title, desc }) => (
                            <div
                                key={title}
                                className="flex flex-col items-center gap-3"
                            >
                                <div className="rounded-full bg-emerald-100 p-4 text-emerald-600 shadow-sm dark:bg-emerald-900/30 dark:text-emerald-400">
                                    <Icon className="h-8 w-8" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                                    {title}
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    {desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}

// -------- Composant de carte catégorie (sans modification majeure) --------
function CategoryCard({
    category,
    viewMode,
}: {
    category: Category;
    viewMode: ViewMode;
}) {
    const productsCount = category.products_count ?? 0;

    if (viewMode === 'compact') {
        return (
            <Link
                href={category.url}
                className="group relative flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition-all hover:border-emerald-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/80 dark:hover:border-emerald-700"
            >
                <img
                    src={resolveImageUrl(category.image)}
                    alt={category.nom}
                    className="h-10 w-10 rounded-lg object-cover"
                    loading="lazy"
                    onError={handleImageFallback()}
                />
                <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-semibold text-slate-800 dark:text-white">
                        {category.nom}
                    </h3>
                    <p className="text-xs text-slate-500">
                        {productsCount} produit{productsCount > 1 ? 's' : ''}
                    </p>
                </div>
            </Link>
        );
    }

    return (
        <Link
            href={category.url}
            className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:border-emerald-200 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/80 dark:hover:border-emerald-700"
        >
            <div className="relative aspect-square overflow-hidden">
                <img
                    src={resolveImageUrl(category.image)}
                    alt={category.nom}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    onError={handleImageFallback()}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-slate-800 backdrop-blur-sm dark:bg-slate-900/90 dark:text-white">
                    {productsCount} produit{productsCount > 1 ? 's' : ''}
                </div>
            </div>
            <div className="p-4">
                <h3 className="text-sm font-semibold text-slate-800 transition-colors group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-400">
                    {category.nom}
                </h3>
                {category.description && (
                    <p className="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
                        {category.description}
                    </p>
                )}
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-emerald-500/10 opacity-0 backdrop-blur-[1px] transition-opacity duration-300 group-hover:opacity-100">
                <span className="flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-emerald-700 shadow-sm dark:bg-slate-900 dark:text-emerald-400">
                    <Tag className="h-4 w-4" /> Explorer
                </span>
            </div>
        </Link>
    );
}

// -------- État vide --------
function EmptyState({
    searchQuery,
    onClear,
}: {
    searchQuery: string;
    onClear: () => void;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex min-h-75 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center dark:border-slate-800 dark:bg-slate-900/30"
        >
            {searchQuery ? (
                <>
                    <div className="mb-4 rounded-full bg-amber-100 p-4 dark:bg-amber-900/30">
                        <Search className="h-10 w-10 text-amber-600 dark:text-amber-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
                        Aucune catégorie trouvée
                    </h2>
                    <p className="mt-2 max-w-md text-slate-500 dark:text-slate-400">
                        Nous n’avons pas trouvé de catégorie correspondant à «{' '}
                        {searchQuery} ».
                    </p>
                    <Button
                        onClick={onClear}
                        variant="outline"
                        className="mt-4 gap-2"
                    >
                        <X className="h-4 w-4" /> Effacer la recherche
                    </Button>
                </>
            ) : (
                <>
                    <div className="mb-4 rounded-full bg-emerald-100 p-4 dark:bg-emerald-900/30">
                        <Store className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
                        Aucune catégorie pour le moment
                    </h2>
                    <p className="mt-2 max-w-md text-slate-500 dark:text-slate-400">
                        Notre collection de catégories est en cours de
                        préparation. Revenez bientôt !
                    </p>
                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                        <Link
                            href={route('tenant.product.index')}
                            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                        >
                            <Sparkles className="h-4 w-4" /> Voir tous les
                            produits
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                        <Link
                            href={route('home')}
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
                        >
                            <Package className="h-4 w-4" /> Retour à l'accueil
                        </Link>
                    </div>
                </>
            )}
        </motion.div>
    );
}
