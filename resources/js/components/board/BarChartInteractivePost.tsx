'use client';

import { usePage } from '@inertiajs/react';
import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import {
    Card,
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
import type { ChartConfig } from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';

interface ChartDataPoint {
    date: string;
    views: number;
    likes: number;
    comments: number;
}

interface ChartBarInteractiveProps {
    chartData?: ChartDataPoint[];
    title?: string;
    description?: string;
}

export function ChartBarInteractive({
    chartData: propChartData,
    title = 'Statistiques des articles',
    description = 'Évolution des vues, likes et commentaires',
}: ChartBarInteractiveProps) {
    const { props } = usePage<{ chartStats?: ChartDataPoint[] }>();
    const chartStats = props.chartStats;
    const [activeMetric, setActiveMetric] = React.useState<
        'views' | 'likes' | 'comments'
    >('views');
    const [loading, setLoading] = React.useState(true);
    const [chartData, setChartData] = React.useState<ChartDataPoint[]>([]);

    React.useEffect(() => {
        const loadData = () => {
            const data = propChartData || chartStats;

            if (data && data.length > 0) {
                setChartData(data);
            } else {
                // Données mock si nécessaire
                const mockData: ChartDataPoint[] = [];
                const endDate = new Date();

                for (let i = 0; i < 30; i++) {
                    const date = new Date(endDate);
                    date.setDate(endDate.getDate() - (29 - i));
                    mockData.push({
                        date: date.toISOString().split('T')[0],
                        views: Math.floor(Math.random() * 500) + 100,
                        likes: Math.floor(Math.random() * 100) + 10,
                        comments: Math.floor(Math.random() * 50) + 5,
                    });
                }

                setChartData(mockData);
            }

            setLoading(false);
        };

        loadData();
    }, [propChartData, chartStats]);

    const chartConfig = {
        views: {
            label: 'Vues',
            color: 'var(--chart-1)',
        },
        likes: {
            label: 'Likes',
            color: 'var(--chart-2)',
        },
        comments: {
            label: 'Commentaires',
            color: 'var(--chart-3)',
        },
    } satisfies ChartConfig;

    const total = React.useMemo(
        () => ({
            views: chartData.reduce((acc, curr) => acc + curr.views, 0),
            likes: chartData.reduce((acc, curr) => acc + curr.likes, 0),
            comments: chartData.reduce((acc, curr) => acc + curr.comments, 0),
        }),
        [chartData],
    );

    const metricLabels = {
        views: 'Vues',
        likes: 'Likes',
        comments: 'Commentaires',
    };

    if (loading) {
        return (
            <Card className="py-0">
                <CardHeader className="flex flex-col items-stretch border-b p-0! sm:flex-row">
                    <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:py-0!">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                    <div className="flex">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                            >
                                <Skeleton className="h-3 w-12" />
                                <Skeleton className="mt-1 h-8 w-20" />
                            </div>
                        ))}
                    </div>
                </CardHeader>
                <CardContent className="px-2 sm:p-6">
                    <div className="flex h-62.5 items-center justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (chartData.length === 0) {
        return (
            <Card className="py-0">
                <CardHeader className="flex flex-col items-stretch border-b p-0! sm:flex-row">
                    <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:py-0!">
                        <CardTitle>{title}</CardTitle>
                        <CardDescription>
                            Aucune donnée disponible
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="px-2 sm:p-6">
                    <div className="flex h-62.5 items-center justify-center text-muted-foreground">
                        Aucune statistique disponible
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="py-0">
            <CardHeader className="flex flex-col items-stretch border-b p-0! sm:flex-row">
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:py-0!">
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>
                        {description} - Total:{' '}
                        {total[activeMetric].toLocaleString()}{' '}
                        {metricLabels[activeMetric]}
                    </CardDescription>
                </div>
                <div className="flex">
                    {(['views', 'likes', 'comments'] as const).map((metric) => (
                        <button
                            key={metric}
                            data-active={activeMetric === metric}
                            className="relative z-30 flex flex-1 cursor-pointer flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                            onClick={() => setActiveMetric(metric)}
                        >
                            <span className="text-xs text-muted-foreground">
                                {chartConfig[metric].label}
                            </span>
                            <span className="text-lg leading-none font-bold sm:text-3xl">
                                {total[metric].toLocaleString()}
                            </span>
                        </button>
                    ))}
                </div>
            </CardHeader>
            <CardContent className="px-2 sm:p-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-62.5 w-full"
                >
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value);

                                return date.toLocaleDateString('fr-FR', {
                                    month: 'short',
                                    day: 'numeric',
                                });
                            }}
                        />
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    className="w-37.5"
                                    labelFormatter={(value) => {
                                        if (!value) {
                                            return '';
                                        }

                                        return new Date(
                                            value,
                                        ).toLocaleDateString('fr-FR', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                        });
                                    }}
                                    formatter={(value, name) => {
                                        // CORRECTION: Vérifier que value n'est pas undefined
                                        const labels = {
                                            views: 'Vues',
                                            likes: 'Likes',
                                            comments: 'Commentaires',
                                        };
                                        const metricName =
                                            name as keyof typeof labels;
                                        const numericValue =
                                            typeof value === 'number'
                                                ? value
                                                : 0;

                                        return [
                                            `${numericValue.toLocaleString()} ${labels[metricName] || ''}`,
                                            '',
                                        ];
                                    }}
                                />
                            }
                        />
                        <Bar
                            dataKey={activeMetric}
                            fill={chartConfig[activeMetric].color}
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
