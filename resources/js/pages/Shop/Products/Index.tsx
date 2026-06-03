// resources/js/Pages/Products/Index.tsx
import { Head, usePage, router, Link } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Search,
    LayoutGrid,
    SlidersHorizontal,
    ChevronRight,
    Camera,
    Loader2,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import FiltersPanel from '@/components/ecommerce/products/FiltersPanel';
import ProductCard from '@/components/ecommerce/products/ProductCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
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
import { Skeleton } from '@/components/ui/skeleton';
import MainLayout from '@/layouts/main-layout';
import type { Product, Category } from '@/types/ecommerce/products';

interface LocalFilters {
    category?: string;
    brand?: string;
    min_price?: string;
    max_price?: string;
    search?: string;
    sort?: string;
    page?: string;
}

interface BrandSimple {
    id: number;
    name: string;
}

// On étend Record<string, unknown> pour satisfaire la contrainte d'index de PageProps
interface Props extends Record<string, unknown> {
    products: {
        data: Product[];
        current_page: number;
        last_page: number;
        total?: number;
    };
    categories: Category[];
    brands: BrandSimple[];
    filters: LocalFilters;
    priceRange: { min: number; max: number };
    searchContext?: {
        query: string;
        mode: 'text' | 'image';
        semantic: boolean;
    };
}

export default function ProductsIndex() {
    const { props } = usePage<Props>();
    const {
        products,
        categories,
        brands,
        filters: initialFilters,
        priceRange: serverPriceRange,
        searchContext,
    } = props;

    const [priceRange, setPriceRange] = useState<[number, number]>([
        Number(initialFilters.min_price) || serverPriceRange.min,
        Number(initialFilters.max_price) || serverPriceRange.max,
    ]);
    const [localFilters, setLocalFilters] =
        useState<LocalFilters>(initialFilters);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [viewDensity, setViewDensity] = useState<'comfortable' | 'compact'>(
        'comfortable',
    );
    const [searchInput, setSearchInput] = useState(initialFilters.search || '');
    const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isSearchingByImage, setIsSearchingByImage] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        console.log('Produits reçus :', products.data);
    }, [products]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLocalFilters(initialFilters);
        setSearchInput(initialFilters.search || '');
        setPriceRange([
            Number(initialFilters.min_price) || serverPriceRange.min,
            Number(initialFilters.max_price) || serverPriceRange.max,
        ]);
    }, [initialFilters, serverPriceRange]);

    const applyFilters = (newFilters: Partial<LocalFilters>) => {
        const updated = { ...localFilters, ...newFilters };
        setLocalFilters(updated);

        const query: Record<string, string | undefined> = { ...updated };
        Object.keys(query).forEach((key) => {
            if (query[key] === undefined) {
                delete query[key];
            }
        });

        setIsLoading(true);
        router.get(route('tenant.product.index'), query, {
            preserveState: true,
            preserveScroll: true,
            only: ['products'],
            onFinish: () => setIsLoading(false),
        });
    };

    const clearAllFilters = () => {
        setLocalFilters({});
        setSearchInput('');
        setPriceRange([serverPriceRange.min, serverPriceRange.max]);
        setIsLoading(true);
        router.get(
            route('tenant.product.index'),
            {},
            {
                preserveState: true,
                preserveScroll: true,
                only: ['products'],
                onFinish: () => setIsLoading(false),
            },
        );
    };

    const applyPriceFilter = () => {
        applyFilters({
            min_price: String(priceRange[0]),
            max_price: String(priceRange[1]),
        });
    };

    const handleSearchChange = (value: string) => {
        setSearchInput(value);

        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }

        searchTimeout.current = setTimeout(() => {
            applyFilters({ search: value || undefined });
        }, 500);
    };

    const removeFilter = (key: keyof LocalFilters) => {
        applyFilters({ [key]: undefined });
    };

    const activeFiltersArray = Object.entries(localFilters)
        .filter(
            ([key, value]) =>
                key !== 'sort' &&
                key !== 'page' &&
                value !== undefined &&
                value !== '',
        )
        .map(([key, value]) => ({ key, value: value as string }));

    const totalProducts = products.total ?? products.data.length;

    const handleImageSearch = () => fileInputRef.current?.click();

    const handleImageUpload = async (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        setIsSearchingByImage(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch(
                route('tenant.product.search.by-image'),
                {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRF-TOKEN': (
                            document.querySelector(
                                'meta[name="csrf-token"]',
                            ) as HTMLMetaElement
                        )?.content,
                    },
                },
            );

            if (response.redirected) {
                window.location.href = response.url;
            } else {
                const data = await response.json();

                if (data.redirect_url) {
                    window.location.href = data.redirect_url;
                } else if (data.error) {
                    toast.error(data.error);
                }
            }
        } catch {
            toast.error('Erreur lors de la recherche par image');
        } finally {
            setIsSearchingByImage(false);

            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    return (
        <MainLayout>
            <Head title="Tous les produits" />

            <div className="mx-auto max-w-7xl px-4 py-8">
                {/* En-tête */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h1 className="text-2xl font-bold text-slate-900 md:text-3xl dark:text-white">
                            Tous les produits
                            <motion.span
                                key={totalProducts}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="ml-3 inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-base font-normal text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                            >
                                {totalProducts} résultat
                                {totalProducts !== 1 ? 's' : ''}
                            </motion.span>
                        </h1>
                    </motion.div>

                    {/* Recherche */}
                    <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="relative w-full sm:w-96"
                    >
                        <div className="relative">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <Input
                                placeholder="Rechercher un produit..."
                                value={searchInput}
                                onChange={(e) =>
                                    handleSearchChange(e.target.value)
                                }
                                className="h-11 rounded-full border-slate-200 pr-24 pl-9 text-sm transition-all focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-900/70"
                            />
                            {searchInput && (
                                <button
                                    onClick={() => {
                                        setSearchInput('');
                                        applyFilters({ search: undefined });
                                    }}
                                    className="absolute top-1/2 right-20 -translate-y-1/2 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
                                    aria-label="Effacer la recherche"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            )}
                            <div className="absolute top-1/2 right-1 flex -translate-y-1/2 items-center gap-1">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageUpload}
                                    accept="image/*"
                                    className="hidden"
                                />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-slate-400 hover:text-slate-600"
                                    onClick={handleImageSearch}
                                    disabled={isSearchingByImage}
                                >
                                    {isSearchingByImage ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Camera className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        </div>

                        {searchInput && (
                            <motion.div
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute top-full right-0 left-0 z-20 mt-1 rounded-lg border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-700 dark:bg-slate-900"
                            >
                                <p className="px-2 py-1 text-xs font-medium text-slate-500">
                                    Suggestions
                                </p>
                                {[
                                    'Smartphone',
                                    'Ordinateur portable',
                                    'Écouteurs sans fil',
                                ].map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => {
                                            setSearchInput(s);
                                            applyFilters({ search: s });
                                        }}
                                        className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                                    >
                                        <Search className="h-3.5 w-3.5 text-slate-400" />
                                        {s}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </motion.div>
                </div>

                {/* Filtres actifs */}
                {activeFiltersArray.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 flex flex-wrap items-center gap-2"
                    >
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                            Filtres actifs :
                        </span>
                        {activeFiltersArray.map(({ key, value }) => (
                            <Badge
                                key={key}
                                variant="secondary"
                                className="gap-1 px-3 py-1"
                            >
                                {key === 'min_price' && 'Prix ≥ '}
                                {key === 'max_price' && 'Prix ≤ '}
                                {key === 'category' && 'Catégorie : '}
                                {key === 'brand' && 'Marque : '}
                                {key === 'search' && 'Recherche : '}
                                {value}
                                <button
                                    onClick={() =>
                                        removeFilter(key as keyof LocalFilters)
                                    }
                                    className="ml-1 rounded-full p-0.5 hover:bg-slate-200 dark:hover:bg-slate-700"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </Badge>
                        ))}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearAllFilters}
                            className="h-7 text-xs"
                        >
                            Tout effacer
                        </Button>
                    </motion.div>
                )}

                {searchContext?.query && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-800/50"
                    >
                        <Badge variant="secondary">
                            {searchContext.mode === 'image'
                                ? 'Recherche par image'
                                : 'Recherche texte'}
                        </Badge>
                        {searchContext.semantic && <Badge>Intelligent</Badge>}
                        <span className="text-slate-500 dark:text-slate-400">
                            Résultats pour
                        </span>
                        <span className="font-medium text-slate-900 dark:text-white">
                            {searchContext.query}
                        </span>
                    </motion.div>
                )}

                <div className="mt-6 lg:grid lg:grid-cols-4 lg:gap-8">
                    {/* Filtres desktop */}
                    <aside className="hidden lg:block">
                        <div className="sticky top-20">
                            <FiltersPanel
                                categories={categories}
                                brands={brands}
                                localFilters={localFilters}
                                priceRange={priceRange}
                                setPriceRange={setPriceRange}
                                applyFilters={applyFilters}
                                clearAllFilters={clearAllFilters}
                                applyPriceFilter={applyPriceFilter}
                                minPossiblePrice={serverPriceRange.min}
                                maxPossiblePrice={serverPriceRange.max}
                            />
                        </div>
                    </aside>

                    {/* Liste des produits */}
                    <div className="lg:col-span-3">
                        {/* Barre d'outils */}
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Sheet
                                    open={mobileFiltersOpen}
                                    onOpenChange={setMobileFiltersOpen}
                                >
                                    <SheetTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="lg:hidden"
                                        >
                                            <SlidersHorizontal className="mr-2 h-4 w-4" />
                                            Filtres
                                            {activeFiltersArray.length > 0 && (
                                                <Badge
                                                    variant="secondary"
                                                    className="ml-2 h-5 min-w-5 px-1"
                                                >
                                                    {activeFiltersArray.length}
                                                </Badge>
                                            )}
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent
                                        side="left"
                                        className="w-80 sm:w-96"
                                    >
                                        <SheetHeader>
                                            <SheetTitle>Filtres</SheetTitle>
                                        </SheetHeader>
                                        <div className="py-4">
                                            <FiltersPanel
                                                categories={categories}
                                                brands={brands}
                                                localFilters={localFilters}
                                                priceRange={priceRange}
                                                setPriceRange={setPriceRange}
                                                applyFilters={applyFilters}
                                                clearAllFilters={
                                                    clearAllFilters
                                                }
                                                applyPriceFilter={
                                                    applyPriceFilter
                                                }
                                                minPossiblePrice={
                                                    serverPriceRange.min
                                                }
                                                maxPossiblePrice={
                                                    serverPriceRange.max
                                                }
                                            />
                                        </div>
                                    </SheetContent>
                                </Sheet>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="hidden md:flex"
                                        >
                                            <LayoutGrid className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start">
                                        <DropdownMenuItem
                                            onClick={() =>
                                                setViewDensity('comfortable')
                                            }
                                        >
                                            <LayoutGrid className="mr-2 h-4 w-4" />{' '}
                                            Confortable
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() =>
                                                setViewDensity('compact')
                                            }
                                        >
                                            <LayoutGrid className="mr-2 h-4 w-4" />{' '}
                                            Compact
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <Select
                                value={localFilters.sort || 'newest'}
                                onValueChange={(value) =>
                                    applyFilters({ sort: value })
                                }
                            >
                                <SelectTrigger className="w-40 border-slate-200 dark:border-slate-700 dark:bg-slate-900/70">
                                    <SelectValue placeholder="Trier" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="newest">
                                        Nouveautés
                                    </SelectItem>
                                    <SelectItem value="popular">
                                        Popularité
                                    </SelectItem>
                                    <SelectItem value="price_asc">
                                        Prix croissant
                                    </SelectItem>
                                    <SelectItem value="price_desc">
                                        Prix décroissant
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Chargement */}
                        {isLoading && (
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <Skeleton
                                        key={i}
                                        className="h-72 rounded-2xl"
                                    />
                                ))}
                            </div>
                        )}

                        {/* État vide */}
                        {!isLoading && products.data.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col items-center justify-center py-16 text-center"
                            >
                                <div className="mb-6 rounded-full bg-slate-100 p-6 dark:bg-slate-800">
                                    <Search className="h-10 w-10 text-slate-400" />
                                </div>
                                <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">
                                    Aucun produit trouvé
                                </h3>
                                <p className="mb-6 max-w-md text-slate-500 dark:text-slate-400">
                                    Essayez d'ajuster vos filtres ou explorez
                                    nos catégories.
                                </p>
                                <div className="flex flex-wrap justify-center gap-3">
                                    <Button
                                        onClick={clearAllFilters}
                                        size="lg"
                                        className="gap-2"
                                    >
                                        <X className="h-4 w-4" /> Effacer les
                                        filtres
                                    </Button>
                                    <Button variant="outline" size="lg" asChild>
                                        <Link
                                            href={route(
                                                'tenant.product.category.index',
                                            )}
                                        >
                                            Parcourir les catégories
                                            <ChevronRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {/* Grille de produits */}
                        {!isLoading && products.data.length > 0 && (
                            <>
                                <motion.div
                                    layout
                                    className={`grid gap-4 ${viewDensity === 'comfortable' ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-3 sm:grid-cols-4'}`}
                                >
                                    <AnimatePresence mode="popLayout">
                                        {products.data.map((product) => (
                                            <motion.div
                                                key={product.id}
                                                initial={{
                                                    opacity: 0,
                                                    scale: 0.95,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    scale: 1,
                                                }}
                                                exit={{
                                                    opacity: 0,
                                                    scale: 0.95,
                                                }}
                                                transition={{ duration: 0.2 }}
                                                layout
                                            >
                                                <ProductCard
                                                    product={product}
                                                />
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </motion.div>

                                {/* Pagination */}
                                {products.last_page > 1 && (
                                    <div className="mt-10 flex justify-center">
                                        <nav className="flex items-center gap-1">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={
                                                    products.current_page === 1
                                                }
                                                onClick={() =>
                                                    applyFilters({
                                                        page: String(
                                                            products.current_page -
                                                                1,
                                                        ),
                                                    })
                                                }
                                            >
                                                Précédent
                                            </Button>
                                            {Array.from(
                                                { length: products.last_page },
                                                (_, i) => i + 1,
                                            ).map((page) => (
                                                <Button
                                                    key={page}
                                                    variant={
                                                        page ===
                                                        products.current_page
                                                            ? 'default'
                                                            : 'outline'
                                                    }
                                                    size="sm"
                                                    onClick={() =>
                                                        applyFilters({
                                                            page: String(page),
                                                        })
                                                    }
                                                >
                                                    {page}
                                                </Button>
                                            ))}
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={
                                                    products.current_page ===
                                                    products.last_page
                                                }
                                                onClick={() =>
                                                    applyFilters({
                                                        page: String(
                                                            products.current_page +
                                                                1,
                                                        ),
                                                    })
                                                }
                                            >
                                                Suivant
                                            </Button>
                                        </nav>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
