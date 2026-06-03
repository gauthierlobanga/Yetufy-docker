// resources/js/components/search/search-experience.tsx
'use client';

import * as Popover from '@radix-ui/react-popover';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Loader2,
    SearchIcon,
    ArrowRight,
    Package,
    Folder,
    FileText,
    Users,
    X,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import { cn } from '@/lib/utils';

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------
export interface SearchResult {
    id: string | number;
    title: string;
    slug?: string;
    image?: string | null;
    url?: string;
    price?: string;
    description?: string;
    type: 'product' | 'product_category' | 'post' | 'blog_category' | 'user';
}

interface SearchExperienceProps {
    placeholder?: string;
    className?: string;
    maxResults?: number;
}

// ------------------------------------------------------------------
// Configuration visuelle
// ------------------------------------------------------------------
const iconMap: Record<string, React.ElementType> = {
    product: Package,
    product_category: Folder,
    post: FileText,
    blog_category: Folder,
    user: Users,
};

const typeLabel: Record<string, string> = {
    product: 'Produit',
    product_category: 'Catégorie',
    post: 'Article',
    blog_category: 'Blog',
    user: 'Utilisateur',
};

const groupLabel: Record<string, string> = {
    product: 'Produits',
    product_category: 'Catégories',
    post: 'Articles',
    blog_category: 'Blog',
    user: 'Utilisateurs',
};

// ------------------------------------------------------------------
// Résultat individuel
// ------------------------------------------------------------------
function SearchResultItem({
    item,
    onSelect,
}: {
    item: SearchResult;
    onSelect: (item: SearchResult) => void;
}) {
    const Icon = iconMap[item.type] ?? SearchIcon;
    const badge = typeLabel[item.type] ?? item.type;

    return (
        <motion.button
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            type="button"
            onClick={() => onSelect(item)}
            className="group relative flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left transition-all duration-200 hover:bg-emerald-50/80 hover:shadow-sm dark:hover:bg-emerald-900/20"
        >
            {/* Image / icône */}
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100 shadow-sm dark:bg-slate-800">
                {item.image ? (
                    <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                    />
                ) : (
                    <Icon className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                )}
                {/* Badge type */}
                <span className="absolute -right-0.5 -bottom-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-slate-700 text-[8px] font-bold text-white dark:border-slate-900 dark:bg-slate-500">
                    <Icon className="h-2.5 w-2.5" />
                </span>
            </div>

            {/* Contenu texte */}
            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                        {item.title}
                    </p>
                    <span className="shrink-0 rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                        {badge}
                    </span>
                </div>
                {item.description && (
                    <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
                        {item.description}
                    </p>
                )}
                {item.price && (
                    <p className="mt-1 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                        {item.price}
                    </p>
                )}
            </div>

            {/* Flèche de navigation */}
            <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:text-emerald-500 group-hover:opacity-100 dark:text-slate-600" />
        </motion.button>
    );
}

// ------------------------------------------------------------------
// Composant principal
// ------------------------------------------------------------------
export default function SearchExperience({
    placeholder = 'Rechercher un produit, un article…',
    className,
    maxResults = 5,
}: SearchExperienceProps) {
    const [query, setQuery] = useState('');
    const [debouncedQuery] = useDebounce(query, 300);
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const abortRef = useRef<AbortController | null>(null);

    // Appel API
    useEffect(() => {
        if (!debouncedQuery || debouncedQuery.length < 2) {
            setResults([]);
            setLoading(false);

            return;
        }

        if (abortRef.current) {
            abortRef.current.abort();
        }

        const controller = new AbortController();
        abortRef.current = controller;

        setLoading(true);
        fetch(route('tenant.api', { q: debouncedQuery, limit: maxResults }), {
            signal: controller.signal,
            headers: { 'X-Requested-With': 'XMLHttpRequest' },
        })
            .then((res) => res.json())
            .then((data) => {
                if (!controller.signal.aborted) {
                    setResults(data.results ?? []);
                }
            })
            .catch((err) => {
                if (err.name !== 'AbortError') {
                    console.error(err);
                }
            })
            .finally(() => {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            });
    }, [debouncedQuery, maxResults]);

    useEffect(() => {
        setOpen(debouncedQuery.length >= 2);
    }, [debouncedQuery]);

    const handleSelect = useCallback((item: SearchResult) => {
        if (item.url) {
            window.location.href = item.url;
        }

        setOpen(false);
        setQuery('');
        inputRef.current?.blur();
    }, []);

    const clearQuery = () => {
        setQuery('');
        inputRef.current?.focus();
    };

    // Groupement par type
    const grouped = useCallback(() => {
        const groups: Record<string, SearchResult[]> = {};

        for (const item of results) {
            const label = groupLabel[item.type] ?? item.type;

            if (!groups[label]) {
                groups[label] = [];
            }

            groups[label].push(item);
        }

        return groups;
    }, [results])();

    return (
        <div className={cn('relative w-full', className)}>
            <Popover.Root open={open} onOpenChange={setOpen}>
                <Popover.Trigger asChild>
                    <div className="relative w-full">
                        <motion.div
                            initial={false}
                            animate={open ? { scale: 1.02 } : { scale: 1 }}
                            transition={{
                                type: 'spring',
                                stiffness: 300,
                                damping: 25,
                            }}
                            className="relative"
                        >
                            <SearchIcon className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-emerald-500 dark:text-slate-500" />
                            <Input
                                ref={inputRef}
                                type="search"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder={placeholder}
                                className="h-12 rounded-2xl border-slate-200 bg-white/80 pr-12 pl-11 text-sm shadow-sm backdrop-blur transition-all duration-300 placeholder:text-slate-400 hover:border-emerald-200 focus:border-emerald-400 focus:bg-white focus:shadow-md focus:ring-4 focus:ring-emerald-500/10 dark:border-slate-700 dark:bg-slate-900/70 dark:hover:border-emerald-700 dark:focus:border-emerald-500 dark:focus:bg-slate-900"
                                autoComplete="off"
                                onKeyDown={(e) => {
                                    if (e.key === 'Escape') {
                                        setOpen(false);
                                        inputRef.current?.blur();
                                    }
                                }}
                            />
                            {query && (
                                <button
                                    type="button"
                                    onClick={clearQuery}
                                    className="absolute top-1/2 right-12 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                            {loading && (
                                <Loader2 className="absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 animate-spin text-emerald-500" />
                            )}
                        </motion.div>
                    </div>
                </Popover.Trigger>
                <Popover.Portal>
                    <AnimatePresence>
                        {open && (
                            <Popover.Content
                                forceMount
                                asChild
                                side="bottom"
                                align="start"
                                sideOffset={8}
                                onOpenAutoFocus={(e) => e.preventDefault()}
                                className="z-50 w-(--radix-popover-trigger-width)"
                            >
                                <motion.div
                                    initial={{ opacity: 0, y: -8, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                                    transition={{
                                        duration: 0.2,
                                        ease: 'easeOut',
                                    }}
                                    className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 shadow-2xl shadow-slate-200/40 backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-900/95 dark:shadow-slate-900/50"
                                >
                                    {debouncedQuery.length < 2 ? (
                                        <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
                                            <SearchIcon className="mb-3 h-8 w-8 text-slate-300 dark:text-slate-600" />
                                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                                Saisissez au moins 2 caractères…
                                            </p>
                                        </div>
                                    ) : loading ? (
                                        <div className="flex items-center justify-center px-6 py-12">
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin text-emerald-500" />
                                            <span className="text-sm text-slate-500">
                                                Recherche en cours…
                                            </span>
                                        </div>
                                    ) : results.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
                                            <div className="mb-3 rounded-full bg-slate-100 p-3 dark:bg-slate-800">
                                                <SearchIcon className="h-6 w-6 text-slate-400" />
                                            </div>
                                            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                                                Aucun résultat pour «{' '}
                                                {debouncedQuery} »
                                            </p>
                                            <p className="mt-1 text-xs text-slate-400">
                                                Essayez un autre terme ou
                                                parcourez nos catégories.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="max-h-105 overflow-y-auto overscroll-contain">
                                            {Object.entries(grouped).map(
                                                ([group, items]) => (
                                                    <div key={group}>
                                                        <div className="sticky top-0 z-10 bg-white/80 px-4 py-2 backdrop-blur dark:bg-slate-900/80">
                                                            <span className="text-xs font-semibold tracking-widest text-slate-500 uppercase dark:text-slate-400">
                                                                {group}
                                                            </span>
                                                        </div>
                                                        <div className="px-2 pb-2">
                                                            <AnimatePresence>
                                                                {items.map(
                                                                    (item) => (
                                                                        <SearchResultItem
                                                                            key={`${item.type}-${item.id}`}
                                                                            item={
                                                                                item
                                                                            }
                                                                            onSelect={
                                                                                handleSelect
                                                                            }
                                                                        />
                                                                    ),
                                                                )}
                                                            </AnimatePresence>
                                                        </div>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    )}
                                    <div className="border-t border-slate-100 px-4 py-2 dark:border-slate-800">
                                        <p className="text-center text-[10px] text-slate-400">
                                            Appuyez sur{' '}
                                            <kbd className="rounded border bg-slate-100 px-1 py-0.5 font-mono text-[10px] dark:bg-slate-800">
                                                ESC
                                            </kbd>{' '}
                                            pour fermer
                                        </p>
                                    </div>
                                </motion.div>
                            </Popover.Content>
                        )}
                    </AnimatePresence>
                </Popover.Portal>
            </Popover.Root>
        </div>
    );
}
