/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
// resources/js/components/search-my-input.tsx
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowDown,
    ArrowUp,
    CornerDownLeft,
    SearchIcon,
    X,
} from 'lucide-react';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useDebounce } from '@/hooks/use-debounce';
import { useKeyboardNavigation } from '@/hooks/use-keyboard-navigation-app';
import { cn } from '@/lib/utils';

// Types
export interface SearchResult {
    id: number;
    title?: string;
    nom?: string;
    name?: string;
    slug: string;
    excerpt?: string | null;
    content?: string | null;
    featured_image_thumb?: string | null;
    avatar_url?: string | null;
    categories?: Array<{ id: number; nom: string; slug: string }>;
    user?: { id: number; name: string; avatar_url?: string | null };
    _type?: 'post' | 'category' | 'user'; // Rendu optionnel pour plus de flexibilité
    published_at?: string | null;
    views_count?: number;
    posts_count?: number;
}

export interface SearchConfig {
    placeholder?: string;
    hitsPerPage?: number;
    buttonText?: string;
    buttonProps?: React.ComponentProps<typeof SearchButton>;
    openResultsInNewTab?: boolean;
    onResultClick?: (result: SearchResult) => void;
    searchEndpoint?: string;
}

// ============================================================================
// Search Button
// ============================================================================
interface SearchButtonProps extends React.ComponentProps<typeof Button> {}

export const SearchButton: React.FC<SearchButtonProps> = ({
    className,
    children,
    ...buttonProps
}) => {
    const [modifierLabel, setModifierLabel] = useState('');
    const [isModifierPressed, setIsModifierPressed] = useState(false);
    const [isKPressed, setIsKPressed] = useState(false);

    useEffect(() => {
        if (typeof navigator === 'undefined') {
            return;
        }

        // CORRECTION: Assignation correcte du raccourci clavier selon l'OS
        setModifierLabel(
            /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform) ? '⌘' : 'Ctrl',
        );
    }, []);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.metaKey || event.ctrlKey) {
                setIsModifierPressed(true);
            }

            if (event.key.toLowerCase() === 'k') {
                setIsKPressed(true);
            }
        };
        const handleKeyUp = (event: KeyboardEvent) => {
            if (!event.metaKey && !event.ctrlKey) {
                setIsModifierPressed(false);
            }

            if (event.key.toLowerCase() === 'k') {
                setIsKPressed(false);
            }
        };
        const resetKeys = () => {
            setIsModifierPressed(false);
            setIsKPressed(false);
        };
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
        window.addEventListener('blur', resetKeys);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
            window.removeEventListener('blur', resetKeys);
        };
    }, []);

    return (
        <Button
            variant="outline"
            type="button"
            className={cn(
                'h-auto cursor-pointer justify-between gap-2 rounded-xl border-slate-200 bg-white/80 px-4 py-3 text-sm font-medium text-slate-700 shadow-sm backdrop-blur transition-all hover:border-emerald-300 hover:bg-white hover:shadow-md dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:border-emerald-600 dark:hover:bg-slate-800',
                className,
            )}
            aria-label="Open search"
            {...buttonProps}
        >
            <span className="flex items-center gap-2">
                <SearchIcon
                    size={18}
                    className="text-slate-400 dark:text-slate-500"
                />
                <span className="hidden sm:inline">{children}</span>
            </span>
            <div className="hidden gap-0.5 md:flex">
                <kbd className="grid h-5 min-w-5 place-items-center rounded bg-slate-100 text-xs text-slate-500 dark:bg-slate-700 dark:text-slate-400">
                    {modifierLabel}
                </kbd>
                <kbd className="grid h-5 min-w-5 place-items-center rounded bg-slate-100 text-xs text-slate-500 dark:bg-slate-700 dark:text-slate-400">
                    K
                </kbd>
            </div>
        </Button>
    );
};

// ============================================================================
// Modal
// ============================================================================
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) {
        return null;
    }

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm md:pt-[10vh] dark:bg-black/60"
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex h-full w-full max-w-full flex-col overflow-hidden bg-white/95 shadow-2xl shadow-emerald-500/10 backdrop-blur-xl md:h-auto md:max-h-[80vh] md:w-[90%] md:max-w-2xl md:rounded-2xl dark:bg-slate-900/95 dark:shadow-emerald-900/20"
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </motion.div>
        </div>,
        document.body,
    );
};

// ============================================================================
// Search Input
// ============================================================================
interface SearchInputFieldProps {
    query: string;
    setQuery: (query: string) => void;
    placeholder?: string;
    inputRef: React.RefObject<HTMLInputElement | null>;
    onClose: () => void;
    onArrowDown?: () => void;
    onArrowUp?: () => void;
    onEnter?: () => void;
    isLoading?: boolean;
}

const SearchInputField = memo(function SearchInputField({
    query,
    setQuery,
    placeholder,
    inputRef,
    onClose,
    onArrowDown,
    onArrowUp,
    onEnter,
    isLoading,
}: SearchInputFieldProps) {
    return (
        <div className="flex items-center gap-3 border-b border-slate-200/80 bg-white/80 px-4 py-3 backdrop-blur dark:border-slate-700 dark:bg-slate-900/80">
            <SearchIcon className="h-5 w-5 shrink-0 text-slate-400 dark:text-slate-500" />
            <input
                ref={inputRef}
                type="text"
                className="flex-1 bg-transparent text-lg font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none dark:text-slate-100 dark:placeholder:text-slate-500"
                placeholder={
                    placeholder || 'Rechercher des articles, catégories...'
                }
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        onArrowDown?.();
                    } else if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        onArrowUp?.();
                    } else if (e.key === 'Enter') {
                        e.preventDefault();
                        onEnter?.();
                    }
                }}
                autoFocus
            />
            <div className="flex items-center gap-2">
                {isLoading && (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
                )}
                {query && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                        onClick={() => {
                            setQuery('');
                            inputRef.current?.focus();
                        }}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 rounded-lg border-slate-200 bg-white px-2 text-xs font-medium text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
                    onClick={onClose}
                >
                    ESC
                </Button>
            </div>
        </div>
    );
});

// ============================================================================
// Results Panel
// ============================================================================
interface ResultsPanelProps {
    results: SearchResult[];
    selectedIndex: number;
    onResultClick: (result: SearchResult) => void;
    onHoverIndex?: (index: number) => void;
}

const ResultsPanel = memo(function ResultsPanel({
    results,
    selectedIndex,
    onResultClick,
    onHoverIndex,
}: ResultsPanelProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [hoverEnabled, setHoverEnabled] = useState(false);

    useEffect(() => {
        const container = containerRef.current;

        if (!container) {
            return;
        }

        const selectedEl = container.querySelector(
            '[aria-selected="true"]',
        ) as HTMLElement | null;

        if (!selectedEl) {
            return;
        }

        const padding = 8;
        const cRect = container.getBoundingClientRect();
        const iRect = selectedEl.getBoundingClientRect();

        if (iRect.top < cRect.top + padding) {
            container.scrollTop -= cRect.top + padding - iRect.top;
        } else if (iRect.bottom > cRect.bottom - padding) {
            container.scrollTop += iRect.bottom - (cRect.bottom - padding);
        }
    }, [selectedIndex]);

    useEffect(() => {
        const container = containerRef.current;

        if (!container) {
            return;
        }

        setHoverEnabled(false);
        const enable = () => setHoverEnabled(true);
        container.addEventListener('pointermove', enable, { once: true });

        return () =>
            container.removeEventListener('pointermove', enable as any);
    }, []);

    const renderResult = (result: SearchResult) => {
        // CORRECTION : Déduction du type si le backend ne renvoie pas la propriété _type
        const itemType =
            result._type ||
            (result.title
                ? 'post'
                : result.nom
                  ? 'category'
                  : result.name
                    ? 'user'
                    : 'unknown');

        if (itemType === 'post') {
            return (
                <div className="flex items-start gap-3">
                    {result.featured_image_thumb ? (
                        <img
                            src={result.featured_image_thumb}
                            alt={result.title}
                            className="h-12 w-12 rounded-xl object-cover shadow-sm"
                        />
                    ) : (
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                            <SearchIcon className="h-5 w-5 text-slate-400" />
                        </div>
                    )}
                    <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-slate-800 dark:text-slate-200">
                            {result.title}
                        </p>
                        <p className="line-clamp-1 text-sm text-slate-500 dark:text-slate-400">
                            {result.excerpt || 'Aucun extrait'}
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                            <Badge
                                variant="outline"
                                className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                            >
                                Article
                            </Badge>
                            {result.categories?.[0]?.nom && (
                                <span>{result.categories[0].nom}</span>
                            )}
                            {result.published_at && (
                                <span>
                                    {new Date(
                                        result.published_at,
                                    ).toLocaleDateString('fr-FR')}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        if (itemType === 'category') {
            return (
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                        #
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-slate-800 dark:text-slate-200">
                            {result.nom}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Catégorie • {result.posts_count || 0} articles
                        </p>
                    </div>
                </div>
            );
        }

        if (itemType === 'user') {
            return (
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 ring-2 ring-slate-200 dark:ring-slate-700">
                        {result.avatar_url ? (
                            <AvatarImage
                                src={result.avatar_url}
                                alt={result.name}
                            />
                        ) : (
                            <AvatarFallback className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
                                {result.name?.charAt(0).toUpperCase() || 'U'}
                            </AvatarFallback>
                        )}
                    </Avatar>
                    <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-slate-800 dark:text-slate-200">
                            {result.name}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Auteur
                        </p>
                    </div>
                </div>
            );
        }

        // Fallback par défaut si aucun type ne correspond, pour éviter que le composant ne disparaisse silencieusement
        return (
            <div className="flex items-center gap-3">
                <SearchIcon className="h-5 w-5 text-slate-400" />
                <span className="truncate font-medium text-slate-800 dark:text-slate-200">
                    {result.title || result.nom || result.name || 'Résultat'}
                </span>
            </div>
        );
    };

    return (
        <div
            ref={containerRef}
            className="flex flex-1 flex-col gap-1 overflow-y-auto bg-slate-50/80 p-2 dark:bg-slate-800/30"
            role="listbox"
        >
            {results.map((result, idx) => {
                const isSelected = selectedIndex === idx;

                return (
                    <div
                        key={`result-${result.id || idx}`}
                        className={cn(
                            'cursor-pointer rounded-xl p-3 transition-all duration-150',
                            isSelected &&
                                'bg-emerald-50/90 shadow-sm dark:bg-emerald-900/20',
                            !isSelected &&
                                'hover:bg-white dark:hover:bg-slate-800/80',
                        )}
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => onResultClick(result)}
                        onMouseEnter={() => {
                            if (hoverEnabled) {
                                onHoverIndex?.(idx);
                            }
                        }}
                    >
                        {renderResult(result)}
                    </div>
                );
            })}
        </div>
    );
});

// ============================================================================
// No Results
// ============================================================================
const NoResults = memo(function NoResults({
    query,
    onClear,
}: {
    query: string;
    onClear: () => void;
}) {
    return (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-slate-50/80 p-8 text-center dark:bg-slate-800/30">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700">
                <SearchIcon className="h-6 w-6 text-slate-500 dark:text-slate-400" />
            </div>
            <div>
                <p className="text-lg font-medium text-slate-700 dark:text-slate-200">
                    Aucun résultat pour "{query}"
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Essayez une autre recherche ou parcourez nos catégories
                </p>
            </div>
            <Button variant="outline" onClick={onClear}>
                Effacer la recherche
            </Button>
        </div>
    );
});

// ============================================================================
// Footer
// ============================================================================
const Footer = memo(function Footer({
    resultsCount,
}: {
    resultsCount: number;
}) {
    return (
        <div className="flex items-center justify-between border-t border-slate-200/80 bg-white/80 px-4 py-3 text-xs text-slate-500 backdrop-blur dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-400">
            <div className="hidden items-center gap-4 sm:flex">
                <div className="flex items-center gap-1.5">
                    <kbd className="flex h-6 items-center justify-center rounded-md bg-slate-100 px-2 font-medium dark:bg-slate-800">
                        <CornerDownLeft size={14} />
                    </kbd>
                    <span>Ouvrir</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <kbd className="flex h-6 items-center justify-center rounded-md bg-slate-100 px-2 font-medium dark:bg-slate-800">
                        <ArrowUp size={14} />
                    </kbd>
                    <kbd className="flex h-6 items-center justify-center rounded-md bg-slate-100 px-2 font-medium dark:bg-slate-800">
                        <ArrowDown size={14} />
                    </kbd>
                    <span>Naviguer</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <kbd className="flex h-6 items-center justify-center rounded-md bg-slate-100 px-2 font-medium dark:bg-slate-800">
                        ESC
                    </kbd>
                    <span>Fermer</span>
                </div>
            </div>
            <div className="flex-1 text-right sm:flex-none">
                {resultsCount} résultat{resultsCount !== 1 && 's'}
            </div>
        </div>
    );
});

// ============================================================================
// Search Modal Component
// ============================================================================
interface SearchModalProps {
    onClose: () => void;
    config: SearchConfig;
}

function SearchModal({ onClose, config }: SearchModalProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const debouncedQuery = useDebounce(query, 300);

    // CORRECTION : Vider immédiatement les résultats si la recherche est annulée
    useEffect(() => {
        if (query.trim().length < 2) {
            setResults([]);
        }
    }, [query]);

    useEffect(() => {
        const fetchResults = async () => {
            if (!debouncedQuery.trim() || debouncedQuery.trim().length < 2) {
                setResults([]);

                return;
            }

            setIsLoading(true);

            try {
                // Remplacement de `route()` par le endpoint (si route() n'est pas globalement défini)
                const endpoint = config.searchEndpoint || '/search';
                const response = await axios.get(endpoint, {
                    params: {
                        q: debouncedQuery.trim(),
                        limit: config.hitsPerPage || 8,
                    },
                    headers: {
                        Accept: 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                });

                // L’API renvoie { results: [...] }
                const fetched = response.data?.results ?? [];

                // Mapper le champ 'type' (envoyé par le contrôleur) en '_type' (attendu par l’UI)
                const normalized: SearchResult[] = fetched.map((item: any) => ({
                    ...item,
                    _type: item.type ?? item._type, // priorité au champ 'type'
                }));

                setResults(normalized);
            } catch (error) {
                console.error('Erreur de recherche :', error);
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchResults();
    }, [debouncedQuery, config.hitsPerPage, config.searchEndpoint]);
    const { selectedIndex, moveDown, moveUp, hoverIndex } =
        useKeyboardNavigation<SearchResult>(
            results,
            query,
            config.openResultsInNewTab ?? false,
        );

    const handleResultClick = useCallback(
        (result: SearchResult) => {
            const url = config.onResultClick
                ? undefined
                : `/blog/${result.slug}`;

            if (config.onResultClick) {
                config.onResultClick(result);
            } else {
                window.location.href = url!;
            }
        },
        [config],
    );

    const handleActivateSelection = useCallback(() => {
        if (selectedIndex >= 0 && selectedIndex < results.length) {
            handleResultClick(results[selectedIndex]);

            return true;
        }

        return false;
    }, [selectedIndex, results, handleResultClick]);

    const showResults = results.length > 0 && query.length >= 2;
    const noResults = !isLoading && results.length === 0 && query.length >= 2;

    return (
        <div className="flex h-full max-h-[80vh] flex-col">
            <SearchInputField
                query={query}
                setQuery={setQuery}
                placeholder={config.placeholder}
                inputRef={inputRef}
                onClose={onClose}
                onArrowDown={moveDown}
                onArrowUp={moveUp}
                onEnter={handleActivateSelection}
                isLoading={isLoading}
            />

            {isLoading && (
                <div className="flex-1 space-y-3 p-4">
                    <Skeleton className="h-16 w-full rounded-xl" />
                    <Skeleton className="h-16 w-full rounded-xl" />
                    <Skeleton className="h-16 w-full rounded-xl" />
                </div>
            )}

            {showResults && !isLoading && (
                <ResultsPanel
                    results={results}
                    selectedIndex={selectedIndex}
                    onResultClick={handleResultClick}
                    onHoverIndex={hoverIndex}
                />
            )}

            {noResults && (
                <NoResults
                    query={query}
                    onClear={() => {
                        setQuery('');
                        inputRef.current?.focus();
                    }}
                />
            )}

            {!isLoading && <Footer resultsCount={results.length} />}
        </div>
    );
}

// ============================================================================
// Export principal
// ============================================================================
export default function SearchExperience(config: SearchConfig) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (
                (event.metaKey || event.ctrlKey) &&
                event.key.toLowerCase() === 'k'
            ) {
                event.preventDefault();
                setIsModalOpen(true);
            }
        };
        document.addEventListener('keydown', handleKeyDown);

        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <>
            <SearchButton
                onClick={() => setIsModalOpen(true)}
                {...(config.buttonProps || {})}
            >
                {config.buttonText || 'Rechercher'}
            </SearchButton>
            <AnimatePresence>
                {isModalOpen && (
                    <Modal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                    >
                        <SearchModal
                            onClose={() => setIsModalOpen(false)}
                            config={config}
                        />
                    </Modal>
                )}
            </AnimatePresence>
        </>
    );
}
