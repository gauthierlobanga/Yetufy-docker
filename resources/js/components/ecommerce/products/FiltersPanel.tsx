// resources/js/components/ecommerce/products/FiltersPanel.tsx
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Search,
    ChevronDown,
    SlidersHorizontal,
    RotateCcw,
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import type { Category } from '@/types/ecommerce/products';

interface LocalFilters {
    category?: string;
    brand?: string;
    min_price?: string;
    max_price?: string;
    search?: string;
    sort?: string;
    page?: string;
}

interface FiltersPanelProps {
    categories: Category[];
    brands: { id: number; name: string }[];
    localFilters: LocalFilters;
    priceRange: [number, number];
    setPriceRange: React.Dispatch<React.SetStateAction<[number, number]>>;
    applyFilters: (newFilters: Partial<LocalFilters>) => void;
    clearAllFilters: () => void;
    applyPriceFilter: () => void;
    minPossiblePrice: number;
    maxPossiblePrice: number;
}

export default function FiltersPanel({
    categories,
    brands,
    localFilters,
    priceRange,
    setPriceRange,
    applyFilters,
    clearAllFilters,
    applyPriceFilter,
    minPossiblePrice,
    maxPossiblePrice,
}: FiltersPanelProps) {
    const [searchInput, setSearchInput] = useState(localFilters.search || '');
    const [categorySearch, setCategorySearch] = useState('');
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(true);
    const [isPriceOpen, setIsPriceOpen] = useState(true);

    const filteredCategories = useMemo(() => {
        if (!categorySearch) {
            return categories;
        }

        return categories.filter((cat) =>
            cat.nom.toLowerCase().includes(categorySearch.toLowerCase()),
        );
    }, [categories, categorySearch]);

    const handleSearchSubmit = () => {
        applyFilters({ search: searchInput || undefined });
    };

    const clearSearch = () => {
        setSearchInput('');
        applyFilters({ search: undefined });
    };

    const removeFilter = (key: keyof LocalFilters) => {
        applyFilters({ [key]: undefined });
    };

    const activeFilters = useMemo(() => {
        const result: {
            key: keyof LocalFilters;
            label: string;
            value: string;
        }[] = [];

        if (localFilters.category) {
            const cat = categories.find(
                (c) => c.slug === localFilters.category,
            );

            if (cat) {
                result.push({
                    key: 'category',
                    label: 'Catégorie',
                    value: cat.nom,
                });
            }
        }

        if (localFilters.brand) {
            const brand = brands.find(
                (b) => String(b.id) === localFilters.brand,
            );

            if (brand) {
                result.push({
                    key: 'brand',
                    label: 'Marque',
                    value: brand.name,
                });
            }
        }

        if (localFilters.min_price || localFilters.max_price) {
            const min = localFilters.min_price || minPossiblePrice;
            const max = localFilters.max_price || maxPossiblePrice;
            result.push({
                key: 'min_price',
                label: 'Prix',
                value: `€${min} – €${max}`,
            });
        }

        if (localFilters.search) {
            result.push({
                key: 'search',
                label: 'Recherche',
                value: localFilters.search,
            });
        }

        return result;
    }, [localFilters, categories, brands, minPossiblePrice, maxPossiblePrice]);

    const hasActiveFilters = activeFilters.length > 0;

    return (
        <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80">
            {/* En‑tête fixe */}
            <div className="shrink-0 border-b border-slate-200 p-5 dark:border-slate-800">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <SlidersHorizontal className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                            Filtres
                        </h2>
                    </div>
                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearAllFilters}
                            className="h-8 cursor-pointer gap-1 text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                        >
                            <RotateCcw className="h-3.5 w-3.5" />
                            Réinitialiser
                        </Button>
                    )}
                </div>

                {/* Badges des filtres actifs */}
                <AnimatePresence>
                    {hasActiveFilters && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3 flex flex-wrap gap-2 overflow-hidden"
                        >
                            {activeFilters.map((filter) => (
                                <Badge
                                    key={filter.key}
                                    variant="secondary"
                                    className="gap-1.5 py-1.5 pr-1.5 pl-3 text-xs font-normal"
                                >
                                    <span className="text-slate-500 dark:text-slate-400">
                                        {filter.label}:
                                    </span>
                                    <span className="max-w-30 truncate font-medium text-slate-700 dark:text-slate-200">
                                        {filter.value}
                                    </span>
                                    <button
                                        onClick={() => removeFilter(filter.key)}
                                        className="ml-1 rounded-full p-0.5 transition-colors hover:bg-slate-200 dark:hover:bg-slate-700"
                                        aria-label={`Supprimer le filtre ${filter.label}`}
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Contenu défilant */}
            <div className="flex-1 space-y-5 overflow-y-auto px-5 py-4">
                {/* Recherche rapide */}
                <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Recherche
                    </Label>
                    <div className="relative">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                            placeholder="Nom du produit..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyDown={(e) =>
                                e.key === 'Enter' && handleSearchSubmit()
                            }
                            className="h-9 border-slate-200 bg-slate-50 pr-16 pl-9 text-sm dark:border-slate-700 dark:bg-slate-800/50"
                        />
                        {searchInput && (
                            <button
                                onClick={clearSearch}
                                className="absolute top-1/2 right-12 -translate-y-1/2 rounded-full p-1 transition-colors hover:bg-slate-200 dark:hover:bg-slate-700"
                            >
                                <X className="h-3.5 w-3.5 text-slate-400" />
                            </button>
                        )}
                        <Button
                            size="sm"
                            onClick={handleSearchSubmit}
                            className="absolute top-1/2 right-1 h-7 -translate-y-1/2 px-3 text-xs"
                        >
                            OK
                        </Button>
                    </div>
                </div>

                {/* Catégories */}
                <Collapsible
                    open={isCategoriesOpen}
                    onOpenChange={setIsCategoriesOpen}
                >
                    <CollapsibleTrigger className="flex w-full items-center justify-between py-1">
                        <Label className="cursor-pointer text-sm font-medium text-slate-700 dark:text-slate-300">
                            Catégories
                        </Label>
                        <ChevronDown
                            className={cn(
                                'h-4 w-4 text-slate-400 transition-transform duration-200',
                                isCategoriesOpen && 'rotate-180',
                            )}
                        />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-2 pt-2">
                        <div className="relative mb-2">
                            <Search className="absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                            <Input
                                placeholder="Filtrer les catégories..."
                                value={categorySearch}
                                onChange={(e) =>
                                    setCategorySearch(e.target.value)
                                }
                                className="h-8 border-slate-200 bg-slate-50 pl-8 text-xs dark:border-slate-700 dark:bg-slate-800/50"
                            />
                        </div>
                        {/* Liste des catégories avec hauteur max pour éviter de tout pousser */}
                        <div className="max-h-48 space-y-0.5 overflow-y-auto pr-1">
                            {filteredCategories.map((cat) => (
                                <label
                                    key={cat.id}
                                    className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                                >
                                    <Checkbox
                                        checked={
                                            localFilters.category === cat.slug
                                        }
                                        onCheckedChange={(checked) =>
                                            applyFilters({
                                                category: checked
                                                    ? cat.slug
                                                    : undefined,
                                            })
                                        }
                                    />
                                    <span className="text-slate-700 dark:text-slate-300">
                                        {cat.nom}
                                    </span>
                                </label>
                            ))}
                            {filteredCategories.length === 0 && (
                                <p className="py-4 text-center text-xs text-slate-400">
                                    Aucune catégorie trouvée
                                </p>
                            )}
                        </div>
                    </CollapsibleContent>
                </Collapsible>

                {/* Marques */}
                {brands.length > 0 && (
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Marque
                        </Label>
                        <Select
                            value={localFilters.brand || 'all'}
                            onValueChange={(value) =>
                                applyFilters({
                                    brand: value === 'all' ? undefined : value,
                                })
                            }
                        >
                            <SelectTrigger className="h-9 border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50">
                                <SelectValue placeholder="Toutes les marques" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    Toutes les marques
                                </SelectItem>
                                {brands.map((brand) => (
                                    <SelectItem
                                        key={brand.id}
                                        value={String(brand.id)}
                                    >
                                        {brand.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {/* Prix */}
                <Collapsible open={isPriceOpen} onOpenChange={setIsPriceOpen}>
                    <CollapsibleTrigger className="flex w-full items-center justify-between py-1">
                        <Label className="cursor-pointer text-sm font-medium text-slate-700 dark:text-slate-300">
                            Prix (CDF)
                        </Label>
                        <ChevronDown
                            className={cn(
                                'h-4 w-4 text-slate-400 transition-transform duration-200',
                                isPriceOpen && 'rotate-180',
                            )}
                        />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-3 pt-3">
                        <Slider
                            min={minPossiblePrice}
                            max={maxPossiblePrice}
                            step={Math.max(
                                1,
                                Math.floor(
                                    (maxPossiblePrice - minPossiblePrice) / 50,
                                ),
                            )}
                            value={priceRange}
                            onValueChange={(value: number[]) =>
                                setPriceRange([value[0], value[1]])
                            }
                            className="my-4"
                        />
                        <div className="flex items-center gap-2">
                            <div className="flex-1">
                                <Label className="text-xs text-slate-500">
                                    Min
                                </Label>
                                <div className="mt-1 rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm tabular-nums dark:border-slate-700 dark:bg-slate-800/50">
                                    {priceRange[0]}
                                </div>
                            </div>
                            <div className="flex-1">
                                <Label className="text-xs text-slate-500">
                                    Max
                                </Label>
                                <div className="mt-1 rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm tabular-nums dark:border-slate-700 dark:bg-slate-800/50">
                                    {priceRange[1]}
                                </div>
                            </div>
                        </div>
                        <Button
                            size="sm"
                            className="w-full rounded-xl py-4"
                            onClick={applyPriceFilter}
                            disabled={
                                priceRange[0] === minPossiblePrice &&
                                priceRange[1] === maxPossiblePrice
                            }
                        >
                            Appliquer
                        </Button>
                    </CollapsibleContent>
                </Collapsible>
            </div>
        </div>
    );
}
