'use client';
// resources/js/components/chart-area-interactive.tsx

import { usePage } from '@inertiajs/react';
import * as React from 'react';
import { useCallback } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useIsMobile } from '@/hooks/use-mobile';

// Types
interface ChartDataPoint {
    date: string;
    revenue: number;
    orders: number;
    customers: number;
}

interface ChartAreaInteractiveProps {
    chartData?: ChartDataPoint[];
}

type MetricType = 'revenue' | 'orders' | 'customers';

// SUPPRIMER generateMockData - ne plus utiliser de données fictives

export function ChartAreaInteractive({
    chartData: propChartData,
}: ChartAreaInteractiveProps) {
    const isMobile = useIsMobile();
    const [timeRange, setTimeRange] = React.useState<string>('90d');
    const [selectedMetric, setSelectedMetric] =
        React.useState<MetricType>('revenue');

    // Récupérer les données depuis les props Inertia
    const { props } = usePage<{ chartStats?: ChartDataPoint[] }>();
    const chartStats = props.chartStats;

    // NE PLUS GÉNÉRER DE DONNÉES MOCK - retourner un tableau vide si pas de données
    const chartData = React.useMemo(() => {
        if (propChartData && propChartData.length > 0) {
            return propChartData;
        }

        if (chartStats && chartStats.length > 0) {
            return chartStats;
        }

        // Retourner un tableau vide au lieu de générer des données factices
        return [];
    }, [propChartData, chartStats]);

    React.useEffect(() => {
        if (isMobile) {
            setTimeRange('7d');
        }
    }, [isMobile]);

    // Filtrer les données par période - utiliser la date réelle la plus récente
    const filteredData = React.useMemo(() => {
        if (chartData.length === 0) {
            return [];
        }

        // Trouver la date la plus récente dans les données
        const dates = chartData.map((item) => new Date(item.date).getTime());
        const maxDate = new Date(Math.max(...dates));

        let daysToSubtract = 90;

        if (timeRange === '30d') {
            daysToSubtract = 30;
        } else if (timeRange === '7d') {
            daysToSubtract = 7;
        }

        const startDate = new Date(maxDate);
        startDate.setDate(startDate.getDate() - daysToSubtract);

        return chartData.filter((item) => {
            const date = new Date(item.date);

            return date >= startDate;
        });
    }, [chartData, timeRange]);

    // Calculer les totaux
    const totals = React.useMemo(() => {
        if (chartData.length === 0) {
            return { revenue: 0, orders: 0, customers: 0 };
        }

        return chartData.reduce(
            (acc, item) => ({
                revenue: acc.revenue + (item.revenue || 0),
                orders: acc.orders + (item.orders || 0),
                customers: acc.customers + (item.customers || 0),
            }),
            { revenue: 0, orders: 0, customers: 0 },
        );
    }, [chartData]);

    // Obtenir le titre de la métrique
    const getMetricTitle = useCallback((): string => {
        const titles: Record<MetricType, string> = {
            revenue: 'Chiffre d\'affaires',
            orders: 'Commandes',
            customers: 'Clients',
        };

        return titles[selectedMetric];
    }, [selectedMetric]);

    // Obtenir le total de la métrique sélectionnée
    const getMetricTotal = (): string => {
        const totalMap: Record<MetricType, number> = {
            revenue: totals.revenue,
            orders: totals.orders,
            customers: totals.customers,
        };

        if (selectedMetric === 'revenue') {
            return new Intl.NumberFormat('fr-CD', {
                style: 'currency',
                currency: 'CDF',
            }).format(totalMap[selectedMetric]);
        }

        return totalMap[selectedMetric].toLocaleString();
    };

    // Obtenir la description de la période
    const getMetricDescription = (): string => {
        const daysMap: Record<string, string> = {
            '7d': '7 jours',
            '30d': '30 jours',
            '90d': '3 mois',
        };
        const days = daysMap[timeRange] || '3 mois';

        const descriptions: Record<MetricType, string> = {
            revenue: `Total du chiffre d'affaires sur les ${days}`,
            orders: `Total des commandes sur les ${days}`,
            customers: `Total des clients sur les ${days}`,
        };

        return descriptions[selectedMetric];
    };

    // Obtenir la couleur de la métrique
    const getMetricColor = useCallback((): string => {
        const colors: Record<MetricType, string> = {
            revenue: 'var(--primary)',
            orders: '#eab308',
            customers: '#3b82f6',
        };

        return colors[selectedMetric];
    }, [selectedMetric]);

    // Obtenir l'ID du dégradé
    const getGradientId = (): string => {
        const prefix =
            selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1);

        return `fill${prefix}`;
    };

    // Configuration du graphique
    const chartConfig = React.useMemo(
        () => ({
            [selectedMetric]: {
                label: getMetricTitle(),
                color: getMetricColor(),
            },
        }),
        [getMetricColor, getMetricTitle, selectedMetric],
    );

    // Données pour le graphique
    const areaData = React.useMemo(() => {
        return filteredData.map((item) => ({
            date: item.date,
            [selectedMetric]: item[selectedMetric],
        }));
    }, [filteredData, selectedMetric]);

    // Afficher un message si pas de données
    if (chartData.length === 0) {
        return (
            <Card className="@container/card">
                <CardHeader>
                    <CardTitle>Statistiques</CardTitle>
                    <CardDescription>
                        Aucune donnée disponible pour le moment. Commencez à
                        publier des articles pour voir les statistiques.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex h-62.5 items-center justify-center">
                    <div className="text-center text-muted-foreground">
                        <p>Aucune statistique disponible</p>
                        <p className="text-sm">
                            Les données apparaîtront une fois que vous aurez des
                            articles publiés.
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="@container/card">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>{getMetricTitle()}</CardTitle>
                        <CardDescription>
                            <span className="hidden @[540px]/card:block">
                                {getMetricDescription()} - Total:{' '}
                                {getMetricTotal()}
                            </span>
                            <span className="@[540px]/card:hidden">
                                {getMetricTotal()} sur{' '}
                                {timeRange === '7d'
                                    ? '7j'
                                    : timeRange === '30d'
                                        ? '30j'
                                        : '90j'}
                            </span>
                        </CardDescription>
                    </div>
                    <CardAction>
                        {/* Sélecteur de métrique - Desktop */}
                        <div className="mr-2 hidden @[767px]/card:flex">
                            <ToggleGroup
                                type="single"
                                value={selectedMetric}
                                onValueChange={(value) => {
                                    if (value) {
                                        setSelectedMetric(value as MetricType);
                                    }
                                }}
                                variant="outline"
                                className="my-1 mr-2"
                            >
                                <ToggleGroupItem
                                    value="views"
                                    className="px-3 py-3 text-sm"
                                >
                                    Vues
                                </ToggleGroupItem>
                                <ToggleGroupItem
                                    value="likes"
                                    className="px-3 py-3 text-sm"
                                >
                                    Likes
                                </ToggleGroupItem>
                                <ToggleGroupItem
                                    value="comments"
                                    className="px-3 py-3 text-sm"
                                >
                                    Commentaires
                                </ToggleGroupItem>
                            </ToggleGroup>
                        </div>

                        {/* Sélecteur de période - Desktop */}
                        <ToggleGroup
                            type="single"
                            value={timeRange}
                            onValueChange={(value) => {
                                if (value) {
                                    setTimeRange(value);
                                }
                            }}
                            variant="outline"
                            className="hidden *:data-[slot=toggle-group-item]:px-4! @[767px]/card:flex"
                        >
                            <ToggleGroupItem value="90d">
                                3 mois
                            </ToggleGroupItem>
                            <ToggleGroupItem value="30d">
                                30 jours
                            </ToggleGroupItem>
                            <ToggleGroupItem value="7d">
                                7 jours
                            </ToggleGroupItem>
                        </ToggleGroup>

                        {/* Version mobile - métrique */}
                        <Select
                            value={selectedMetric}
                            onValueChange={(value) => {
                                if (value) {
                                    setSelectedMetric(value as MetricType);
                                }
                            }}
                        >
                            <SelectTrigger
                                className="flex w-32 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
                                size="sm"
                                aria-label="Select metric"
                            >
                                <SelectValue placeholder="Métrique" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                <SelectItem
                                    value="views"
                                    className="rounded-lg"
                                >
                                    Vues
                                </SelectItem>
                                <SelectItem
                                    value="likes"
                                    className="rounded-lg"
                                >
                                    Likes
                                </SelectItem>
                                <SelectItem
                                    value="comments"
                                    className="rounded-lg"
                                >
                                    Commentaires
                                </SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Version mobile - période */}
                        <Select value={timeRange} onValueChange={setTimeRange}>
                            <SelectTrigger
                                className="ml-2 flex w-32 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
                                size="sm"
                                aria-label="Select period"
                            >
                                <SelectValue placeholder="Période" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                <SelectItem value="90d" className="rounded-lg">
                                    3 mois
                                </SelectItem>
                                <SelectItem value="30d" className="rounded-lg">
                                    30 jours
                                </SelectItem>
                                <SelectItem value="7d" className="rounded-lg">
                                    7 jours
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </CardAction>
                </div>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-62.5 w-full"
                >
                    <AreaChart data={areaData}>
                        <defs>
                            <linearGradient
                                id={getGradientId()}
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor={getMetricColor()}
                                    stopOpacity={1.0}
                                />
                                <stop
                                    offset="95%"
                                    stopColor={getMetricColor()}
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value: string) => {
                                const date = new Date(value);

                                return date.toLocaleDateString('fr-FR', {
                                    month: 'short',
                                    day: 'numeric',
                                });
                            }}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(label) => {
                                        if (typeof label === 'string') {
                                            return new Date(
                                                label,
                                            ).toLocaleDateString('fr-FR', {
                                                month: 'short',
                                                day: 'numeric',
                                            });
                                        }

                                        return label;
                                    }}
                                    indicator="dot"
                                    formatter={(value, name) => {
                                        const labels: Record<string, string> = {
                                            views: 'Vues',
                                            likes: "J'aime",
                                            comments: 'Commentaires',
                                        };
                                        const nameKey = name as string;

                                        if (typeof value === 'number') {
                                            return `${value.toLocaleString()} ${labels[nameKey] || ''}`;
                                        }

                                        return `${value} ${labels[nameKey] || ''}`;
                                    }}
                                />
                            }
                        />
                        <Area
                            dataKey={selectedMetric}
                            type="natural"
                            fill={`url(#${getGradientId()})`}
                            stroke={getMetricColor()}
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ChartContainer>

                {/* Stats récapitulatives */}
                <div className="mt-4 grid grid-cols-3 gap-4 pt-4 text-center">
                    <button
                        type="button"
                        className={`cursor-pointer rounded-lg p-2 transition-colors ${selectedMetric === 'revenue'
                                ? 'bg-primary/10'
                                : 'hover:bg-muted'
                            }`}
                        onClick={() => setSelectedMetric('revenue')}
                    >
                        <div className="text-2xl font-bold text-primary">
                            {new Intl.NumberFormat('fr-CD', {
                                style: 'currency',
                                currency: 'CDF',
                            }).format(totals.revenue)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                            Chiffre d'affaires
                        </div>
                    </button>
                    <button
                        type="button"
                        className={`cursor-pointer rounded-lg p-2 transition-colors ${selectedMetric === 'orders'
                                ? 'bg-yellow-500/10'
                                : 'hover:bg-muted'
                            }`}
                        onClick={() => setSelectedMetric('orders')}
                    >
                        <div className="text-2xl font-bold text-yellow-500">
                            {totals.orders.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                            Commandes
                        </div>
                    </button>
                    <button
                        type="button"
                        className={`cursor-pointer rounded-lg p-2 transition-colors ${selectedMetric === 'customers'
                                ? 'bg-blue-500/10'
                                : 'hover:bg-muted'
                            }`}
                        onClick={() => setSelectedMetric('customers')}
                    >
                        <div className="text-2xl font-bold text-blue-500">
                            {totals.customers.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                            Clients
                        </div>
                    </button>
                </div>
            </CardContent>
        </Card>
    );
}
