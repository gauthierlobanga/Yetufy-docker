// resources/js/Pages/Shop/Categories/Show.tsx
import { Head, Link, router } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronRight,
    ArrowUpDown,
    Search,
    SlidersHorizontal,
    Star,
    Package,
    TrendingUp,
    Grid3X3,
    List,
    LayoutDashboard,
    X,
} from 'lucide-react';
import { useState, useMemo, useCallback } from 'react';
import ProductCard from '@/components/ecommerce/products/ProductCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import MainLayout from '@/layouts/main-layout';
import { handleImageFallback, resolveImageUrl } from '@/lib/media';
import type { Category, Product } from '@/types/ecommerce/products';

interface Props {
    category: Category & {
        description?: string;
        products_count?: number;
        banner?: string;
    };
    products: {
        data: Product[];
        current_page: number;
        last_page: number;
        total?: number;
    };
    subcategories: Category[];
    breadcrumb: Array<{ name: string; url: string }>;
    filters?: { sort?: string; search?: string };
}

type ViewMode = 'grid' | 'list' | 'bento';

export default function CategoryShow({
    category,
    products,
    subcategories,
    breadcrumb,
    filters = {},
}: Props) {
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
    const [minRating, setMinRating] = useState(0);
    const [inStockOnly, setInStockOnly] = useState(false);

    // Filtrage local (pour une UI réactive, en complément du serveur)
    const filteredProducts = useMemo(() => {
        let result = products.data;

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(
                (p) =>
                    p.nom.toLowerCase().includes(q) ||
                    (p.description && p.description.toLowerCase().includes(q)),
            );
        }

        if (inStockOnly) {
            result = result.filter((p) => (p.quantite_stock ?? 0) > 0);
        }

        if (minRating > 0) {
            result = result.filter((p) => (p.note_moyenne ?? 0) >= minRating);
        }

        // Filtre de prix local (si les champs sont disponibles)
        result = result.filter((p) => {
            const price = p.prix_actuel ?? p.prix_ttc ?? 0;

            return price >= priceRange[0] && price <= priceRange[1];
        });

        return result;
    }, [products.data, searchQuery, inStockOnly, minRating, priceRange]);

    const updateSort = useCallback(
        (value: string) => {
            router.get(
                window.location.pathname,
                { sort: value, search: searchQuery || undefined },
                {
                    preserveState: true,
                    preserveScroll: true,
                    only: ['products'],
                },
            );
        },
        [searchQuery],
    );

    const applySearch = useCallback(() => {
        router.get(
            window.location.pathname,
            { search: searchQuery || undefined, sort: filters.sort },
            {
                preserveState: true,
                preserveScroll: true,
                only: ['products'],
            },
        );
    }, [searchQuery, filters.sort]);

    const clearSearch = () => {
        setSearchQuery('');
        router.get(
            window.location.pathname,
            { sort: filters.sort },
            { preserveState: true, preserveScroll: true, only: ['products'] },
        );
    };

    const totalProducts = products.total ?? products.data.length;
    const totalPages = products.last_page;
    const currentPage = products.current_page;

    const pagesToShow = useMemo(() => {
        const pages: (number | string)[] = [];

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);

            if (currentPage > 3) {
                pages.push('...');
            }

            for (
                let i = Math.max(2, currentPage - 1);
                i <= Math.min(totalPages - 1, currentPage + 1);
                i++
            ) {
                pages.push(i);
            }

            if (currentPage < totalPages - 2) {
                pages.push('...');
            }

            pages.push(totalPages);
        }

        return pages;
    }, [totalPages, currentPage]);

    const goToPage = (page: number) => {
        router.get(
            window.location.pathname,
            { page, sort: filters.sort, search: searchQuery || undefined },
            { preserveState: true, preserveScroll: true },
        );
    };

    // Grille responsive selon le mode
    const gridClass = {
        grid: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
        list: 'grid-cols-1',
        bento: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
    }[viewMode];

    return (
        <MainLayout>
            <Head title={category.nom} />

            <div className="mx-auto max-w-7xl px-4 py-8">
                {/* Fil d’Ariane */}
                <nav className="mb-6 flex flex-wrap items-center text-sm text-slate-500 dark:text-slate-400">
                    <Link
                        href="/"
                        className="hover:text-slate-700 dark:hover:text-white"
                    >
                        Accueil
                    </Link>
                    {breadcrumb.map((item, idx) => (
                        <span key={idx} className="flex items-center">
                            <ChevronRight className="mx-1 h-4 w-4" />
                            {idx === breadcrumb.length - 1 ? (
                                <span className="font-medium text-slate-900 dark:text-white">
                                    {item.name}
                                </span>
                            ) : (
                                <Link
                                    href={item.url}
                                    className="hover:text-slate-700 dark:hover:text-white"
                                >
                                    {item.name}
                                </Link>
                            )}
                        </span>
                    ))}
                </nav>

                {/* En‑tête catégorie */}
                <div className="mb-12 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80">
                    <div className="relative p-6 md:p-8">
                        {/* Fond décoratif */}
                        <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl dark:bg-emerald-400/5" />
                        <div className="relative flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                                    {category.nom}
                                </h1>
                                {category.description && (
                                    <p className="mt-2 max-w-2xl text-slate-500 dark:text-slate-400">
                                        {category.description}
                                    </p>
                                )}
                            </div>
                            <Badge
                                variant="secondary"
                                className="px-4 py-1.5 text-sm"
                            >
                                <Package className="mr-1 h-4 w-4" />
                                {totalProducts} produit
                                {totalProducts > 1 ? 's' : ''}
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Sous‑catégories */}
                {subcategories.length > 0 && (
                    <div className="mb-10">
                        <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
                            Explorer les sous‑catégories
                        </h2>
                        <div className="flex flex-wrap gap-3">
                            {subcategories.map((sub) => (
                                <Link
                                    key={sub.id}
                                    href={sub.url}
                                    className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-emerald-700 dark:hover:bg-emerald-900/20"
                                >
                                    <div className="h-8 w-8 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                                        {sub.image && (
                                            <img
                                                src={resolveImageUrl(sub.image)}
                                                alt={sub.nom}
                                                className="h-full w-full object-cover"
                                                onError={handleImageFallback()}
                                            />
                                        )}
                                    </div>
                                    <span>{sub.nom}</span>
                                    <ChevronRight className="h-4 w-4 text-slate-400" />
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Barre d’outils collante */}
                <div className="sticky top-16 z-20 mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-slate-200/80 bg-white/80 p-3 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80">
                    <div className="relative flex-1 sm:max-w-md">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                            placeholder="Rechercher dans cette catégorie..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) =>
                                e.key === 'Enter' && applySearch()
                            }
                            className="h-10 rounded-lg border-slate-200 bg-slate-50 pr-8 pl-9 dark:border-slate-700 dark:bg-slate-800/50"
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

                    <Select
                        value={filters.sort || 'newest'}
                        onValueChange={updateSort}
                    >
                        <SelectTrigger className="w-40 rounded-lg border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50">
                            <ArrowUpDown className="mr-2 h-4 w-4" />
                            <SelectValue placeholder="Trier" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Nouveautés</SelectItem>
                            <SelectItem value="popular">Popularité</SelectItem>
                            <SelectItem value="price_asc">
                                Prix croissant
                            </SelectItem>
                            <SelectItem value="price_desc">
                                Prix décroissant
                            </SelectItem>
                            <SelectItem value="rating">
                                Meilleure note
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    <div className="hidden rounded-lg border border-slate-200 bg-slate-50 p-1 md:flex dark:border-slate-700 dark:bg-slate-800/50">
                        {(['grid', 'list', 'bento'] as ViewMode[]).map(
                            (mode) => (
                                <Button
                                    key={mode}
                                    variant={
                                        viewMode === mode ? 'default' : 'ghost'
                                    }
                                    size="icon"
                                    className="h-8 w-8 rounded-md"
                                    onClick={() => setViewMode(mode)}
                                    title={
                                        mode === 'grid'
                                            ? 'Grille'
                                            : mode === 'list'
                                              ? 'Liste'
                                              : 'Bento'
                                    }
                                >
                                    {mode === 'grid' && (
                                        <Grid3X3 className="h-4 w-4" />
                                    )}
                                    {mode === 'list' && (
                                        <List className="h-4 w-4" />
                                    )}
                                    {mode === 'bento' && (
                                        <LayoutDashboard className="h-4 w-4" />
                                    )}
                                </Button>
                            ),
                        )}
                    </div>

                    {/* Filtres mobiles */}
                    <Sheet
                        open={mobileFiltersOpen}
                        onOpenChange={setMobileFiltersOpen}
                    >
                        <SheetTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-2 rounded-lg"
                            >
                                <SlidersHorizontal className="h-4 w-4" />{' '}
                                Filtres
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-80 sm:w-96">
                            <SheetHeader>
                                <SheetTitle>Filtres</SheetTitle>
                            </SheetHeader>
                            <div className="space-y-6 py-6">
                                <div>
                                    <Label className="text-sm font-medium">
                                        Prix (CDF)
                                    </Label>
                                    <div className="mt-2 flex items-center gap-2">
                                        <span className="text-xs">
                                            {priceRange[0]}
                                        </span>
                                        <Slider
                                            min={0}
                                            max={5000}
                                            step={10}
                                            value={priceRange}
                                            onValueChange={(v) =>
                                                setPriceRange([v[0], v[1]])
                                            }
                                            className="flex-1"
                                        />
                                        <span className="text-xs">
                                            {priceRange[1]}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium">
                                        Note minimum
                                    </Label>
                                    <div className="mt-2 flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                onClick={() =>
                                                    setMinRating(
                                                        star === minRating
                                                            ? 0
                                                            : star,
                                                    )
                                                }
                                                className={`rounded-full p-1 transition ${star <= minRating ? 'text-amber-400' : 'text-slate-300'}`}
                                            >
                                                <Star className="h-6 w-6 fill-current" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="inStock"
                                        checked={inStockOnly}
                                        onCheckedChange={(c) =>
                                            setInStockOnly(!!c)
                                        }
                                    />
                                    <Label htmlFor="inStock">
                                        En stock uniquement
                                    </Label>
                                </div>
                                <Button
                                    className="w-full rounded-lg"
                                    onClick={() => setMobileFiltersOpen(false)}
                                >
                                    Appliquer
                                </Button>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

                {/* Résultats */}
                <div className="min-h-100">
                    {filteredProducts.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center justify-center py-20 text-center"
                        >
                            <Package className="mx-auto h-16 w-16 text-slate-300 dark:text-slate-600" />
                            <h3 className="mt-4 text-xl font-semibold text-slate-800 dark:text-white">
                                Aucun produit trouvé
                            </h3>
                            <p className="mt-2 max-w-md text-slate-500 dark:text-slate-400">
                                Essayez d'ajuster vos filtres ou votre
                                recherche.
                            </p>
                            <div className="mt-6 flex gap-3">
                                <Button asChild className="rounded-lg">
                                    <Link href={route('tenant.product.index')}>
                                        Voir tous les produits{' '}
                                        <ChevronRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                                <Button
                                    variant="outline"
                                    asChild
                                    className="rounded-lg"
                                >
                                    <Link
                                        href={route(
                                            'tenant.product.category.index',
                                        )}
                                    >
                                        Explorer les catégories
                                    </Link>
                                </Button>
                            </div>
                        </motion.div>
                    ) : (
                        <>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={viewMode}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.15 }}
                                    className={`grid gap-4 ${gridClass}`}
                                >
                                    {filteredProducts.map((product, index) => (
                                        <motion.div
                                            key={product.id}
                                            layout
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -15 }}
                                            transition={{
                                                delay: index * 0.02,
                                                duration: 0.2,
                                            }}
                                            className={
                                                viewMode === 'bento'
                                                    ? index === 0
                                                        ? 'sm:col-span-2 sm:row-span-2'
                                                        : index === 3
                                                          ? 'sm:col-span-2'
                                                          : ''
                                                    : ''
                                            }
                                        >
                                            <ProductCard
                                                product={product}
                                                viewMode={
                                                    viewMode === 'list'
                                                        ? 'list'
                                                        : 'grid'
                                                }
                                            />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </AnimatePresence>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="mt-10 flex justify-center">
                                    <nav
                                        className="flex items-center gap-1"
                                        aria-label="Pagination"
                                    >
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() =>
                                                goToPage(currentPage - 1)
                                            }
                                            disabled={currentPage === 1}
                                            className="h-10 w-10 rounded-lg"
                                        >
                                            <ChevronRight className="h-5 w-5 rotate-180" />
                                        </Button>
                                        {pagesToShow.map((page, idx) =>
                                            page === '...' ? (
                                                <span
                                                    key={`dots-${idx}`}
                                                    className="px-2 text-slate-400"
                                                >
                                                    ...
                                                </span>
                                            ) : (
                                                <Button
                                                    key={page}
                                                    variant={
                                                        page === currentPage
                                                            ? 'default'
                                                            : 'outline'
                                                    }
                                                    size="icon"
                                                    onClick={() =>
                                                        goToPage(page as number)
                                                    }
                                                    className="h-10 w-10 rounded-lg"
                                                >
                                                    {page}
                                                </Button>
                                            ),
                                        )}
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() =>
                                                goToPage(currentPage + 1)
                                            }
                                            disabled={
                                                currentPage === totalPages
                                            }
                                            className="h-10 w-10 rounded-lg"
                                        >
                                            <ChevronRight className="h-5 w-5" />
                                        </Button>
                                    </nav>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Section "À ne pas manquer" */}
                {products.data.length > 0 && (
                    <div className="mt-16 border-t border-slate-200 pt-10 dark:border-slate-800">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                                    <TrendingUp className="h-4 w-4" />
                                    Populaires dans {category.nom}
                                </span>
                                <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                                    À ne pas manquer
                                </h2>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                            {products.data.slice(0, 4).map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
