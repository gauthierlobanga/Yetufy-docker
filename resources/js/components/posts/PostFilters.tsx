// resources/js/Components/Posts/PostFilters.tsx
import { Search, Filter, X, SlidersHorizontal, RefreshCcw } from 'lucide-react';
import React, {
    useState,
    useEffect,
    useMemo,
    useRef,
    useCallback,
} from 'react';
import { Button } from '@/components/ui/button';
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
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import type { PostFilters } from '@/types/posts/posts';

interface PostFiltersComponentProps {
    filters: PostFilters;
    categories: Array<{
        id: number;
        nom: string;
        slug: string;
        parent_id?: number | null;
        color?: string | null;
    }>;
    statuses: Record<string, string>;
    processing: boolean;
    onFilterChange: (filters: Partial<PostFilters>) => void;
    onReset?: () => void;
}

// 🔥 Définir le tri par défaut comme constante
const DEFAULT_SORT = 'published_at';
const DEFAULT_DIRECTION = 'desc';

export function PostFiltersComponent({
    filters,
    categories,
    statuses,
    processing,
    onFilterChange,
    onReset,
}: PostFiltersComponentProps) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const previousSearchRef = useRef(filters.search);

    // Organiser les catégories par parent pour l'affichage hiérarchique
    const rootCategories = useMemo(
        () => categories.filter((c) => !c.parent_id),
        [categories],
    );

    const childrenByParent = useMemo(
        () =>
            categories.reduce(
                (acc, cat) => {
                    if (cat.parent_id) {
                        if (!acc[cat.parent_id]) {
                            acc[cat.parent_id] = [];
                        }

                        acc[cat.parent_id].push(cat);
                    }

                    return acc;
                },
                {} as Record<number, typeof categories>,
            ),
        [categories],
    );

    // 🔥 CORRECTION: Vérifier si un tri est actif (différent du tri par défaut)
    const isSortActive = useMemo(() => {
        // Si pas de sort défini, c'est le défaut
        if (!filters.sort) {
            return false;
        }

        // Si le sort est différent du défaut OU si la direction est différente du défaut
        return (
            filters.sort !== DEFAULT_SORT ||
            (filters.direction && filters.direction !== DEFAULT_DIRECTION)
        );
    }, [filters.sort, filters.direction]);

    // 🔥 CORRECTION: hasActiveFilters - Ignorer le tri par défaut
    const hasActiveFilters = useMemo(() => {
        return !!(
            filters.search ||
            filters.status ||
            filters.category_id ||
            isSortActive // Utiliser isSortActive au lieu de la vérification directe
        );
    }, [filters.search, filters.status, filters.category_id, isSortActive]);

    // 🔥 CORRECTION: activeFilterCount - Ne compter le tri que s'il est actif
    const activeFilterCount = useMemo(() => {
        let count = 0;

        if (filters.search) {
            count++;
        }

        if (filters.status) {
            count++;
        }

        if (filters.category_id) {
            count++;
        }

        if (isSortActive) {
            count++;
        } // Utiliser isSortActive

        return count;
    }, [filters.search, filters.status, filters.category_id, isSortActive]);

    // 🔥 CORRECTION: getSortValue - Retourner la valeur par défaut si aucun tri
    const getSortValue = useCallback(() => {
        if (filters.sort) {
            return `${filters.sort}:${filters.direction || DEFAULT_DIRECTION}`;
        }

        return `${DEFAULT_SORT}:${DEFAULT_DIRECTION}`;
    }, [filters.sort, filters.direction]);

    const getCategoryValue = useCallback(() => {
        if (filters.category_id) {
            return String(filters.category_id);
        }

        return 'all';
    }, [filters.category_id]);

    // Debounce search
    const debouncedSearch = useCallback(
        (value: string) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                if (value !== previousSearchRef.current) {
                    previousSearchRef.current = value;
                    onFilterChange({ search: value || undefined });
                }
            }, 500);
        },
        [onFilterChange],
    );

    useEffect(() => {
        if (searchTerm === filters.search) {
            return;
        }

        debouncedSearch(searchTerm);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [searchTerm, debouncedSearch, filters.search]);

    // Synchroniser searchTerm avec filters.search
    useEffect(() => {
        if (filters.search !== searchTerm) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setSearchTerm(filters.search || '');

            previousSearchRef.current = filters.search;
        }
    }, [filters.search, searchTerm]); // Ajouter searchTerm aux dépendances

    const handleSearchChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setSearchTerm(e.target.value);
        },
        [],
    );

    const handleStatusChange = useCallback(
        (value: string) => {
            onFilterChange({ status: value !== 'all' ? value : undefined });
        },
        [onFilterChange],
    );

    const handleCategoryChange = useCallback(
        (value: string) => {
            onFilterChange({
                category_id: value !== 'all' ? parseInt(value, 10) : undefined,
            });
        },
        [onFilterChange],
    );

    const handleSortChange = useCallback(
        (value: string) => {
            const [sort, direction] = value.split(':');

            // 🔥 Si c'est le tri par défaut, on enlève les paramètres de tri
            if (sort === DEFAULT_SORT && direction === DEFAULT_DIRECTION) {
                onFilterChange({
                    sort: undefined,
                    direction: undefined,
                });
            } else {
                onFilterChange({
                    sort,
                    direction: direction as 'asc' | 'desc',
                });
            }
        },
        [onFilterChange],
    );

    const handleReset = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        setSearchTerm('');
        previousSearchRef.current = undefined;

        if (onReset) {
            onReset();
        } else {
            onFilterChange({
                search: undefined,
                status: undefined,
                category_id: undefined,
                sort: undefined,
                direction: undefined,
            });
        }

        setIsFilterSheetOpen(false);
    }, [onReset, onFilterChange]);

    const handleClearSearch = useCallback(() => {
        setSearchTerm('');
        onFilterChange({ search: undefined });
    }, [onFilterChange]);

    const handleClearStatus = useCallback(() => {
        onFilterChange({ status: undefined });
    }, [onFilterChange]);

    const handleClearCategory = useCallback(() => {
        onFilterChange({ category_id: undefined });
    }, [onFilterChange]);

    const handleClearSort = useCallback(() => {
        onFilterChange({ sort: undefined, direction: undefined });
    }, [onFilterChange]);

    // Nettoyage au démontage
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const getSortLabel = useCallback(
        (sort: unknown, direction: string): string => {
            // Vérifier si sort est une chaîne de caractères valide
            if (typeof sort !== 'string') {
                return '';
            }

            const sortLabels: Record<string, string> = {
                created_at: 'Date de création',
                published_at: 'Date de publication',
                title: 'Titre',
                views_count: 'Vues',
            };

            const directionLabel =
                direction === 'asc' ? 'croissant' : 'décroissant';

            return `${sortLabels[sort] || sort} (${directionLabel})`;
        },
        [],
    );

    return (
        <div className="w-full">
            {/* Version desktop : filtres en ligne */}
            <div className="hidden items-center gap-4 md:flex">
                {/* Recherche */}
                <div className="relative max-w-sm flex-1">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                    <Input
                        placeholder="Rechercher un article..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="pl-9"
                        disabled={processing}
                    />
                </div>

                {/* Filtre statut */}
                <Select
                    value={filters.status || 'all'}
                    onValueChange={handleStatusChange}
                    disabled={processing}
                >
                    <SelectTrigger className="w-45">
                        <Filter className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        {Object.entries(statuses).map(([key, label]) => (
                            <SelectItem key={key} value={key}>
                                <div className="flex items-center gap-2">
                                    <span
                                        className={`h-2 w-2 rounded-full ${
                                            key === 'published'
                                                ? 'bg-green-500'
                                                : key === 'draft'
                                                  ? 'bg-yellow-500'
                                                  : key === 'scheduled'
                                                    ? 'bg-blue-500'
                                                    : key === 'archived'
                                                      ? 'bg-gray-500'
                                                      : 'bg-red-500'
                                        }`}
                                    />
                                    {label}
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Filtre catégorie */}
                <Select
                    value={getCategoryValue()}
                    onValueChange={handleCategoryChange}
                    disabled={processing}
                >
                    <SelectTrigger className="w-50">
                        <SelectValue placeholder="Catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">
                            Toutes les catégories
                        </SelectItem>
                        {rootCategories.map((cat) => (
                            <React.Fragment key={cat.id}>
                                <SelectItem value={String(cat.id)}>
                                    {cat.nom}
                                </SelectItem>
                                {childrenByParent[cat.id]?.map((child) => (
                                    <SelectItem
                                        key={child.id}
                                        value={String(child.id)}
                                        className="pl-6"
                                    >
                                        └ {child.nom}
                                    </SelectItem>
                                ))}
                            </React.Fragment>
                        ))}
                    </SelectContent>
                </Select>

                {/* Tri */}
                <Select
                    value={getSortValue()}
                    onValueChange={handleSortChange}
                    disabled={processing}
                >
                    <SelectTrigger className="w-48">
                        <SelectValue placeholder="Trier par" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem
                            value={`${DEFAULT_SORT}:${DEFAULT_DIRECTION}`}
                        >
                            Plus récents (défaut)
                        </SelectItem>
                        <SelectItem value="published_at:asc">
                            Plus anciens
                        </SelectItem>
                        <SelectItem value="created_at:desc">
                            Date de création (récent)
                        </SelectItem>
                        <SelectItem value="created_at:asc">
                            Date de création (ancien)
                        </SelectItem>
                        <SelectItem value="title:asc">Titre (A-Z)</SelectItem>
                        <SelectItem value="title:desc">Titre (Z-A)</SelectItem>
                        <SelectItem value="views_count:desc">
                            Plus vus
                        </SelectItem>
                        <SelectItem value="views_count:asc">
                            Moins vus
                        </SelectItem>
                    </SelectContent>
                </Select>

                {/* 🔥 Bouton reset - s'affiche seulement si hasActiveFilters est true */}
                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleReset}
                        disabled={processing}
                    >
                        <RefreshCcw className="h-4 w-4" />
                        <span className="ml-2 hidden lg:inline">
                            Réinitialiser
                        </span>
                    </Button>
                )}
            </div>

            {/* Version mobile : bouton pour ouvrir le sheet */}
            <div className="md:hidden">
                <Sheet
                    open={isFilterSheetOpen}
                    onOpenChange={setIsFilterSheetOpen}
                >
                    <SheetTrigger asChild>
                        <Button variant="outline" className="w-full">
                            <SlidersHorizontal className="mr-2 h-4 w-4" />
                            Filtres
                            {activeFilterCount > 0 && (
                                <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                                    {activeFilterCount}
                                </span>
                            )}
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="h-[80vh]">
                        <SheetHeader>
                            <SheetTitle>Filtres</SheetTitle>
                            <SheetDescription>
                                Affinez la liste des articles
                            </SheetDescription>
                        </SheetHeader>

                        <div className="mt-6 space-y-4">
                            {/* Recherche mobile */}
                            <div className="space-y-2">
                                <Label>Recherche</Label>
                                <div className="relative">
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                                    <Input
                                        placeholder="Rechercher..."
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                        className="pl-9"
                                        disabled={processing}
                                    />
                                </div>
                            </div>

                            {/* Filtre statut mobile */}
                            <div className="space-y-2">
                                <Label>Statut</Label>
                                <Select
                                    value={filters.status || 'all'}
                                    onValueChange={handleStatusChange}
                                    disabled={processing}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Statut" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            Tous les statuts
                                        </SelectItem>
                                        {Object.entries(statuses).map(
                                            ([key, label]) => (
                                                <SelectItem
                                                    key={key}
                                                    value={key}
                                                >
                                                    {label}
                                                </SelectItem>
                                            ),
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Filtre catégorie mobile */}
                            <div className="space-y-2">
                                <Label>Catégorie</Label>
                                <Select
                                    value={getCategoryValue()}
                                    onValueChange={handleCategoryChange}
                                    disabled={processing}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Catégorie" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            Toutes les catégories
                                        </SelectItem>
                                        {rootCategories.map((cat) => (
                                            <React.Fragment key={cat.id}>
                                                <SelectItem
                                                    value={String(cat.id)}
                                                >
                                                    {cat.nom}
                                                </SelectItem>
                                                {childrenByParent[cat.id]?.map(
                                                    (child) => (
                                                        <SelectItem
                                                            key={child.id}
                                                            value={String(
                                                                child.id,
                                                            )}
                                                            className="pl-6"
                                                        >
                                                            └ {child.nom}
                                                        </SelectItem>
                                                    ),
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Tri mobile */}
                            <div className="space-y-2">
                                <Label>Trier par</Label>
                                <Select
                                    value={getSortValue()}
                                    onValueChange={handleSortChange}
                                    disabled={processing}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Trier par" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem
                                            value={`${DEFAULT_SORT}:${DEFAULT_DIRECTION}`}
                                        >
                                            Plus récents (défaut)
                                        </SelectItem>
                                        <SelectItem value="published_at:asc">
                                            Plus anciens
                                        </SelectItem>
                                        <SelectItem value="created_at:desc">
                                            Date de création (récent)
                                        </SelectItem>
                                        <SelectItem value="created_at:asc">
                                            Date de création (ancien)
                                        </SelectItem>
                                        <SelectItem value="title:asc">
                                            Titre (A-Z)
                                        </SelectItem>
                                        <SelectItem value="title:desc">
                                            Titre (Z-A)
                                        </SelectItem>
                                        <SelectItem value="views_count:desc">
                                            Plus vus
                                        </SelectItem>
                                        <SelectItem value="views_count:asc">
                                            Moins vus
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Boutons d'action */}
                            <div className="flex gap-2 pt-4">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={handleReset}
                                    disabled={processing}
                                >
                                    Réinitialiser
                                </Button>
                                <Button
                                    className="flex-1"
                                    onClick={() => setIsFilterSheetOpen(false)}
                                >
                                    Appliquer
                                </Button>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            {/* 🔥 Affichage des filtres actifs - Le tri par défaut n'est pas affiché */}
            {hasActiveFilters && (
                <div className="mt-4 flex flex-wrap gap-2">
                    {filters.search && (
                        <div className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground">
                            Recherche: "{filters.search}"
                            <button
                                onClick={handleClearSearch}
                                className="hover:text-destructive"
                                aria-label="Effacer la recherche"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    )}

                    {filters.status && (
                        <div className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground">
                            Statut: {statuses[filters.status]}
                            <button
                                onClick={handleClearStatus}
                                className="hover:text-destructive"
                                aria-label="Effacer le filtre statut"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    )}

                    {filters.category_id && (
                        <div className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground">
                            Catégorie:{' '}
                            {
                                categories.find(
                                    (c) => c.id === filters.category_id,
                                )?.nom
                            }
                            <button
                                onClick={handleClearCategory}
                                className="hover:text-destructive"
                                aria-label="Effacer le filtre catégorie"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    )}

                    {/* 🔥 Afficher le tri seulement s'il est actif (différent du défaut) */}
                    {/* 🔥 Afficher le tri seulement s'il est actif et que sort est une chaîne valide */}
                    {isSortActive &&
                        filters.sort &&
                        typeof filters.sort === 'string' && (
                            <div className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground">
                                Tri:{' '}
                                {getSortLabel(
                                    filters.sort,
                                    filters.direction || 'desc',
                                )}
                                <button
                                    onClick={handleClearSort}
                                    className="hover:text-destructive"
                                    aria-label="Effacer le tri"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        )}
                </div>
            )}
        </div>
    );
}
