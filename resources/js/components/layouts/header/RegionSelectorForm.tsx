/* eslint-disable react-hooks/set-state-in-effect */
// resources/js/components/region/RegionSelectorForm.tsx

import type { PageProps } from '@inertiajs/core';
import { router, usePage } from '@inertiajs/react';
import {
    Check,
    Globe,
    Loader2,
    MapPin,
    Languages,
    BadgeDollarSign,
    Sparkles,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

// resources/js/components/region/RegionSelectorForm.tsx

interface Country {
    code: string;
    name: string;
    continent?: string;
    currency?: string;
    phone_code?: string;
}

interface Currency {
    code: string;
    name: string;
    symbol?: string;
}

interface Language {
    code: string;
    name: string;
}

/**
 * SharedProps doit étendre PageProps pour être compatible avec :
 * usePage<SharedProps>()
 */
interface SharedProps extends PageProps {
    countries?: Country[];
    currencies?: Currency[];
    languages?: Language[];
    currentCountry?: string;
    currentCurrency?: string;
    currentLanguage?: string;
}

/* -------------------------------------------------------------------------- */
/*                              Helper Components                             */
/* -------------------------------------------------------------------------- */

interface SelectionCardProps {
    icon: React.ElementType;
    label: string;
    value?: string;
}

function SelectionCard({ icon: Icon, label, value }: SelectionCardProps) {
    return (
        <div className="rounded-2xl border border-slate-200/70 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-900/60">
            <div className="mb-1 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <Icon className="h-3.5 w-3.5" />
                </div>
                <span className="text-[11px] font-semibold tracking-[0.16em] text-slate-500 uppercase dark:text-slate-400">
                    {label}
                </span>
            </div>
            <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                {value || 'Non défini'}
            </p>
        </div>
    );
}

interface SelectorSectionProps<T extends { code: string; name: string }> {
    title: string;
    placeholder: string;
    items: T[];
    selected: T | null;
    onSelect: (item: T) => void;
    formatMeta?: (item: T) => string;
}

function SelectorSection<T extends { code: string; name: string }>({
    title,
    placeholder,
    items,
    selected,
    onSelect,
    formatMeta,
}: SelectorSectionProps<T>) {
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <label className="text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase dark:text-slate-400">
                    {title}
                </label>

                {selected && (
                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                        {selected.code.toUpperCase()}
                    </span>
                )}
            </div>

            <Command className="rounded-2xl border border-slate-200/70 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-900/60">
                <CommandInput placeholder={placeholder} className="h-10" />

                <CommandList className="max-h-56">
                    <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>

                    {items.map((item) => {
                        const isSelected = selected?.code === item.code;

                        return (
                            <CommandItem
                                key={item.code}
                                value={`${item.name} ${item.code}`}
                                onSelect={() => onSelect(item)}
                                className={cn(
                                    'group flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2',
                                    'aria-selected:bg-emerald-50 dark:aria-selected:bg-emerald-950/30',
                                )}
                            >
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                                        {item.name}
                                    </p>

                                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                        {formatMeta
                                            ? formatMeta(item)
                                            : item.code.toUpperCase()}
                                    </p>
                                </div>

                                <Check
                                    className={cn(
                                        'h-4 w-4 shrink-0 text-emerald-500 transition-opacity',
                                        isSelected
                                            ? 'opacity-100'
                                            : 'opacity-0',
                                    )}
                                />
                            </CommandItem>
                        );
                    })}
                </CommandList>
            </Command>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*                              Main Component                                */
/* -------------------------------------------------------------------------- */

export function RegionSelectorForm() {
    const { props } = usePage<SharedProps>();

    const {
        countries = [],
        currencies = [],
        languages = [],
        currentCountry,
        currentCurrency,
        currentLanguage,
    } = props;

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [selectedCountry, setSelectedCountry] = useState<Country | null>(
        null,
    );

    const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(
        null,
    );

    const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(
        null,
    );

    /* ---------------------------------------------------------------------- */
    /* Initial values                                                         */
    /* ---------------------------------------------------------------------- */

    useEffect(() => {
        if (currentCountry) {
            setSelectedCountry(
                countries.find((country) => country.code === currentCountry) ??
                    null,
            );
        }

        if (currentCurrency) {
            setSelectedCurrency(
                currencies.find(
                    (currency) => currency.code === currentCurrency,
                ) ?? null,
            );
        }

        if (currentLanguage) {
            setSelectedLanguage(
                languages.find(
                    (language) => language.code === currentLanguage,
                ) ?? null,
            );
        }
    }, [
        currentCountry,
        currentCurrency,
        currentLanguage,
        countries,
        currencies,
        languages,
    ]);

    /* ---------------------------------------------------------------------- */
    /* Derived data                                                           */
    /* ---------------------------------------------------------------------- */

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const summary = useMemo(() => {
        const country = selectedCountry?.code?.toUpperCase() ?? 'CD';
        const currency = selectedCurrency?.code?.toUpperCase() ?? 'USD';
        const language = selectedLanguage?.code?.toUpperCase() ?? 'FR';

        return `${country} • ${currency} • ${language}`;
    }, [selectedCountry, selectedCurrency, selectedLanguage]);

    const hasChanges =
        selectedCountry?.code !== currentCountry ||
        selectedCurrency?.code !== currentCurrency ||
        selectedLanguage?.code !== currentLanguage;

    /* ---------------------------------------------------------------------- */
    /* Submit                                                                 */
    /* ---------------------------------------------------------------------- */

    const handleSubmit = useCallback(() => {
        setLoading(true);

        router.post(
            route('preferences.update'),
            {
                country: selectedCountry?.code,
                currency: selectedCurrency?.code,
                locale: selectedLanguage?.code,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(
                        'Vos préférences ont été enregistrées avec succès.',
                    );
                    setOpen(false);
                },
                onError: () => {
                    toast.error(
                        'Une erreur est survenue lors de la mise à jour.',
                    );
                },
                onFinish: () => {
                    setLoading(false);
                },
            },
        );
    }, [selectedCountry, selectedCurrency, selectedLanguage]);

    /* ---------------------------------------------------------------------- */
    /* Render                                                                 */
    /* ---------------------------------------------------------------------- */

    return (
        <Popover open={open} onOpenChange={setOpen}>
            {/* Trigger */}
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                        'group h-10 rounded-full border-slate-200/70 bg-white/85',
                        'shadow-sm backdrop-blur-xl transition-all duration-300',
                        'hover:border-emerald-300 hover:bg-white hover:shadow-md hover:shadow-emerald-500/10',
                        'dark:border-slate-700 dark:bg-slate-900/80',
                        'dark:hover:border-emerald-700 dark:hover:bg-slate-900',
                    )}
                >
                    <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            <Globe className="h-5 w-5" />
                        </div>
                        {/*
                        <span className="hidden text-sm font-medium text-slate-700 sm:inline dark:text-slate-300">
                            {summary}
                        </span>

                        <ChevronDown
                            className={cn(
                                'h-4 w-4 text-slate-400 transition-transform duration-300',
                                open && 'rotate-180',
                            )}
                        /> */}
                    </div>
                </Button>
            </PopoverTrigger>

            {/* Content */}
            <PopoverContent
                align="end"
                sideOffset={12}
                className={cn(
                    'w-104 overflow-hidden rounded-3xl p-0',
                    'border border-slate-200/70 bg-white/95 backdrop-blur-2xl',
                    'shadow-[0_24px_80px_-20px_rgba(15,23,42,0.20)]',
                    'dark:border-slate-800 dark:bg-slate-950/95',
                    'dark:shadow-[0_24px_80px_-20px_rgba(0,0,0,0.65)]',
                )}
            >
                {/* Header */}
                <div className="relative overflow-hidden border-b border-slate-200/70 bg-linear-to-r from-emerald-50/90 via-white to-slate-50/90 px-5 py-4 dark:border-slate-800 dark:from-emerald-950/20 dark:via-slate-950 dark:to-slate-900">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.10),transparent_45%)]" />

                    <div className="relative">
                        <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-200/60 bg-white/80 px-2.5 py-1 text-[10px] font-semibold tracking-[0.16em] text-emerald-700 uppercase dark:border-emerald-800/40 dark:bg-emerald-500/10 dark:text-emerald-300">
                            <Sparkles className="h-3 w-3" />
                            Préférences régionales
                        </div>

                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                            Région, devise et langue
                        </h3>

                        <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                            Personnalisez votre expérience d’achat.
                        </p>
                    </div>
                </div>

                {/* Summary cards */}
                <div className="grid grid-cols-3 gap-3 px-5 py-4">
                    <SelectionCard
                        icon={MapPin}
                        label="Pays"
                        value={selectedCountry?.name}
                    />
                    <SelectionCard
                        icon={BadgeDollarSign}
                        label="Devise"
                        value={selectedCurrency?.code}
                    />
                    <SelectionCard
                        icon={Languages}
                        label="Langue"
                        value={selectedLanguage?.name}
                    />
                </div>

                {/* Selectors */}
                <div className="max-h-112 space-y-5 overflow-y-auto px-5 pb-5">
                    <SelectorSection
                        title="Pays"
                        placeholder="Rechercher un pays..."
                        items={countries}
                        selected={selectedCountry}
                        onSelect={setSelectedCountry}
                        formatMeta={(country) => country.code.toUpperCase()}
                    />

                    <SelectorSection
                        title="Devise"
                        placeholder="Rechercher une devise..."
                        items={currencies}
                        selected={selectedCurrency}
                        onSelect={setSelectedCurrency}
                        formatMeta={(currency) =>
                            `${currency.code.toUpperCase()}${
                                currency.symbol ? ` • ${currency.symbol}` : ''
                            }`
                        }
                    />

                    <SelectorSection
                        title="Langue"
                        placeholder="Rechercher une langue..."
                        items={languages}
                        selected={selectedLanguage}
                        onSelect={setSelectedLanguage}
                        formatMeta={(language) => language.code.toUpperCase()}
                    />
                </div>

                {/* Footer */}
                <div className="border-t border-slate-200/70 bg-slate-50/70 px-5 py-4 dark:border-slate-800 dark:bg-slate-900/50">
                    <Button
                        onClick={handleSubmit}
                        disabled={loading || !hasChanges}
                        className={cn(
                            'h-11 w-full rounded-2xl',
                            'bg-linear-to-r from-emerald-600 to-emerald-500',
                            'font-medium text-white',
                            'shadow-lg shadow-emerald-500/20',
                            'transition-all duration-300',
                            'hover:shadow-xl hover:shadow-emerald-500/30',
                            'disabled:cursor-not-allowed disabled:opacity-60',
                        )}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Enregistrement...
                            </>
                        ) : (
                            'Enregistrer les modifications'
                        )}
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
