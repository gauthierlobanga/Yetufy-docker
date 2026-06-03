/* eslint-disable @typescript-eslint/no-unused-vars */
// resources/js/components/dashboard-filters.tsx
'use client';

import { router } from '@inertiajs/react';
import {
    format,
    subDays,
    subWeeks,
    subMonths,
    subYears,
    startOfYear,
    endOfYear,
} from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, Filter, X, ChevronDown, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { dashboard } from '@/routes';
import tenant from '@/routes/tenant';

interface DashboardFiltersProps {
    currentFilters?: {
        period?: string;
        start_date?: string;
        end_date?: string;
        year?: string;
        month?: string;
        status?: string;
    };
}

const periodOptions = [
    { value: 'today', label: "Aujourd'hui" },
    { value: 'yesterday', label: 'Hier' },
    { value: 'last7days', label: '7 derniers jours' },
    { value: 'last30days', label: '30 derniers jours' },
    { value: 'last90days', label: '90 derniers jours' },
    { value: 'thisWeek', label: 'Cette semaine' },
    { value: 'lastWeek', label: 'Semaine dernière' },
    { value: 'thisMonth', label: 'Ce mois' },
    { value: 'lastMonth', label: 'Mois dernier' },
    { value: 'thisQuarter', label: 'Ce trimestre' },
    { value: 'lastQuarter', label: 'Trimestre dernier' },
    { value: 'thisYear', label: 'Cette année' },
    { value: 'lastYear', label: 'Année dernière' },
    { value: 'custom', label: 'Personnalisé' },
];

const yearOptions = Array.from({ length: 5 }, (_, i) => {
    const year = new Date().getFullYear() - i;

    return { value: year.toString(), label: year.toString() };
});

const monthOptions = [
    { value: '1', label: 'Janvier' },
    { value: '2', label: 'Février' },
    { value: '3', label: 'Mars' },
    { value: '4', label: 'Avril' },
    { value: '5', label: 'Mai' },
    { value: '6', label: 'Juin' },
    { value: '7', label: 'Juillet' },
    { value: '8', label: 'Août' },
    { value: '9', label: 'Septembre' },
    { value: '10', label: 'Octobre' },
    { value: '11', label: 'Novembre' },
    { value: '12', label: 'Décembre' },
];

const statusOptions = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'published', label: 'Publiés' },
    { value: 'draft', label: 'Brouillons' },
    { value: 'scheduled', label: 'Programmés' },
    { value: 'archived', label: 'Archivés' },
];

export function DashboardFilters({
    currentFilters = {},
}: DashboardFiltersProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [period, setPeriod] = useState(currentFilters.period || 'last30days');
    const [startDate, setStartDate] = useState<Date | undefined>(
        currentFilters.start_date
            ? new Date(currentFilters.start_date)
            : undefined,
    );
    const [endDate, setEndDate] = useState<Date | undefined>(
        currentFilters.end_date ? new Date(currentFilters.end_date) : undefined,
    );
    const [selectedYear, setSelectedYear] = useState(
        currentFilters.year || new Date().getFullYear().toString(),
    );
    const [selectedMonth, setSelectedMonth] = useState(
        currentFilters.month || '',
    );
    const [selectedStatus, setSelectedStatus] = useState(
        currentFilters.status || 'all',
    );

    const hasActiveFilters =
        period !== 'last30days' ||
        selectedStatus !== 'all' ||
        selectedYear !== new Date().getFullYear().toString() ||
        selectedMonth !== '';

    const applyFilters = () => {
        const params: any = {};

        params.period = period;

        if (period === 'custom' && startDate && endDate) {
            params.start_date = format(startDate, 'yyyy-MM-dd');
            params.end_date = format(endDate, 'yyyy-MM-dd');
        }

        if (selectedYear && (period === 'thisYear' || period === 'lastYear')) {
            params.year = selectedYear;
        }

        if (
            selectedMonth &&
            (period === 'thisMonth' || period === 'lastMonth')
        ) {
            params.month = selectedMonth;
        }

        if (selectedStatus && selectedStatus !== 'all') {
            params.status = selectedStatus;
        }

        router.get(dashboard().url, params, {
            preserveState: true,
            preserveScroll: true,
            only: [
                'posts',
                'chartStats',
                'stats',
                'categoriesStats',
                'postsStatusStats',
                'topPosts',
                'topAuthors',
                'weeklyActivity',
                'monthlyPostsStats',
                'hourlyPostsStats',
                'categoryPerformance',
                'topTags',
                'scheduledPosts',
            ],
        });

        setIsOpen(false);
    };

    const resetFilters = () => {
        setPeriod('last30days');
        setStartDate(undefined);
        setEndDate(undefined);
        setSelectedYear(new Date().getFullYear().toString());
        setSelectedMonth('');
        setSelectedStatus('all');

        router.get(
            dashboard().url,
            {},
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const getActiveFiltersCount = () => {
        let count = 0;

        if (period !== 'last30days') {
            count++;
        }

        if (selectedStatus !== 'all') {
            count++;
        }

        if (selectedYear !== new Date().getFullYear().toString()) {
            count++;
        }

        if (selectedMonth !== '') {
            count++;
        }

        return count;
    };

    return (
        <div className="space-y-4 px-4 lg:px-6">
            {/* Barre de filtres principale */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <Button
                        variant={isOpen ? 'default' : 'outline'}
                        onClick={() => setIsOpen(!isOpen)}
                        className="cursor-pointer gap-2 rounded-none p-4"
                    >
                        <Filter className="h-4 w-4" />
                        Filtres
                        {getActiveFiltersCount() > 0 && (
                            <Badge
                                variant="secondary"
                                className="ml-1 rounded-full px-1.5"
                            >
                                {getActiveFiltersCount()}
                            </Badge>
                        )}
                    </Button>

                    {/* Filtres rapides */}
                    <ToggleGroup
                        type="single"
                        value={period}
                        onValueChange={(value) => value && setPeriod(value)}
                        className="gap-3"
                    >
                        <ToggleGroupItem
                            value="today"
                            className="cursor-pointer p-4 text-sm"
                        >
                            Aujourd'hui
                        </ToggleGroupItem>
                        <ToggleGroupItem
                            value="last7days"
                            className="cursor-pointer p-4 text-sm"
                        >
                            7j
                        </ToggleGroupItem>
                        <ToggleGroupItem
                            value="last30days"
                            className="cursor-pointer p-4 text-sm"
                        >
                            30j
                        </ToggleGroupItem>
                        <ToggleGroupItem
                            value="thisMonth"
                            className="cursor-pointer p-4 text-sm"
                        >
                            Ce mois
                        </ToggleGroupItem>
                        <ToggleGroupItem
                            value="thisYear"
                            className="cursor-pointer p-4 text-sm"
                        >
                            Cette année
                        </ToggleGroupItem>
                    </ToggleGroup>
                </div>

                <div className="flex items-center gap-2">
                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={resetFilters}
                            className="cursor-pointer gap-1 rounded-none p-4 text-sm"
                        >
                            <RefreshCw className="h-6 w-6" />
                            Réinitialiser
                        </Button>
                    )}
                    <Button
                        onClick={applyFilters}
                        className="cursor-pointer gap-1 rounded-none p-4"
                    >
                        <Calendar className="h-6 w-6" />
                        Appliquer
                    </Button>
                </div>
            </div>

            {/* Panneau de filtres étendu */}
            {isOpen && (
                <Card className="rounded-none border shadow-xs">
                    <CardContent className="p-4">
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                            {/* Période */}
                            <div className="space-y-2 p-4">
                                <label className="text-sm font-medium">
                                    Période
                                </label>
                                <Select
                                    value={period}
                                    onValueChange={setPeriod}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner une période" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {periodOptions.map((option) => (
                                            <SelectItem
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Date range personnalisée */}
                            {period === 'custom' && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Plage personnalisée
                                    </label>
                                    <div className="flex gap-2">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="flex-1 justify-start text-left font-normal"
                                                >
                                                    <Calendar className="mr-2 h-4 w-4" />
                                                    {startDate
                                                        ? format(
                                                              startDate,
                                                              'dd/MM/yyyy',
                                                          )
                                                        : 'Début'}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <CalendarComponent
                                                    mode="single"
                                                    selected={startDate}
                                                    onSelect={setStartDate}
                                                    locale={fr}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="flex-1 justify-start text-left font-normal"
                                                >
                                                    <Calendar className="mr-2 h-4 w-4" />
                                                    {endDate
                                                        ? format(
                                                              endDate,
                                                              'dd/MM/yyyy',
                                                          )
                                                        : 'Fin'}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <CalendarComponent
                                                    mode="single"
                                                    selected={endDate}
                                                    onSelect={setEndDate}
                                                    locale={fr}
                                                    autoFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>
                            )}

                            {/* Année */}
                            {(period === 'thisYear' ||
                                period === 'lastYear') && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Année
                                    </label>
                                    <Select
                                        value={selectedYear}
                                        onValueChange={setSelectedYear}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionner une année" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {yearOptions.map((option) => (
                                                <SelectItem
                                                    key={option.value}
                                                    value={option.value}
                                                >
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            {/* Mois */}
                            {(period === 'thisMonth' ||
                                period === 'lastMonth') && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Mois
                                    </label>
                                    <Select
                                        value={selectedMonth}
                                        onValueChange={setSelectedMonth}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionner un mois" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {monthOptions.map((option) => (
                                                <SelectItem
                                                    key={option.value}
                                                    value={option.value}
                                                >
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            {/* Statut */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Statut
                                </label>
                                <Select
                                    value={selectedStatus}
                                    onValueChange={setSelectedStatus}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Tous les statuts" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {statusOptions.map((option) => (
                                            <SelectItem
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <Separator className="my-4" />

                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setIsOpen(false)}
                            >
                                Annuler
                            </Button>
                            <Button onClick={applyFilters}>
                                Appliquer les filtres
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Filtres actifs */}
            {hasActiveFilters && (
                <div className="flex flex-wrap gap-2">
                    {period !== 'last30days' && (
                        <Badge variant="secondary" className="gap-1">
                            Période:{' '}
                            {
                                periodOptions.find((p) => p.value === period)
                                    ?.label
                            }
                            <X
                                className="h-3 w-3 cursor-pointer"
                                onClick={() => setPeriod('last30days')}
                            />
                        </Badge>
                    )}
                    {selectedStatus !== 'all' && (
                        <Badge variant="secondary" className="gap-1">
                            Statut:{' '}
                            {
                                statusOptions.find(
                                    (s) => s.value === selectedStatus,
                                )?.label
                            }
                            <X
                                className="h-3 w-3 cursor-pointer"
                                onClick={() => setSelectedStatus('all')}
                            />
                        </Badge>
                    )}
                    {selectedYear !== new Date().getFullYear().toString() && (
                        <Badge variant="secondary" className="gap-1">
                            Année: {selectedYear}
                            <X
                                className="h-3 w-3 cursor-pointer"
                                onClick={() =>
                                    setSelectedYear(
                                        new Date().getFullYear().toString(),
                                    )
                                }
                            />
                        </Badge>
                    )}
                    {selectedMonth !== '' && (
                        <Badge variant="secondary" className="gap-1">
                            Mois:{' '}
                            {
                                monthOptions.find(
                                    (m) => m.value === selectedMonth,
                                )?.label
                            }
                            <X
                                className="h-3 w-3 cursor-pointer"
                                onClick={() => setSelectedMonth('')}
                            />
                        </Badge>
                    )}
                </div>
            )}
        </div>
    );
}
